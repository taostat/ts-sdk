import { ApiPromise } from '@polkadot/api';
import { ISubmittableResult, IKeyringPair } from '@polkadot/types/types';
import { validateUnstakeSlippageLimits, StakingSlippageInfo } from '../../helpers/network/get-slippage';
import { UnstakeParams, UnstakeResult } from './types';

/**
 * Unstakes from a hotkey on a specific subnet
 * - Root unstaking (netuid 0): Uses removeStake, no slippage
 * - Subnet unstaking (netuid != 0): Uses removeStakeLimit with slippage protection (Alpha→TAO)
 */
export async function unstakeFromHotkey(
  api: ApiPromise,
  keyPair: IKeyringPair,
  params: UnstakeParams
): Promise<UnstakeResult> {
  try {
    // Set defaults
    const maxSlippageTolerance = params.maxSlippageTolerance ?? 0.05; // default: 0.05 for 5%
    const allowPartialUnstaking = params.allowPartialUnstaking ?? false;
    const disableSlippageProtection = params.disableSlippageProtection ?? false;

    // Estimate transaction fee using the existing API instance
    const unstakeFee = await estimateUnstakeFeeWithApi(api, params.hotkey, params.amount, params.netuid);

    let slippageInfo: StakingSlippageInfo | undefined;

    // Handle slippage protection for subnet unstaking
    if (params.netuid !== 0 && !disableSlippageProtection) {

      const slippageValidation = await validateUnstakeSlippageLimits(
        params.amount,
        params.netuid,
        unstakeFee,
        maxSlippageTolerance,
      );

      slippageInfo = slippageValidation.slippageInfo;

      if (!slippageValidation.isValid) {
        // Block transaction by default - user must explicitly disable protection
        return {
          success: false,
          error: `Slippage too high: ${slippageInfo?.slippagePercentage.toFixed(4)}% exceeds tolerance ${maxSlippageTolerance}%. Set disableSlippageProtection: true to proceed anyway.`,
          slippageInfo
        };
      }
    }

    // Convert amount to RAO (1 TAO = 10^9 RAO, 1 Alpha = 10^9 RAO)
    const amountInRao = BigInt(Math.floor(parseFloat(params.amount) * 1e9));

    let extrinsic;

    if (params.netuid === 0) {
      // Root unstaking - use removeStake (no slippage protection needed)
      extrinsic = api.tx.subtensorModule.removeStake(
        params.hotkey,
        params.netuid,
        amountInRao
      );
    } else {
      // Calculate limit price using formula: price * (1 - maxSlippage/100)
      // For unstaking (Alpha→TAO), we want minimum TAO we're willing to accept per Alpha
      let limitPrice: bigint;

      if (slippageInfo?.poolData?.subnetPool) {
        const subnetPool = slippageInfo.poolData.subnetPool;
        const slippageMultiplier = 1 - (maxSlippageTolerance / 100);
        const limitPriceInTao = subnetPool.price.multipliedBy(slippageMultiplier);
        limitPrice = BigInt(Math.floor(limitPriceInTao.toNumber() * 1e9));
      } else {
        // Fallback - this shouldn't happen if slippage validation worked
        throw new Error('Pool data not available for limit price calculation');
      }

      extrinsic = api.tx.subtensorModule.removeStakeLimit(
        params.hotkey,
        params.netuid,
        amountInRao,
        limitPrice,
        allowPartialUnstaking
      );
    }

    // Sign and submit transaction
    return new Promise((resolve) => {
      extrinsic.signAndSend(keyPair, (result: ISubmittableResult) => {
        const { status, txHash, dispatchError } = result;

        if (status.isInBlock) {
          console.log(`Unstake transaction included in block: ${status.asInBlock}`);
        } else if (status.isFinalized) {
          if (dispatchError) {
            let errorMessage = 'Transaction failed';

            if (dispatchError.isModule) {
              const decoded = api.registry.findMetaError(dispatchError.asModule);
              errorMessage = `${decoded.section}.${decoded.name}: ${decoded.docs.join(' ')}`;
            } else {
              errorMessage = dispatchError.toString();
            }

            console.error('Unstake transaction failed:', errorMessage);
            resolve({
              success: false,
              error: errorMessage,
            });
          } else {
            console.log(`Unstake transaction finalized: ${status.asFinalized}`);
            resolve({
              success: true,
              txHash: txHash.toString(),
            });
          }
        }
      }).catch((error) => {
        console.error('Error submitting unstake transaction:', error);
        resolve({
          success: false,
          error: error.message,
        });
      });
    });

  } catch (error) {
    console.error('Error in unstakeFromHotkey:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Estimates the fee for an unstake operation using an existing API instance
 */
export async function estimateUnstakeFeeWithApi(
  api: ApiPromise,
  hotkey: string,
  amount: string,
  netuid: number
): Promise<string> {
  try {

    const { getAccounts } = await import('../../helpers/network/get-accounts');
    const { taoToRao, raoToTao } = await import('../../helpers/validation');

    const accounts = getAccounts();
    const sourceAccount = accounts.user;

    // Create the unstake transaction for fee estimation
    const unstakeAmountRaw = taoToRao(amount);
    const unstakeTransaction = api.tx.subtensorModule.removeStake(
      hotkey,
      netuid,
      unstakeAmountRaw
    );

    // Get payment info for fee estimation
    const paymentInfo = await unstakeTransaction.paymentInfo(sourceAccount);
    const estimatedFee = raoToTao(paymentInfo.partialFee.toString());

    return estimatedFee;

  } catch (error) {
    console.error('Error estimating unstake fee:', error);
    throw new Error(`Failed to estimate unstake fee: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Unstakes from root network (netuid 0)
 * Convenience function for root unstaking
 */
export async function unstakeFromRoot(
  api: ApiPromise,
  keyPair: IKeyringPair,
  hotkey: string,
  amount: string,
): Promise<UnstakeResult> {
  return unstakeFromHotkey(api, keyPair, {
    hotkey,
    netuid: 0,
    amount,
    disableSlippageProtection: true, // Root unstaking doesn't need slippage protection
  });
}

/**
 * Unstakes from a subnet with slippage protection (Alpha→TAO conversion)
 * Convenience function for subnet unstaking
 */
export async function unstakeFromSubnet(
  api: ApiPromise,
  keyPair: IKeyringPair,
  hotkey: string,
  netuid: number,
  amount: string,
  maxSlippageTolerance: number = 0.05, // 5% default
  allowPartialUnstaking: boolean = false,
): Promise<UnstakeResult> {
  return unstakeFromHotkey(api, keyPair, {
    hotkey,
    netuid,
    amount,
    maxSlippageTolerance,
    allowPartialUnstaking,
  });
} 