import { BaseQueryParams, PaginatedResponse, AddressType, BaseOrderOptions } from '../../types/common';


// Main subnet data structure with all hyperparameters
export interface Subnet {
  block_number: number;
  timestamp: string;
  netuid: number;
  owner: AddressType;
  registration_block_number: number | null;
  registration_timestamp: string;
  registration_cost: string;
  neuron_registration_cost: string;
  max_neurons: number;
  neuron_registrations_this_interval: number;
  active_keys: number;
  validators: number;
  active_validators: number;
  active_miners: number;
  active_dual: number;
  modality: number;
  pow_registration_allowed: boolean;
  emission: string;
  rho: number;
  kappa: number;
  immunity_period: number;
  min_allowed_weights: number;
  max_weights_limit: number;
  tempo: number;
  min_difficulty: string;
  max_difficulty: string;
  weights_version: string;
  weights_rate_limit: string;
  adjustment_interval: number;
  activity_cutoff: number;
  registration_allowed: boolean;
  target_regs_per_interval: number;
  min_burn: string;
  max_burn: string;
  bonds_moving_avg: string;
  max_regs_per_block: number;
  serving_rate_limit: string;
  max_validators: number;
  adjustment_alpha: string;
  difficulty: string;
  last_adjustment_block: number;
  blocks_since_last_step: number;
  blocks_until_next_epoch: number;
  blocks_until_next_adjustment: number;
  recycled_lifetime: string;
  recycled_24_hours: string;
  recycled_since_registration: string;
  liquid_alpha_enabled: boolean;
  alpha_high: string;
  alpha_low: string;
  commit_reveal_weights_interval: number;
  commit_reveal_weights_enabled: boolean;
  alpha_sigmoid_steepness: number;
  bonds_reset_on: boolean;
  yuma3_on: boolean;
  subtoken_enabled: boolean;
}

// Query parameters for subnets endpoint
export interface SubnetsQueryParams extends BaseQueryParams {
  netuid?: number;
  order?: 'netuid_asc' | 'netuid_desc';
}

// Paginated subnets response
export type SubnetsResponse = PaginatedResponse<Subnet>;

// Historical subnet price data
export interface HistoricalSubnetPrice {
  block_number: number;
  timestamp: string;
  price: string;
  alpha_volume: string;
  alpha_sell_volume: string;
  alpha_buy_volume: string;
  root_volume: string;
  root_sell_volume: string;
  root_buy_volume: string;
}

// Query parameters for historical subnet prices
export interface HistoricalSubnetPricesQueryParams extends BaseQueryParams {
  frequency?: 'by_block' | 'by_hour' | 'by_day';
  order?: 'timestamp_asc' | 'timestamp_desc';
}

// Historical subnet prices response
export type HistoricalSubnetPricesResponse = PaginatedResponse<HistoricalSubnetPrice>;

// Latest subnet price data (extends historical with fear and greed index)
export interface LatestSubnetPrice extends HistoricalSubnetPrice {
  fear_and_greed_index: string;
  fear_and_greed_sentiment: string;
}

// Latest subnet prices response
export type LatestSubnetPricesResponse = PaginatedResponse<LatestSubnetPrice>;



// Subnet registration data
export interface SubnetRegistration {
  block_number: number;
  timestamp: string;
  netuid: number;
  registration_cost: string; // in RAO
  recycled_at_registration: string; // in RAO
  owner: AddressType;
  registered_by: AddressType;
}

// Query parameters for subnet registrations
export interface SubnetRegistrationsQueryParams extends BaseQueryParams {
  netuid?: number;
  owner?: string;
  registered_by?: string;
  block_number?: number;
  block_start?: number;
  block_end?: number;
  timestamp_start?: number; // Unix timestamp
  timestamp_end?: number; // Unix timestamp
  order?: BaseOrderOptions | 'register_cost_asc' | 'register_cost_desc';
}

// Subnet registrations response
export type SubnetRegistrationsResponse = PaginatedResponse<SubnetRegistration>;

// Registration cost history data
export interface RegistrationCostHistory {
  block_number: number;
  timestamp: string;
  registration_cost: string; // in RAO
  is_purchase: boolean;
}

// Query parameters for registration cost history
export interface RegistrationCostHistoryQueryParams extends BaseQueryParams {
  block_number?: number;
  block_start?: number;
  block_end?: number;
  timestamp_start?: number; // Unix timestamp
  timestamp_end?: number; // Unix timestamp
  order?: BaseOrderOptions;
}

// Registration cost history response
export type RegistrationCostHistoryResponse = PaginatedResponse<RegistrationCostHistory>;

// Current registration cost response (same structure as history, but returns latest entry)
export type CurrentRegistrationCostResponse = PaginatedResponse<RegistrationCostHistory>;

// Subnet owner data
export interface SubnetOwner {
  block_number: number;
  timestamp: string;
  netuid: number;
  owner: AddressType;
  previous_owner: AddressType | null;
  is_coldkey_swap: boolean;
  pending_owner: AddressType | null;
  pending_owner_block_number: number | null;
  pending_owner_timestamp: string | null;
}

// Query parameters for subnet owner
export interface SubnetOwnerQueryParams extends BaseQueryParams {
  netuid?: number;
  owner?: string;
  is_coldkey_swap?: boolean;
  block_number?: number;
  block_start?: number;
  block_end?: number;
  timestamp_start?: number; // Unix timestamp
  timestamp_end?: number; // Unix timestamp
  order?: BaseOrderOptions;
}

// Subnet owner response
export type SubnetOwnerResponse = PaginatedResponse<SubnetOwner>;

// Subnet identity data
export interface SubnetIdentity {
  netuid: number;
  subnet_name: string;
  github_repo: string | null;
  subnet_contact: string | null;
  subnet_url: string | null;
  discord: string | null;
  description: string | null;
  additional: string | null;
}

