import { BaseQueryParams, AddressType, PaginatedResponse } from '../../types/common';


// Account data structure (used by getAccount and getAccountHistory)
export interface AccountData {
  address: AddressType;
  network: string;
  block_number: number;
  timestamp: string;
  rank: number;
  balance_free: string; // Free balance in rao
  balance_staked: string; // Total staked balance in rao
  balance_staked_alpha_as_tao: string; // Staked in alpha subnet in rao
  balance_staked_root: string; // Staked to root in rao
  balance_total: string; // Total balance in rao
  balance_free_24hr_ago: string | null; // Only populated when querying specific address
  balance_staked_24hr_ago: string | null;
  balance_staked_alpha_as_tao_24hr_ago: string | null;
  balance_staked_root_24hr_ago: string | null;
  balance_total_24hr_ago: string | null;
  created_on_date: string; // Wallet creation date
  created_on_network: string;
  coldkey_swap: string | null;
  alpha_balances?: any | null;
  alpha_balances_24hr_ago?: any | null;
}

// Transfer data structure
export interface TransferData {
  id: string; // Format: "finney-5452109-0041"
  to: AddressType;
  from: AddressType;
  network: string;
  block_number: number;
  timestamp: string;
  amount: string; // Amount in rao
  fee: string; // Transaction fee in rao
  transaction_hash: string;
  extrinsic_id: string;
}

// On-chain identity data structure
export interface OnChainIdentityData {
  address: AddressType;
  validator_hotkey: any | null; // Could be AccountAddress or null
  name: string;
  url: string;
  github_repo: string;
  image: string;
  discord: string;
  description: string;
  additional: string;
}

// Query parameters for getAccount
export interface GetAccountParams extends BaseQueryParams {
  address?: string; // Optional - if not provided, returns paginated list of all accounts
  network?: string; // Default: "finney"
  balance_free_min?: string; // Min free balance in rao
  balance_free_max?: string; // Max free balance in rao
  balance_staked_min?: string; // Min staked balance in rao
  balance_staked_max?: string; // Max staked balance in rao
  balance_total_min?: string; // Min total balance in rao
  balance_total_max?: string; // Max total balance in rao
  order?: string;
}

// Query parameters for getAccountHistory
export interface GetAccountHistoryParams extends BaseQueryParams {
  address: string; // Required for account history
  network?: string; // Default: "finney"
  block_number?: number; // Specific block number
  block_start?: number; // Block range start
  block_end?: number; // Block range end
  timestamp_start?: number; // Unix timestamp start (seconds)
  timestamp_end?: number; // Unix timestamp end (seconds)
  order?: string;
}

// Query parameters for getTransfers
export interface GetTransfersParams extends BaseQueryParams {
  network?: string; // Default: "finney"
  address?: string; // SS58 or hex format
  from?: string; // SS58 or hex format
  to?: string; // SS58 or hex format
  transaction_hash?: string;
  extrinsic_id?: string;
  amount_min?: string; // Min transaction amount in rao
  amount_max?: string; // Max transaction amount in rao
  block_number?: number; // Exact block number
  block_start?: number; // Block range start
  block_end?: number; // Block range end
  timestamp_start?: number; // Unix timestamp start (seconds)
  timestamp_end?: number; // Unix timestamp end (seconds)
  order?: string;
}

// Query parameters for getOnChainIdentity
export interface GetOnChainIdentityParams extends BaseQueryParams {
  address?: string; // Optional coldkey address - if not provided, returns paginated list
}

// Pending coldkey swap data
export interface PendingColdkeySwap {
  old_coldkey: AddressType;
  new_coldkey: AddressType;
  block_number: number;
  timestamp: string;
  execution_block_number: number;
  predicted_execution_timestamp: string;
}

// Pending coldkey swap response
export type PendingColdkeySwapResponse = PaginatedResponse<PendingColdkeySwap>;
