import { getAccounts } from '../../helpers/network/get-accounts';
import { taoToRao, raoToTao } from '../../helpers/validation';
import BigNumber from '../../helpers/network/bignumber';
import { EXISTENTIAL_DEPOSIT, STAKE_FEE } from '../../helpers/constants';
import { ApiPromise } from '@polkadot/api';
import { AlphaTransferParams } from './types';

/**
 * Estimates the transaction fee for a TAO transfer by querying the network
 */
export async function estimateTransferFee(
  to: string,
  amount: string,
  api: ApiPromise,
  from?: string,
): Promise<string> {

  // Get source account
  let sourceAccount;
  if (from) {
    const accounts = getAccounts();
    if (accounts.user.address !== from) {
      throw new Error(`Source address ${from} does not match configured account`);
    }
    sourceAccount = accounts.user;
  } else {
    const accounts = getAccounts();
    sourceAccount = accounts.user;
  }

  // Create the transfer transaction using transferKeepAlive
  const transferAmountRaw = taoToRao(amount);
  const transfer = api.tx.balances.transferKeepAlive(to, transferAmountRaw);

  // Get payment info (fee estimation)
  const paymentInfo = await transfer.paymentInfo(sourceAccount);

  const feeRaw = paymentInfo.partialFee.toString();
  const fee = raoToTao(feeRaw);

  return fee;
}

/**
 * Estimates the total cost of a transfer (amount + estimated fee)
 */
export async function estimateTransferCost(
  to: string,
  amount: string,
  api: ApiPromise,
  from?: string,
): Promise<{
  amount: string;
  fee: string;
  total: string;
}> {
  const fee = await estimateTransferFee(to, amount, api, from);
  const amountBN = new BigNumber(amount);
  const feeBN = new BigNumber(fee);
  const total = amountBN.plus(feeBN).toString();

  return {
    amount,
    fee,
    total
  };
}

/**
 * Gets the existential deposit from the network
 */
export async function getExistentialDeposit(api: ApiPromise): Promise<string> {

  if (!api.consts.balances?.existentialDeposit) {
    throw new Error('Unable to retrieve existential deposit from network constants');
  }

  const existentialDeposit = api.consts.balances.existentialDeposit;
  return raoToTao(existentialDeposit.toString());
}

/**
 * Calculates the maximum transferable amount considering fees and existential deposit
 */
export async function getMaxTransferableAmount(
  to: string,
  api: ApiPromise,
  from?: string,
): Promise<{
  maxAmount: string;
  currentBalance: string;
  estimatedFee: string;
  existentialDeposit: string;
}> {
  // Get current balance
  const { getFreeBalance } = await import('../../helpers/network/get-balance');
  const { getAccounts } = await import('../../helpers/network/get-accounts');

  let sourceAccount;
  if (from) {
    const accounts = getAccounts();
    if (accounts.user.address !== from) {
      throw new Error(`Source address ${from} does not match configured account`);
    }
    sourceAccount = accounts.user;
  } else {
    const accounts = getAccounts();
    sourceAccount = accounts.user;
  }

  const balanceRaw = await getFreeBalance(sourceAccount.address);
  const currentBalance = raoToTao(balanceRaw.toString());

  // Estimate fee for a small amount to get base fee
  const estimatedFee = await estimateTransferFee(to, '0.001', api, from);



  // Calculate max transferable: balance - fee - existential deposit
  const balanceBN = new BigNumber(currentBalance);
  const feeBN = new BigNumber(estimatedFee);
  const existentialDepositBN = new BigNumber(EXISTENTIAL_DEPOSIT);

  const maxTransferableBN = balanceBN.minus(feeBN).minus(existentialDepositBN);
  const maxAmount = maxTransferableBN.isGreaterThan(0) ? maxTransferableBN.toString() : '0';

  return {
    maxAmount,
    currentBalance,
    estimatedFee,
    existentialDeposit: EXISTENTIAL_DEPOSIT
  };
}

/**
 * Estimates the fee for an Alpha transfer (stake transfer)
 */
export async function estimateAlphaTransferFee(
  params: AlphaTransferParams,
  api: ApiPromise
): Promise<string> {
  try {

    const accounts = getAccounts();
    const sourceAccount = accounts.user;

    // Create the transfer transaction for fee estimation
    const transferAmountRaw = taoToRao(params.amount);

    const transfer = api.tx.subtensorModule.transferStake(
      params.to_address,           // destination_coldkey
      params.from_hotkey,          // hotkey
      params.from_subnet,          // origin_netuid
      params.to_subnet,            // destination_netuid
      transferAmountRaw            // alpha_amount in raw units
    );

    // Get payment info for fee estimation
    const paymentInfo = await transfer.paymentInfo(sourceAccount);
    const estimatedFee = raoToTao(paymentInfo.partialFee.toString());

    return estimatedFee;

  } catch (error) {
    console.error('Error estimating Alpha transfer fee:', error);

    // Fallback to minimum stake fee if network estimation fails
    const fallbackFee = raoToTao(STAKE_FEE.toString());

    return fallbackFee;
  }
}