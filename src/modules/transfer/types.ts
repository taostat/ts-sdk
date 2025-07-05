/**
 * Parameters for TAO transfer
 */
export interface TaoTransferParams {
  /** Destination coldkey address */
  to: string;
  /** Amount to transfer in TAO (as string to avoid precision issues) */
  amount: string;
  /** Optional source coldkey address (if not provided, uses account from environment) */
  from?: string;
}

/**
 * Result of a transfer operation
 */
export interface TransferResult {
  /** Transaction hash */
  hash: string;
  /** Block number where transaction was included */
  blockNumber: number;
  /** Fee paid for the transaction in TAO */
  fee: string;
  /** Transfer status */
  status: 'success' | 'failed';
  /** Timestamp when transfer was completed */
  timestamp: number;
  /** Amount transferred in TAO */
  amount: string;
  /** Source address */
  from: string;
  /** Destination address */
  to: string;
}

/**
 * Parameters for alpha transfer (for future implementation)
 */
export interface AlphaTransferParams {
  /** Source subnet ID */
  from_subnet: number;
  /** Destination subnet ID */
  to_subnet: number;
  /** Source coldkey address (optional, uses account from environment if not provided) */
  from_address?: string;
  /** Source hotkey address */
  from_hotkey: string;
  /** Destination coldkey address */
  to_address: string;
  /** Amount to transfer in alpha */
  amount: string;
  /** Maximum acceptable slippage percentage (optional, defaults to 5%) */
  maxSlippage?: number;
}

/**
 * Balance information for an account
 */
export interface BalanceInfo {
  /** Free balance in TAO */
  free: string;
  /** Reserved balance in TAO */
  reserved: string;
  /** Total balance in TAO */
  total: string;
}

/**
 * Account configuration for transfers
 */
export interface AccountConfig {
  /** Mnemonic seed phrase */
  seed?: string;
  /** Raw private key in hex format */
  privateKey?: string;
  /** Account address (for validation) */
  address?: string;
  /** Key type */
  type?: 'sr25519' | 'ed25519';
}

/**
 * Transfer validation result
 */
export interface ValidationResult {
  /** Whether validation passed */
  isValid: boolean;
  /** Error message if validation failed */
  error?: string;
  /** Additional validation details */
  details?: {
    balanceCheck?: boolean;
    addressCheck?: boolean;
    amountCheck?: boolean;
  };
}

export interface SlippageInfo {
  slippagePercentage: number;
  receivedAmount: string;
  idealAmount: string;
  poolData?: {
    originPool?: any;
    destinationPool?: any;
  };
}

/**
 * Parameters for alpha transfer (for future implementation)
 */
export interface AlphaTransferParams {
  /** Source subnet ID */
  from_subnet: number;
  /** Destination subnet ID */
  to_subnet: number;
  /** Source coldkey address (optional, uses account from environment if not provided) */
  from_address?: string;
  /** Source hotkey address */
  from_hotkey: string;
  /** Destination coldkey address */
  to_address: string;
  /** Amount to transfer in alpha */
  amount: string;
  /** Maximum acceptable slippage percentage (optional, defaults to 5%) */
  maxSlippage?: number;
}