import { signAndSend } from '../../../helpers/network/sign-and-send';
import { getAccounts } from '../../../helpers/network/get-accounts';
import { validateAlphaTransferParams, taoToRao } from '../../../helpers/validation';
import { estimateAlphaTransferFee } from '../fee-estimation';
import { AlphaTransferParams, TransferResult } from '../types';
import {
  AccountNotFoundError,
  InsufficientBalanceError,
  TransactionFailedError,
  AccountConfigurationError,
  ExistentialDepositError
} from '../../../helpers/errors';
import BigNumber from '../../../helpers/network/bignumber';
import { checkSubnetExists, getStakeBalance } from '../../../helpers/network/get-storage';
import { calculateAlphaTransferSlippage } from '../../../helpers/network/get-slippage';
import { ApiPromise } from '@polkadot/api';

/**
 * Transfers Alpha tokens between subnets (stake transfer)
 */
export async function transferAlpha(params: AlphaTransferParams, api: ApiPromise): Promise<TransferResult> {

  try {
    // Step 1: Validate parameters
    validateAlphaTransferParams(params);

    // Step 2: Get source account
    let sourceAccount;

    if (params.from_address) {
      // If specific source address is provided, we need to find the corresponding account
      const accounts = getAccounts();
      if (accounts.user.address !== params.from_address) {
        throw new AccountNotFoundError(`Source address ${params.from_address} does not match configured account ${accounts.user.address}`);
      }
      sourceAccount = accounts.user;
    } else {
      // Use account from environment
      try {
        const accounts = getAccounts();
        sourceAccount = accounts.user;
      } catch (error) {
        throw new AccountConfigurationError(
          'No account configuration found. Please set TAO_ACCOUNT_SEED or TAO_ACCOUNT_PRIVATE_KEY in environment variables'
        );
      }
    }

    // Step 3: Validate both subnets exist
    const [originExists, destExists] = await Promise.all([
      checkSubnetExists(params.from_subnet),
      checkSubnetExists(params.to_subnet)
    ]);

    if (!originExists) {
      throw new Error(`Origin subnet ${params.from_subnet} does not exist`);
    }

    if (!destExists) {
      throw new Error(`Destination subnet ${params.to_subnet} does not exist`);
    }

    // Step 4: Get current stake balances
    const [currentStake, currentDestStake] = await Promise.all([
      getStakeBalance(sourceAccount.address, params.from_hotkey, params.from_subnet),
      getStakeBalance(params.to_address, params.from_hotkey, params.to_subnet)
    ]);

    if (parseFloat(currentStake) === 0) {
      throw new Error(`No stake found for hotkey: ${params.from_hotkey} on subnet: ${params.from_subnet}`);
    }

    // Step 5: Validate sufficient stake to transfer
    const transferAmount = new BigNumber(params.amount);
    const availableStake = new BigNumber(currentStake);

    if (transferAmount.isGreaterThan(availableStake)) {
      throw new InsufficientBalanceError(
        params.amount,
        currentStake,
        sourceAccount.address
      );
    }

    // Step 6: Estimate transfer fee and calculate slippage
    const estimatedFee = await estimateAlphaTransferFee(params, api);
    const slippageInfo = await calculateAlphaTransferSlippage(params, estimatedFee);

    // Step 7: Check slippage tolerance
    if (params.maxSlippage && slippageInfo.slippagePercentage > params.maxSlippage) {
      throw new Error(`Slippage ${slippageInfo.slippagePercentage}% exceeds maximum allowed ${params.maxSlippage}%`);
    }

    // Step 8: Create transfer transaction
    const transferAmountRaw = taoToRao(params.amount);

    const transfer = api.tx.subtensorModule.transferStake(
      params.to_address,           // destination_coldkey
      params.from_hotkey,          // hotkey
      params.from_subnet,          // origin_netuid
      params.to_subnet,            // destination_netuid
      transferAmountRaw            // alpha_amount in raw units
    );

    // Step 9: Get nonce and sign/send transaction
    const nonce = await api.rpc.system.accountNextIndex(sourceAccount.address);

    const result = await signAndSend(transfer, sourceAccount, nonce);

    if (result.error) {
      throw new TransactionFailedError(result.hash || 'unknown', result.error);
    }

    if (!result.hash) {
      throw new TransactionFailedError('unknown', 'No transaction hash returned');
    }

    // Step 10: Get block number for the transaction
    const blockHash = result.hash;
    const block = await api.rpc.chain.getBlock(blockHash);
    const blockNumber = block.block.header.number.toNumber();

    // Step 11: Return result
    const transferResult: TransferResult = {
      hash: result.hash,
      blockNumber,
      fee: estimatedFee,
      status: 'success',
      timestamp: Date.now(),
      amount: params.amount,
      from: sourceAccount.address,
      to: params.to_address
    };

    return transferResult;

  } catch (error) {
    console.error('[ERROR] Alpha transfer failed:', error);

    // Re-throw known errors
    if (error instanceof AccountNotFoundError ||
      error instanceof InsufficientBalanceError ||
      error instanceof TransactionFailedError ||
      error instanceof AccountConfigurationError ||
      error instanceof ExistentialDepositError) {
      throw error;
    }

    // Wrap unknown errors
    throw new TransactionFailedError('unknown', error instanceof Error ? error.message : 'Unknown error occurred');
  }
} 