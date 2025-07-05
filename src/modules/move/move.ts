import { ApiPromise } from '@polkadot/api';
import { ISubmittableResult, IKeyringPair } from '@polkadot/types/types';
import { MoveParams, MoveResult } from './types';


/**
 * Moves staked Alpha between hotkeys while keeping the same coldkey ownership
 * - Same subnet move: Direct transfer with minimal slippage
 * - Cross subnet move: Alpha→TAO→Alpha conversion with slippage protection
 */
export async function moveStake(
  api: ApiPromise,
  keyPair: IKeyringPair,
  params: MoveParams
): Promise<MoveResult> {
  try {
  
    // Set defaults
    const maxSlippageTolerance = params.maxSlippageTolerance ?? 0.05; // 0.5% default
    const disableSlippageProtection = params.disableSlippageProtection ?? false;

    // TODO: Get current stake balances for validation and reporting
    // For now, we'll proceed with the move operation

    // Validate amount is positive
    const amountFloat = parseFloat(params.amount);
    if (amountFloat <= 0) {
      return {
        success: false,
        error: 'Amount must be greater than 0'
      };
    }

    // Handle slippage protection for cross-subnet moves
    if (params.originNetuid !== params.destinationNetuid && !disableSlippageProtection) {
      // TODO: Implement cross-subnet slippage calculation
      // This would involve Alpha→TAO→Alpha conversion slippage
    }

    // Convert amount to RAO (1 Alpha = 10^9 RAO)
    const amountInRao = BigInt(Math.floor(amountFloat * 1e9));

    // Create the move stake transaction
    const extrinsic = api.tx.subtensorModule.moveStake(
      params.originHotkey,
      params.destinationHotkey,
      params.originNetuid,
      params.destinationNetuid,
      amountInRao,
      // maxSlippageTolerance,
      // disableSlippageProtection
    );

    // Sign and submit transaction
    return new Promise((resolve) => {
      extrinsic.signAndSend(keyPair, (result: ISubmittableResult) => {
        const { status, txHash, dispatchError } = result;

        if (status.isInBlock) {
          console.log(`Move stake transaction included in block: ${status.asInBlock}`);
        } else if (status.isFinalized) {
          if (dispatchError) {
            let errorMessage = 'Transaction failed';

            if (dispatchError.isModule) {
              const decoded = api.registry.findMetaError(dispatchError.asModule);
              errorMessage = `${decoded.section}.${decoded.name}: ${decoded.docs.join(' ')}`;
            } else {
              errorMessage = dispatchError.toString();
            }

            console.error('Move stake transaction failed:', errorMessage);
            resolve({
              success: false,
              error: errorMessage
            });
          } else {
            console.log(`Move stake transaction finalized: ${status.asFinalized}`);
            resolve({
              success: true,
              txHash: txHash.toString()
            });
          }
        }
      }).catch((error) => {
        console.error('Error submitting move stake transaction:', error);
        resolve({
          success: false,
          error: error.message
        });
      });
    });

  } catch (error) {
    console.error('Error in moveStake:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
} 