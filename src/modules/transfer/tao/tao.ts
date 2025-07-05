import { getFreeBalance } from '../../../helpers/network/get-balance';
import { signAndSend } from '../../../helpers/network/sign-and-send';
import { getAccounts } from '../../../helpers/network/get-accounts';
import { validateTaoTransferParams, taoToRao, raoToTao, checkSufficientBalance } from '../../../helpers/validation';
import { estimateTransferFee } from '../fee-estimation';
import { TaoTransferParams, TransferResult, BalanceInfo } from '../types';
import {
  AccountNotFoundError,
  InsufficientBalanceError,
  TransactionFailedError,
  AccountConfigurationError,
  ExistentialDepositError
} from '../../../helpers/errors';
import BigNumber from '../../../helpers/network/bignumber';
import { EXISTENTIAL_DEPOSIT } from '../../../helpers/constants';
import { ApiPromise } from '@polkadot/api';

/**
 * Transfers TAO from one account to another
 */
export async function transferTao(params: TaoTransferParams, api: ApiPromise): Promise<TransferResult> {
  try {
    // Step 1: Validate parameters
    validateTaoTransferParams(params.to, params.amount, params.from);

    let sourceAccount;

    if (params.from) {
      // If specific source address is provided, we need to find the corresponding account
      // For now, we'll use the environment account and validate it matches
      const accounts = getAccounts();
      if (accounts.user.address !== params.from) {
        throw new AccountNotFoundError(`Source address ${params.from} does not match configured account ${accounts.user.address}`);
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

    // Step 4: Estimate transfer fee from network
    const estimatedFee = await estimateTransferFee(params.to, params.amount, api, params.from);

    // Step 5: Check source account balance
    const balanceRaw = await getFreeBalance(sourceAccount.address);
    const balanceTao = raoToTao(balanceRaw.toString());

    const balance: BalanceInfo = {
      free: balanceTao,
      reserved: '0', // TODO: to check if we can get reserved balance info from getFreeBalance
      total: balanceTao
    };

    // Step 6: Validate sufficient balance (using estimated fee)
    const balanceCheck = checkSufficientBalance(balance, params.amount, estimatedFee, sourceAccount.address);
    if (!balanceCheck.isValid) {
      throw new InsufficientBalanceError(
        new BigNumber(params.amount).plus(new BigNumber(estimatedFee)).toString(),
        balance.free,
        sourceAccount.address
      );
    }

    // Step 6.5: Check existential deposit requirement for transferKeepAlive
    const amountBN = new BigNumber(params.amount);
    const feeBN = new BigNumber(estimatedFee);
    const balanceBN = new BigNumber(balance.free);
    const existentialDepositBN = new BigNumber(EXISTENTIAL_DEPOSIT);
    const remainingBalanceAfterTransfer = balanceBN.minus(amountBN).minus(feeBN);

    if (remainingBalanceAfterTransfer.isLessThan(existentialDepositBN)) {
      // Calculate maximum transferable amount
      const maxTransferableBN = balanceBN.minus(feeBN).minus(existentialDepositBN);
      const maxTransferable = maxTransferableBN.isGreaterThan(0) ? maxTransferableBN.toString() : '0';

      throw new ExistentialDepositError(
        params.amount,
        balance.free,
        EXISTENTIAL_DEPOSIT,
        maxTransferable,
        sourceAccount.address
      );
    }

    // Step 7: Create transfer transaction
    const transferAmountRaw = taoToRao(params.amount);
    const transfer = api.tx.balances.transferKeepAlive(params.to, transferAmountRaw);

    console.log(`Transfer amount: ${params.amount} TAO (${transferAmountRaw} raw units)`);

    // Step 8: Get nonce and sign/send transaction
    const nonce = await api.rpc.system.accountNextIndex(sourceAccount.address);

    const result = await signAndSend(transfer, sourceAccount, nonce);

    if (result.error) {
      throw new TransactionFailedError(result.hash || 'unknown', result.error);
    }

    if (!result.hash) {
      throw new TransactionFailedError('unknown', 'No transaction hash returned');
    }

    // Step 9: Get block number for the transaction
    const blockHash = result.hash;
    const block = await api.rpc.chain.getBlock(blockHash);
    const blockNumber = block.block.header.number.toNumber();

    // Step 10: Get actual fee paid (if available)
    let actualFee = estimatedFee; // Use estimated fee as fallback
    try {
      // Try to get the actual fee from the transaction
      const paymentInfo = await transfer.paymentInfo(sourceAccount);
      actualFee = raoToTao(paymentInfo.partialFee.toString());
    } catch (error) {
      console.log('[WARN] Could not get actual fee, using estimated fee');
    }

    // Step 11: Return result
    const transferResult: TransferResult = {
      hash: result.hash,
      blockNumber,
      fee: actualFee,
      status: 'success',
      timestamp: Date.now(),
      amount: params.amount,
      from: sourceAccount.address,
      to: params.to
    };

    return transferResult;

  } catch (error) {
    console.error('[ERROR] Transfer failed:', error);

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

