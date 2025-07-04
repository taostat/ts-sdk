import { BaseQueryParams, AddressType } from '../../types/common';


// Slippage calculation data
export interface SlippageData {
  netuid: number;
  block_number: number;
  timestamp: string;
  alpha_price: string; // Price in TAO
  output_tokens: string; // Output tokens received as rao
  expected_output_tokens: string; // Tokens expected as rao
  diff: string; // Difference in rao
  slippage: string; // Slippage as value
}

// Delegation event data
export interface DelegationEventData {
  id: string; // Format: "finney-85-0x...-..-5764213-68"
  block_number: number;
  timestamp: string;
  action: 'DELEGATE' | 'UNDELEGATE';
  nominator: AddressType; // Coldkey of staker/delegator
  delegate: AddressType; // Hotkey of validator
  amount: string; // TAO amount as rao
  alpha: string; // Alpha amount as rao
  usd: string; // Value in USD
  alpha_price_in_tao: string;
  alpha_price_in_usd: string;
  netuid: number;
  extrinsic_id: string;
  is_transfer: any | null;
  transfer_address: any | null;
}

// Aggregated stake balance data
export interface StakeBalanceSumData {
  block_number: number;
  rank: number; // Wallet rank
  timestamp: string;
  coldkey: AddressType;
  total_balance_as_tao: string; // Total balance in rao
}

// Individual stake balance data (current)
export interface StakeBalanceData {
  block_number: number;
  timestamp: string;
  hotkey_name: string;
  hotkey: AddressType;
  coldkey: AddressType;
  netuid: number;
  subnet_rank: number; // Wallet rank in subnet
  subnet_total_holders: number; // Total holders in subnet
  balance: string; // Alpha balance as rao
  balance_as_tao: string; // TAO balance as rao
}

// Historical stake balance data (same as current but without rank/holders)
export interface HistoricalStakeBalanceData {
  block_number: number;
  timestamp: string;
  hotkey_name: string;
  hotkey: AddressType;
  coldkey: AddressType;
  netuid: number;
  balance: string; // Alpha balance as rao
  balance_as_tao: string; // TAO balance as rao
}

// Query parameters for getSlippage
export interface GetSlippageParams {
  netuid: number; // Required: Subnet ID
  input_tokens: string; // Required: as Rao or nanoAlpha
  direction?: 'tao_to_alpha' | 'alpha_to_tao'; // Default: 'tao_to_alpha'
}

// Query parameters for getDelegationEvents
export interface GetDelegationEventsParams extends BaseQueryParams {
  delegate?: string; // Hotkey of validator
  nominator?: string; // Coldkey of staker/delegator
  netuid?: number; // Subnet
  action?: 'DELEGATE' | 'UNDELEGATE' | 'all'; // Default: 'all'
  is_transfer?: boolean; // Is this a transfer?
  extrinsic_id?: string; // ID of extrinsic
  amount_min?: string; // Min amount in rao
  amount_max?: string; // Max amount in rao
  block_number?: number; // Exact block number
  block_start?: number; // Block range start
  block_end?: number; // Block range end
  timestamp_start?: number; // Unix timestamp start (seconds)
  timestamp_end?: number; // Unix timestamp end (seconds)
  order?: string;
}

// Query parameters for getStakeBalanceSumInTao
export interface GetStakeBalanceSumInTaoParams extends BaseQueryParams {
  coldkey?: string; // Wallet coldkey to search
  total_balance_as_tao_min?: string; // Min balance in rao
  total_balance_as_tao_max?: string; // Max balance in rao
  order?: string;
}

// Query parameters for getdTaoStakeBalance
export interface GetdTaoStakeBalanceParams extends BaseQueryParams {
  coldkey?: string; // Stakeholder's coldkey
  hotkey?: string; // Validator's hotkey
  netuid?: number; // Subnet
  balance_min?: string; // Min balance in nanoAlpha
  balance_max?: string; // Max balance in nanoAlpha
  balance_as_tao_min?: string; // Min balance in rao
  balance_as_tao_max?: string; // Max balance in rao
  order?: string;
}

// Query parameters for getdTaoHistoricalStakeBalance
export interface GetdTaoHistoricalStakeBalanceParams {
  coldkey: string; // Required: Coldkey of wallet owner
  hotkey: string; // Required: Hotkey of validator staked with
  netuid: number; // Required: Subnet
} 