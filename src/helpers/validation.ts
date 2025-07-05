import { Keyring } from '@polkadot/api';
import BigNumber from './network/bignumber';
import {
  InvalidAddressError,
  InvalidAmountError,
  InvalidSubnetError,
  InvalidHotkeyError,
} from './errors';
import { AlphaTransferParams } from '../modules/transfer/types';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  details?: Record<string, any>;
}

export interface BalanceInfo {
  free: string;
  reserved: string;
  total: string;
}

/**
 * Validates a Substrate address (supports both sr25519 and ed25519)
 */
export function validateAddress(address: string): boolean {
  try {
    // Use Keyring to validate the address
    const keyring = new Keyring({ type: 'sr25519' });
    // Try to create a pair from the address - this will throw if invalid
    keyring.addFromAddress(address);
    return true;
  } catch (error) {
    try {
      // Also try with ed25519
      const keyring = new Keyring({ type: 'ed25519' });
      keyring.addFromAddress(address);
      return true;
    } catch (error2) {
      return false;
    }
  }
}

/**
 * Validates amount for any operation (transfer, stake, unstake)
 */
export function validateAmount(amount: string, operation: string = 'operation'): ValidationResult {
  try {
    const amountBN = new BigNumber(amount);

    if (amountBN.isNaN()) {
      return {
        isValid: false,
        error: 'Amount must be a valid number'
      };
    }

    if (amountBN.isLessThanOrEqualTo(0)) {
      return {
        isValid: false,
        error: 'Amount must be greater than 0'
      };
    }

    if (amountBN.isGreaterThan(1000000)) {
      return {
        isValid: false,
        error: `Amount exceeds maximum ${operation} limit (1,000,000 TAO)`
      };
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: `Invalid amount format: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Validates subnet ID (netuid) - basic validation only
 * Actual subnet existence is validated by the blockchain
 */
export function validateSubnetId(netuid: number): ValidationResult {
  if (!Number.isInteger(netuid)) {
    return {
      isValid: false,
      error: 'Subnet ID must be an integer'
    };
  }

  if (netuid < 0) {
    return {
      isValid: false,
      error: 'Subnet ID must be non-negative'
    };
  }

  return { isValid: true };
}

/**
 * Validates hotkey address
 */
export function validateHotkey(hotkey: string): ValidationResult {
  if (!hotkey || hotkey.trim().length === 0) {
    return {
      isValid: false,
      error: 'Hotkey cannot be empty'
    };
  }

  if (!validateAddress(hotkey)) {
    return {
      isValid: false,
      error: 'Invalid hotkey address format'
    };
  }

  return { isValid: true };
}

/**
 * Validates slippage tolerance
 */
export function validateSlippageTolerance(tolerance: number): ValidationResult {
  if (tolerance < 0) {
    return {
      isValid: false,
      error: 'Slippage tolerance cannot be negative'
    };
  }

  if (tolerance > 1) {
    return {
      isValid: false,
      error: 'Slippage tolerance cannot exceed 100% (1.0)'
    };
  }

  return { isValid: true };
}

/**
 * Checks if account has sufficient balance for operation
 */
export function checkSufficientBalance(
  balance: BalanceInfo,
  amount: string,
  estimatedFee: string,
  operation: string = 'operation'
): ValidationResult {
  try {
    const balanceBN = new BigNumber(balance.free);
    const amountBN = new BigNumber(amount);
    const feeBN = new BigNumber(estimatedFee);
    const requiredBN = amountBN.plus(feeBN);

    if (balanceBN.isLessThan(requiredBN)) {
      return {
        isValid: false,
        error: `Insufficient balance for ${operation}. Required: ${requiredBN.toString()} TAO, Available: ${balanceBN.toString()} TAO`,
        details: {
          balanceCheck: false
        }
      };
    }

    return {
      isValid: true,
      details: {
        balanceCheck: true
      }
    };
  } catch (error) {
    return {
      isValid: false,
      error: `Balance validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Validates common blockchain operation parameters
 */
export function validateBlockchainParams(params: {
  address?: string;
  amount?: string;
  hotkey?: string;
  netuid?: number;
  slippageTolerance?: number;
  operation?: string;
}): ValidationResult {
  const operation = params.operation || 'operation';

  // Validate address if provided
  if (params.address && !validateAddress(params.address)) {
    throw new InvalidAddressError(params.address, 'Invalid address format');
  }

  // Validate hotkey if provided
  if (params.hotkey) {
    const hotkeyValidation = validateHotkey(params.hotkey);
    if (!hotkeyValidation.isValid) {
      throw new InvalidHotkeyError(params.hotkey, hotkeyValidation.error);
    }
  }

  // Validate amount if provided
  if (params.amount) {
    const amountValidation = validateAmount(params.amount, operation);
    if (!amountValidation.isValid) {
      throw new InvalidAmountError(params.amount, amountValidation.error, operation);
    }
  }

  // Validate subnet ID if provided
  if (params.netuid !== undefined) {
    const subnetValidation = validateSubnetId(params.netuid);
    if (!subnetValidation.isValid) {
      throw new InvalidSubnetError(params.netuid, subnetValidation.error);
    }
  }

  // Validate slippage tolerance if provided
  if (params.slippageTolerance !== undefined) {
    const slippageValidation = validateSlippageTolerance(params.slippageTolerance);
    if (!slippageValidation.isValid) {
      throw new InvalidAmountError(params.slippageTolerance.toString(), slippageValidation.error, 'slippage tolerance');
    }
  }

  return {
    isValid: true,
    details: {
      addressCheck: true,
      amountCheck: true,
      hotkeyCheck: true,
      subnetCheck: true
    }
  };
}

/**
 * Validates all transfer parameters
 */
export function validateTaoTransferParams(
  to: string,
  amount: string,
  from?: string
): ValidationResult {

  // Validate destination address
  if (!validateAddress(to)) {
    throw new InvalidAddressError(to, 'Invalid destination address format');
  }

  // Validate source address if provided
  if (from && !validateAddress(from)) {
    throw new InvalidAddressError(from, 'Invalid source address format');
  }

  // Validate amount
  const amountValidation = validateAmount(amount);
  if (!amountValidation.isValid) {
    throw new InvalidAmountError(amount, amountValidation.error);
  }

  return {
    isValid: true,
    details: {
      addressCheck: true,
      amountCheck: true
    }
  };
}

/**
 * Validates Alpha transfer parameters
 */
export function validateAlphaTransferParams(params: AlphaTransferParams): void {
  // Validate destination address
  if (!validateAddress(params.to_address)) {
    throw new Error(`Invalid destination address: ${params.to_address}`);
  }

  // Validate source address if provided
  if (params.from_address && !validateAddress(params.from_address)) {
    throw new Error(`Invalid source address: ${params.from_address}`);
  }

  // Validate hotkey address
  if (!validateAddress(params.from_hotkey)) {
    throw new Error(`Invalid hotkey address: ${params.from_hotkey}`);
  }

  // Validate amount
  const amountValidation = validateAmount(params.amount);
  if (!amountValidation.isValid) {
    throw new Error(`Invalid amount: ${amountValidation.error}`);
  }

  // Validate subnet IDs
  if (!Number.isInteger(params.from_subnet) || params.from_subnet < 0) {
    throw new Error(`Invalid origin subnet ID: ${params.from_subnet}`);
  }

  if (!Number.isInteger(params.to_subnet) || params.to_subnet < 0) {
    throw new Error(`Invalid destination subnet ID: ${params.to_subnet}`);
  }

  // Validate slippage if provided
  if (params.maxSlippage !== undefined) {
    if (typeof params.maxSlippage !== 'number' || params.maxSlippage < 0 || params.maxSlippage > 100) {
      throw new Error(`Invalid max slippage: ${params.maxSlippage}. Must be between 0 and 100`);
    }
  }
}

/**
 * Converts TAO amount to raw units (1 TAO = 1e9 raw units)
 */
export function taoToRao(taoAmount: string): string {
  const amountBN = new BigNumber(taoAmount);
  return amountBN.multipliedBy(1e9).toFixed(0);
}

/**
 * Converts raw units to TAO amount
 */
export function raoToTao(rawAmount: string): string {
  const amountBN = new BigNumber(rawAmount);
  return amountBN.dividedBy(1e9).toString();
} 