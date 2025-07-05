import { getPoolPrices } from './get-pool-prices';
import BigNumber from './bignumber';
import { AlphaTransferParams, SlippageInfo } from '../../modules/transfer/types';

export interface StakingSlippageInfo {
  slippagePercentage: number;
  receivedAmount: string;
  idealAmount: string;
  poolData?: {
    subnetPool?: any;
  };
}

/**
 * Calculates slippage for TAO → Alpha conversion (staking to subnet)
 */
export async function calculateStakeSlippage(
  taoAmount: string,
  netuid: number,
  stakeFee: string
): Promise<StakingSlippageInfo> {
  try {
    if (netuid === 0) {
      // Root staking - no conversion, no slippage
      return {
        slippagePercentage: 0,
        receivedAmount: taoAmount,
        idealAmount: taoAmount,
        poolData: { subnetPool: null }
      };
    }

    // Subnet staking - TAO → Alpha conversion
    const poolPricesMap = await getPoolPrices();
    const subnetPool = poolPricesMap.get(netuid);

    if (!subnetPool) {
      throw new Error(`Pool data not available for subnet ${netuid}`);
    }

    // Amount after fee
    const taoAfterFee = new BigNumber(taoAmount).minus(stakeFee);
    if (taoAfterFee.isLessThanOrEqualTo(0)) {
      throw new Error(`Stake amount too small - fee ${stakeFee} TAO exceeds stake amount ${taoAmount} TAO`);
    }

    // Convert TAO to Alpha using AMM formula
    const taoReserves = subnetPool.tao.plus(subnetPool.taoEmission);
    const alphaReserves = subnetPool.alpha.plus(subnetPool.alphaEmission);

    const receivedAlpha = getAlphaFromTaoForSlippageCalc(
      taoAfterFee.toString(),
      taoReserves.toString(),
      alphaReserves.toString()
    );

    console.log(`${taoAfterFee.toString()} TAO -> Alpha ${receivedAlpha} in subnet ${netuid}`);

    // Calculate slippage vs ideal 1:1 conversion
    const idealAlpha = new BigNumber(taoAmount);
    const actualAlpha = new BigNumber(receivedAlpha);

    const slippage = idealAlpha.minus(actualAlpha).dividedBy(idealAlpha).multipliedBy(100);
    const slippagePercentage = Math.max(0, slippage.toNumber());

    console.log(`Price: ${subnetPool.price.toString()} TAO per Alpha`);

    return {
      slippagePercentage,
      receivedAmount: receivedAlpha,
      idealAmount: taoAmount,
      poolData: { subnetPool }
    };

  } catch (error) {
    console.error('Error calculating stake slippage:', error);
    throw new Error(`Failed to calculate stake slippage: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Calculates slippage for Alpha → TAO conversion (unstaking from subnet)
 */
export async function calculateUnstakeSlippage(
  alphaAmount: string,
  netuid: number,
  unstakeFee: string
): Promise<StakingSlippageInfo> {
  try {
    if (netuid === 0) {
      return {
        slippagePercentage: 0,
        receivedAmount: alphaAmount,
        idealAmount: alphaAmount,
        poolData: { subnetPool: null }
      };
    }

    // Subnet unstaking - Alpha → TAO conversion
    const poolPricesMap = await getPoolPrices();
    const subnetPool = poolPricesMap.get(netuid);

    if (!subnetPool) {
      throw new Error(`Pool data not available for subnet ${netuid}`);
    }

    // Convert Alpha to TAO using AMM formula
    const alphaReserves = subnetPool.alpha;
    const taoReserves = subnetPool.tao;

    const receivedTao = getTaoFromAlphaForSlippageCalc(
      alphaAmount,
      alphaReserves.toString(),
      taoReserves.toString()
    );

    console.log(`Alpha ${alphaAmount} -> TAO ${receivedTao} from subnet ${netuid}`);

    // Calculate ideal TAO value
    const idealTaoAmount = new BigNumber(alphaAmount).multipliedBy(subnetPool.price);

    // Calculate slippage BEFORE applying fees
    const actualTaoAmount = new BigNumber(receivedTao);
    const totalSlippage = idealTaoAmount.minus(actualTaoAmount);
    const slippage = totalSlippage.dividedBy(idealTaoAmount).multipliedBy(100);
    const slippagePercentage = Math.max(0, slippage.toNumber());

    // Apply fee after slippage calculation
    const taoAfterFee = actualTaoAmount.minus(unstakeFee);
    if (taoAfterFee.isLessThanOrEqualTo(0)) {
      throw new Error(`Unstake amount too small - fee ${unstakeFee} TAO exceeds converted amount ${receivedTao} TAO`);
    }

    console.log(`Price: ${subnetPool.price.toString()} TAO per Alpha`);

    return {
      slippagePercentage,
      receivedAmount: taoAfterFee.toString(),
      idealAmount: idealTaoAmount.toString(),
      poolData: { subnetPool }
    };

  } catch (error) {
    console.error('Error calculating unstake slippage:', error);
    throw new Error(`Failed to calculate unstake slippage: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validates if staking would exceed slippage limits
 */
export async function validateStakeSlippageLimits(
  taoAmount: string,
  netuid: number,
  stakeFee: string,
  maxSlippageTolerance: number,
): Promise<{ isValid: boolean; slippageInfo?: StakingSlippageInfo; error?: string }> {
  try {
    const slippageInfo = await calculateStakeSlippage(taoAmount, netuid, stakeFee);

    if (slippageInfo.slippagePercentage > maxSlippageTolerance) {
      return {
        isValid: false,
        slippageInfo,
        error: `Stake slippage ${slippageInfo.slippagePercentage.toFixed(2)}% exceeds maximum allowed ${maxSlippageTolerance}%`
      };
    }

    return {
      isValid: true,
      slippageInfo,
    };

  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown error validating stake slippage'
    };
  }
}

/**
 * Validates if unstaking would exceed slippage limits
 */
export async function validateUnstakeSlippageLimits(
  alphaAmount: string,
  netuid: number,
  unstakeFee: string,
  maxSlippageTolerance: number,
): Promise<{ isValid: boolean; slippageInfo?: StakingSlippageInfo; error?: string }> {
  try {
    const slippageInfo = await calculateUnstakeSlippage(alphaAmount, netuid, unstakeFee);

    if (slippageInfo.slippagePercentage > maxSlippageTolerance) {
      return {
        isValid: false,
        slippageInfo,
        error: `Unstake slippage ${slippageInfo.slippagePercentage.toFixed(2)}% exceeds maximum allowed ${maxSlippageTolerance}%`
      };
    }

    return {
      isValid: true,
      slippageInfo
    };

  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown error validating unstake slippage'
    };
  }
}

/**
 * Calculates TAO received from Alpha using constant product formula for slippage calculations
 */
export function getTaoFromAlphaForSlippageCalc(
  alphaAmount: string,
  alphaReserves: string,
  taoReserves: string
): string {
  const alpha = new BigNumber(alphaAmount);
  const alphaPool = new BigNumber(alphaReserves);
  const taoPool = new BigNumber(taoReserves);

  // Constant product formula: x * y = k
  // After adding alpha input: (alphaPool + alpha) * (taoPool - taoOut) = k
  // Solving for taoOut: taoOut = taoPool - (k / (alphaPool + alpha))
  const k = alphaPool.multipliedBy(taoPool);
  const newTaoReserves = k.dividedBy(alphaPool.plus(alpha));
  const taoOut = taoPool.minus(newTaoReserves);

  return taoOut.toString();
}

/**
 * Calculates Alpha received from TAO using constant product formula for slippage calculations
 */
export function getAlphaFromTaoForSlippageCalc(
  taoAmount: string,
  taoReserves: string,
  alphaReserves: string
): string {
  const tao = new BigNumber(taoAmount);
  const taoPool = new BigNumber(taoReserves);
  const alphaPool = new BigNumber(alphaReserves);

  // Constant product formula: x * y = k
  // After adding tao input: (taoPool + tao) * (alphaPool - alphaOut) = k
  // Solving for alphaOut: alphaOut = alphaPool - (k / (taoPool + tao))
  const k = taoPool.multipliedBy(alphaPool);
  const newAlphaReserves = k.dividedBy(taoPool.plus(tao));
  const alphaOut = alphaPool.minus(newAlphaReserves);

  return alphaOut.toString();
}

/**
 * Calculates slippage for Alpha transfer using real on-chain pool data only
 */
export async function calculateAlphaTransferSlippage(
  params: AlphaTransferParams,
  stakeFee: string,
): Promise<SlippageInfo> {
  try {
    const transferAmount = new BigNumber(params.amount);

    if (params.from_subnet === params.to_subnet) {
      // Same subnet transfer - minimal slippage (mainly transaction fees)
      const receivedAmount = transferAmount.toString();

      return {
        slippagePercentage: 0.01, // Minimal slippage for same-subnet
        receivedAmount,
        idealAmount: params.amount,
        poolData: {
          originPool: null,
          destinationPool: null
        }
      };
    }

    // Cross-subnet transfer - get real pool data
    const poolPricesMap = await getPoolPrices();

    const originPool = poolPricesMap.get(params.from_subnet);
    const destinationPool = poolPricesMap.get(params.to_subnet);

    if (!originPool || !destinationPool) {
      throw new Error(`Pool data not available for subnets ${params.from_subnet} or ${params.to_subnet}`);
    }

    // Step 1: Convert Alpha to TAO in origin subnet (using base reserves only, matching Python CLI)
    const originAlphaReserves = originPool.alpha;
    const originTaoReserves = originPool.tao;

    const taoFromAlpha = getTaoFromAlphaForSlippageCalc(
      transferAmount.toString(),
      originAlphaReserves.toString(),
      originTaoReserves.toString()
    );

    console.log(`Alpha ${params.amount} -> TAO ${taoFromAlpha} in origin subnet`);

    // Step 2: Subtract stake fee
    const taoAfterFee = new BigNumber(taoFromAlpha).minus(stakeFee);

    if (taoAfterFee.isLessThanOrEqualTo(0)) {
      throw new Error(`Transfer amount too small - fee ${stakeFee} TAO exceeds converted amount ${taoFromAlpha} TAO`);
    }

    console.log(`TAO after fee: ${taoAfterFee.toString()}`);

    // Step 3: Convert TAO to Alpha in destination subnet (using base reserves only, matching Python CLI)
    const destTaoReserves = destinationPool.tao;
    const destAlphaReserves = destinationPool.alpha;

    const finalAlpha = getAlphaFromTaoForSlippageCalc(
      taoAfterFee.toString(),
      destTaoReserves.toString(),
      destAlphaReserves.toString()
    );

    // Step 4: Calculate slippage
    const receivedAmount = new BigNumber(finalAlpha);
    const idealAmount = transferAmount; // What we'd get with no slippage

    const slippage = idealAmount.minus(receivedAmount).dividedBy(idealAmount).multipliedBy(100);
    const slippagePercentage = Math.max(0, slippage.toNumber()); // Ensure non-negative

    return {
      slippagePercentage,
      receivedAmount: receivedAmount.toString(),
      idealAmount: params.amount,
      poolData: {
        originPool,
        destinationPool
      }
    };

  } catch (error) {
    console.error('Error calculating slippage:', error);
    throw new Error(`Failed to calculate slippage: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}