// Query parameters for subnet identity (only pagination)
export interface SubnetIdentityQueryParams extends BaseQueryParams {
  // This endpoint only supports pagination parameters
}

// Subnet identity response
export type SubnetIdentityResponse = PaginatedResponse<SubnetIdentity>;

// Subnet emission data
export interface SubnetEmission {
  netuid: number;
  block_number: number;
  timestamp: string;
  name: string;
  symbol: string;
  tao_in_pool: string; // in RAO
  alpha_in_pool: string; // in RAO
  alpha_rewards: string; // in RAO
}

// Query parameters for subnet emission
export interface SubnetEmissionQueryParams extends BaseQueryParams {
  netuid?: number;
  block_start?: number;
  block_end?: number;
  block_number?: number;
  timestamp_start?: number; // Unix timestamp
  timestamp_end?: number; // Unix timestamp
  order?: BaseOrderOptions | 'netuid_asc' | 'netuid_desc' | 'tao_in_pool_asc' | 'tao_in_pool_desc' | 'alpha_in_pool_asc' | 'alpha_in_pool_desc' | 'alpha_rewards_asc' | 'alpha_rewards_desc';
}

// Subnet emission response
export type SubnetEmissionResponse = PaginatedResponse<SubnetEmission>;

// Subnets pools history data
export interface SubnetsPoolsHistory {
  netuid: number;
  block_number: number;
  timestamp: string;
  name: string;
  symbol: string;
  market_cap: string; // in rao
  liquidity: string; // in rao
  total_tao: string; // in rao
  total_alpha: string; // in rao
  alpha_in_pool: string; // in rao
  alpha_staked: string; // in rao
  price: string; // in tao
  root_prop: string; // as number
  rank: number;
  startup_mode: boolean;
}

// Query parameters for subnets pools history
export interface SubnetsPoolsHistoryQueryParams extends BaseQueryParams {
  netuid?: number;
  frequency?: 'by_block' | 'by_hour' | 'by_day';
  block_number?: number;
  block_start?: number;
  block_end?: number;
  timestamp_start?: number; // Unix timestamp
  timestamp_end?: number; // Unix timestamp
  order?: BaseOrderOptions | 'netuid_asc' | 'netuid_desc' | 'price_asc' | 'price_desc' | 'market_cap_asc' | 'market_cap_desc' | 'total_tao_asc' | 'total_tao_desc' | 'total_alpha_asc' | 'total_alpha_desc' | 'alpha_in_pool_asc' | 'alpha_in_pool_desc' | 'alpha_staked_asc' | 'alpha_staked_desc';
}

// Subnets pools history response
export type SubnetsPoolsHistoryResponse = PaginatedResponse<SubnetsPoolsHistory>;

// Seven day price data point
export interface SevenDayPrice {
  block_number: number;
  timestamp: string;
  price: string;
}

// Current subnet pools data
export interface CurrentSubnetPools {
  netuid: number;
  block_number: number;
  timestamp: string;
  name: string;
  symbol: string;
  fear_and_greed_index: string | null;
  fear_and_greed_sentiment: string | null;
  market_cap: string; // in tao as rao
  market_cap_change_1_day: string; // percentage change
  liquidity: string; // in rao
  total_tao: string; // tao in pool as rao
  total_alpha: string; // total alpha as rao
  alpha_in_pool: string; // alpha in pool as rao
  alpha_staked: string; // alpha out as rao
  price: string; // price in tao
  price_change_1_hour: string; // % change
  price_change_1_day: string; // % change
  price_change_1_week: string | null; // % change
  price_change_1_month: string | null; // % change
  tao_volume_24_hr: string; // as rao
  tao_volume_24_hr_change_1_day: string | null; // % change
  tao_buy_volume_24_hr: string; // as rao
  tao_sell_volume_24_hr: string; // as rao
  alpha_volume_24_hr: string; // as rao
  alpha_volume_24_hr_change_1_day: string | null; // % change
  alpha_buy_volume_24_hr: string; // as rao
  alpha_sell_volume_24_hr: string; // as rao
  last_price: string | null;
  highest_price_24_hr: string | null;
  lowest_price_24_hr: string | null;
  buys_24_hr: number;
  sells_24_hr: number;
  buyers_24_hr: number;
  sellers_24_hr: number;
  seven_day_prices: SevenDayPrice[];
  root_prop: string; // as number
  rank: number;
  startup_mode: boolean;
}

// Query parameters for current subnet pools
export interface CurrentSubnetPoolsQueryParams extends BaseQueryParams {
  netuid?: number;
  order?: BaseOrderOptions | 'netuid_asc' | 'netuid_desc' | 'price_asc' | 'price_desc' | 'market_cap_asc' | 'market_cap_desc' | 'total_tao_asc' | 'total_tao_desc' | 'total_alpha_asc' | 'total_alpha_desc' | 'alpha_in_pool_asc' | 'alpha_in_pool_desc' | 'alpha_staked_asc' | 'alpha_staked_desc';
}

// Current subnet pools response
export type CurrentSubnetPoolsResponse = PaginatedResponse<CurrentSubnetPools>;

// Query parameters for subnet history
export interface SubnetHistoryQueryParams extends BaseQueryParams {
  netuid: number; // required
  frequency?: 'by_day' | 'by_block' | 'by_hour';
  block_number?: number;
  block_start?: number;
  block_end?: number;
  timestamp_start?: number; // Unix timestamp
  timestamp_end?: number; // Unix timestamp
  order?: BaseOrderOptions;
}

// Subnet history response (reuses existing Subnet interface)
export type SubnetHistoryResponse = PaginatedResponse<Subnet>;
