import { ApiPromise } from '@polkadot/api';
import { ISubmittableResult, IKeyringPair } from '@polkadot/types/types';
import { validateStakeSlippageLimits, StakingSlippageInfo } from '../../helpers/network/get-slippage';
import BigNumber from '../../helpers/network/bignumber';
import { StakeParams, StakeResult } from './types';

/**
 * Stakes to a hotkey on a specific subnet
 * - Root staking (netuid 0): Uses addStake, no slippage
 * - Subnet staking (netuid != 0): Uses addStakeLimit with slippage protection
 */
export async function stakeToHotkey(
  api: ApiPromise,
  keyPair: IKeyringPair,
  params: StakeParams
): Promise<StakeResult> {
  try {

    // Set defaults
    const maxSlippageTolerance = params.maxSlippageTolerance ?? 0.05; // default: 0.05 for 5%
    const allowPartialStaking = params.allowPartialStaking ?? false;
    const disableSlippageProtection = params.disableSlippageProtection ?? false;

    // Estimate transaction fee using the existing API instance
    const stakeFee = await estimateStakeFeeWithApi(api, params.hotkey, params.amount, params.netuid);

    // Calculate actual staked amount (intended amount - transaction fee)
    const actualStakedAmount = (parseFloat(params.amount) - parseFloat(stakeFee)).toString();

    let slippageInfo: StakingSlippageInfo | undefined;

    // Handle slippage protection for subnet staking
    if (params.netuid !== 0 && !disableSlippageProtection) {

      const slippageValidation = await validateStakeSlippageLimits(
        params.amount,
        params.netuid,
        stakeFee,
        maxSlippageTolerance,
      );

      slippageInfo = slippageValidation.slippageInfo;

      if (!slippageValidation.isValid) {
        // Block transaction by default - user must explicitly disable protection
        return {
          success: false,
          error: `Slippage too high: ${slippageInfo?.slippagePercentage.toFixed(4)}% exceeds tolerance ${maxSlippageTolerance}%. Set disableSlippageProtection: true to proceed anyway.`,
          stakedAmount: actualStakedAmount,
          slippageInfo
        };
      }

    }

    // Convert amount to RAO (1 TAO = 10^9 RAO)
    const amountInRao = BigInt(Math.floor(parseFloat(params.amount) * 1e9));

    let extrinsic;

    if (params.netuid === 0) {
      // Root staking - use addStake (no slippage protection needed)
      extrinsic = api.tx.subtensorModule.addStake(
        params.hotkey,
        params.netuid,
        amountInRao
      );
    } else {
      // For staking (TAO→Alpha), we want minimum Alpha we're willing to accept per TAO
      // subnetPool.price is TAO per Alpha, so we need the inverse (Alpha per TAO)
      let limitPrice: bigint;

      if (slippageInfo?.poolData?.subnetPool) {
        const subnetPool = slippageInfo.poolData.subnetPool;
        // Alpha per TAO = 1 / (TAO per Alpha)
        const alphaPerTao = new BigNumber(1).dividedBy(subnetPool.price);
        const slippageMultiplier = 1 - (maxSlippageTolerance / 100);
        const limitPriceInAlpha = alphaPerTao.multipliedBy(slippageMultiplier);
        limitPrice = BigInt(Math.floor(limitPriceInAlpha.toNumber() * 1e9));
      } else {
        // Fallback - this shouldn't happen if slippage validation worked
        throw new Error('Pool data not available for limit price calculation');
      }

      extrinsic = api.tx.subtensorModule.addStakeLimit(
        params.hotkey,
        params.netuid,
        amountInRao,
        limitPrice,
        allowPartialStaking
      );
    }

    // Sign and submit transaction
    return new Promise((resolve) => {
      extrinsic.signAndSend(keyPair, (result: ISubmittableResult) => {
        const { status, txHash, dispatchError } = result;

        if (status.isInBlock) {
          console.log(`Stake transaction included in block: ${status.asInBlock}`);
        } else if (status.isFinalized) {
          if (dispatchError) {
            let errorMessage = 'Transaction failed';

            if (dispatchError.isModule) {
              const decoded = api.registry.findMetaError(dispatchError.asModule);
              errorMessage = `${decoded.section}.${decoded.name}: ${decoded.docs.join(' ')}`;
            } else {
              errorMessage = dispatchError.toString();
            }

            console.error('Stake transaction failed:', errorMessage);
            resolve({
              success: false,
              error: errorMessage,
              stakedAmount: actualStakedAmount,
            });
          } else {
            console.log(`Stake transaction finalized: ${status.asFinalized}`);
            resolve({
              success: true,
              txHash: txHash.toString(),
              stakedAmount: actualStakedAmount,
            });
          }
        }
      }).catch((error) => {
        console.error('Error submitting stake transaction:', error);
        resolve({
          success: false,
          error: error.message,
          stakedAmount: actualStakedAmount,
        });
      });
    });

  } catch (error) {
    console.error('Error in stakeToHotkey:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stakedAmount: params.amount,
    };
  }
}

/**
 * Estimates the fee for a stake operation using an existing API instance
 */
export async function estimateStakeFeeWithApi(
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

    // Create the stake transaction for fee estimation
    const stakeAmountRaw = taoToRao(amount);
    const stakeTransaction = api.tx.subtensorModule.addStake(
      hotkey,
      netuid,
      stakeAmountRaw
    );

    // Get payment info for fee estimation
    const paymentInfo = await stakeTransaction.paymentInfo(sourceAccount);
    const estimatedFee = raoToTao(paymentInfo.partialFee.toString());

    return estimatedFee;

  } catch (error) {
    console.error('Error estimating stake fee:', error);
    throw new Error(`Failed to estimate stake fee: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Stakes TAO to root network (netuid 0)
 * Convenience function for root staking
 */
export async function stakeToRoot(
  api: ApiPromise,
  keyPair: IKeyringPair,
  hotkey: string,
  amount: string,
): Promise<StakeResult> {
  return stakeToHotkey(api, keyPair, {
    hotkey,
    netuid: 0,
    amount,
    disableSlippageProtection: true, // Root staking doesn't need slippage protection
  });
}

/**
 * Stakes TAO to a subnet with slippage protection
 * Convenience function for subnet staking
 */
export async function stakeToSubnet(
  api: ApiPromise,
  keyPair: IKeyringPair,
  hotkey: string,
  netuid: number,
  amount: string,
  maxSlippageTolerance: number = 0.05, // 5% default
  allowPartialStaking: boolean = false,
): Promise<StakeResult> {
  return stakeToHotkey(api, keyPair, {
    hotkey,
    netuid,
    amount,
    maxSlippageTolerance,
    allowPartialStaking,
  });
}
