/**
 * Base error class for all blockchain operation errors
 */
export class BlockchainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BlockchainError';
  }
}

/**
 * Error thrown when account has insufficient balance for operation
 */
export class InsufficientBalanceError extends BlockchainError {
  constructor(required: string, available: string, account: string, operation: string = 'operation') {
    super(`Insufficient balance for ${operation} on account ${account}. Required: ${required} TAO (including fees), Available: ${available} TAO`);
    this.name = 'InsufficientBalanceError';
  }
}

/**
 * Error thrown when an invalid address is provided
 */
export class InvalidAddressError extends BlockchainError {
  constructor(address: string, reason?: string) {
    super(`Invalid address: ${address}${reason ? ` - ${reason}` : ''}`);
    this.name = 'InvalidAddressError';
  }
}

/**
 * Error thrown when account is not found or cannot be created
 */
export class AccountNotFoundError extends BlockchainError {
  constructor(identifier: string) {
    super(`Account not found or cannot be created: ${identifier}`);
    this.name = 'AccountNotFoundError';
  }
}

/**
 * Error thrown when amount is invalid
 */
export class InvalidAmountError extends BlockchainError {
  constructor(amount: string, reason?: string, operation: string = 'operation') {
    super(`Invalid ${operation} amount: ${amount}${reason ? ` - ${reason}` : ''}`);
    this.name = 'InvalidAmountError';
  }
}

/**
 * Error thrown when blockchain transaction fails
 */
export class TransactionFailedError extends BlockchainError {
  constructor(hash: string, reason?: string) {
    super(`Transaction failed with hash ${hash}${reason ? `: ${reason}` : ''}`);
    this.name = 'TransactionFailedError';
  }
}

/**
 * Error thrown when account configuration is missing or invalid
 */
export class AccountConfigurationError extends BlockchainError {
  constructor(message: string) {
    super(`Account configuration error: ${message}`);
    this.name = 'AccountConfigurationError';
  }
}

/**
 * Error thrown when an operation would bring the account balance below existential deposit
 */
export class ExistentialDepositError extends BlockchainError {
  constructor(
    public readonly attemptedAmount: string,
    public readonly currentBalance: string,
    public readonly existentialDeposit: string,
    public readonly maxAmount: string,
    public readonly accountAddress: string,
    public readonly operation: string = 'operation'
  ) {
    super(
      `${operation} of ${attemptedAmount} TAO would bring account balance below existential deposit (${existentialDeposit} TAO). ` +
      `Current balance: ${currentBalance} TAO. Maximum ${operation.toLowerCase()}: ${maxAmount} TAO.`
    );
    this.name = 'ExistentialDepositError';
  }
}

/**
 * Error thrown when subnet/netuid is invalid
 */
export class InvalidSubnetError extends BlockchainError {
  constructor(netuid: number, reason?: string) {
    super(`Invalid subnet ${netuid}${reason ? ` - ${reason}` : ''}`);
    this.name = 'InvalidSubnetError';
  }
}

/**
 * Error thrown when hotkey is invalid
 */
export class InvalidHotkeyError extends BlockchainError {
  constructor(hotkey: string, reason?: string) {
    super(`Invalid hotkey: ${hotkey}${reason ? ` - ${reason}` : ''}`);
    this.name = 'InvalidHotkeyError';
  }
}

/**
 * Error thrown when slippage tolerance is exceeded
 */
export class SlippageToleranceExceededError extends BlockchainError {
  constructor(
    public readonly actualSlippage: number,
    public readonly maxSlippage: number,
    public readonly operation: string = 'operation'
  ) {
    super(
      `${operation} slippage ${actualSlippage.toFixed(2)}% exceeds maximum tolerance ${maxSlippage.toFixed(2)}%`
    );
    this.name = 'SlippageToleranceExceededError';
  }
}

/**
 * Error thrown when insufficient stake is available for operation
 */
export class InsufficientStakeError extends BlockchainError {
  constructor(
    public readonly required: string,
    public readonly available: string,
    public readonly hotkey: string,
    public readonly subnet?: number
  ) {
    const subnetInfo = subnet !== undefined ? ` on subnet ${subnet}` : '';
    super(
      `Insufficient stake for hotkey ${hotkey}${subnetInfo}. Required: ${required} TAO, Available: ${available} TAO`
    );
    this.name = 'InsufficientStakeError';
  }
}

// Legacy exports for backward compatibility with transfer module
export class TransferError extends BlockchainError {
  constructor(message: string) {
    super(message);
    this.name = 'TransferError';
  }
} 