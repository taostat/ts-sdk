import { BaseQueryParams, AddressType, TaoStatsPagination, BaseOrderOptions } from '../../types/common';


// Validator yield data structure
export interface ValidatorYieldData {
  hotkey: AddressType;
  name: string | null;
  netuid: number;
  block_number: number;
  timestamp: string;
  stake: string;
  one_hour_apy: string;
  one_day_apy: string;
  seven_day_apy: string;
  thirty_day_apy: string;
  one_day_epoch_participation: string | null;
  seven_day_epoch_participation: string | null;
  thirty_day_epoch_participation: string | null;
}

// Order options for validator yield (extends base with additional options)
export type ValidatorYieldOrder = BaseOrderOptions | 'netuid_asc' | 'netuid_desc' | 'name_asc' | 'name_desc' | 'stake_asc' | 'stake_desc' | 'one_hour_apy_asc' | 'one_hour_apy_desc' | 'one_day_apy_asc' | 'one_day_apy_desc' | 'seven_day_apy_asc' | 'seven_day_apy_desc' | 'thirty_day_apy_asc' | 'thirty_day_apy_desc';

// Query parameters for getYield
export interface GetYieldParams extends BaseQueryParams {
  hotkey?: string;
  netuid?: number;
  min_stake?: string;
  order?: ValidatorYieldOrder;
}

// Response structure for getYield
export interface ValidatorYieldResponse {
  pagination: TaoStatsPagination;
  data: ValidatorYieldData[];
}

// Validator in subnet data structure
export interface ValidatorInSubnetData {
  address: AddressType;
  name: string | null;
  netuid: number;
  hotkey_alpha: string;
}

// Query parameters for getValidatorsInSubnet
export interface GetValidatorsInSubnetParams extends BaseQueryParams {
  netuid: number;
}

// Response structure for getValidatorsInSubnet
export interface ValidatorsInSubnetResponse {
  pagination: TaoStatsPagination;
  data: ValidatorInSubnetData[];
}

// Weight copier data structure
export interface WeightCopierData {
  hotkey: AddressType;
}

// Query parameters for getWeightCopiers
export interface GetWeightCopiersParams extends BaseQueryParams {
  // Only pagination parameters
}

// Response structure for getWeightCopiers
export interface WeightCopiersResponse {
  pagination: TaoStatsPagination;
  data: WeightCopierData[];
}

// Alpha shares history data structure
export interface AlphaSharesHistoryData {
  block_number: number;
  timestamp: string;
  netuid: number;
  hotkey: AddressType;
  shares: string;
  alpha: string;
}

// Order options for alpha shares history (extends base with netuid options)
export type AlphaSharesHistoryOrder = BaseOrderOptions | 'netuid_asc' | 'netuid_desc';

// Query parameters for getAlphaSharesHistory
export interface GetAlphaSharesHistoryParams extends BaseQueryParams {
  hotkey?: string;
  netuid?: number;
  block_number?: number;
  block_start?: number;
  block_end?: number;
  timestamp_start?: number;
  timestamp_end?: number;
  order?: AlphaSharesHistoryOrder;
}

// Response structure for getAlphaSharesHistory
export interface AlphaSharesHistoryResponse {
  pagination: TaoStatsPagination;
  data: AlphaSharesHistoryData[];
}

// Order options for alpha shares latest data (extends base with additional options)
export type AlphaSharesLatestOrder = BaseOrderOptions | 'netuid_asc' | 'netuid_desc' | 'shares_asc' | 'shares_desc' | 'alpha_asc' | 'alpha_desc';

// Query parameters for getAlphaSharesLatest
export interface GetAlphaSharesLatestParams extends BaseQueryParams {
  alpha_min?: string;
  alpha_max?: string;
  hotkey?: string;
  netuid?: number;
  order?: AlphaSharesLatestOrder;
}

// Response structure for getAlphaSharesLatest (reuses AlphaSharesHistoryData since structure is identical)
export interface AlphaSharesLatestResponse {
  pagination: TaoStatsPagination;
  data: AlphaSharesHistoryData[];
}

// Weight entry data structure
export interface WeightEntry {
  uid: number;
  hotkey: AddressType;
  weight: string;
}

// Weights history data structure
export interface WeightsHistoryData {
  hotkey: AddressType;
  netuid: number;
  uid: number;
  block_number: number;
  timestamp: string;
  weights: WeightEntry[];
}

// Order options for weights history (uses base order)
export type WeightsHistoryOrder = BaseOrderOptions;

// Query parameters for getWeightsHistory
export interface GetWeightsHistoryParams extends BaseQueryParams {
  hotkey?: string;
  netuid?: number;
  uid?: number;
  block_number?: number;
  block_start?: number;
  block_end?: number;
  timestamp_start?: string;
  timestamp_end?: string;
  order?: WeightsHistoryOrder;
}

// Response structure for getWeightsHistory
export interface WeightsHistoryResponse {
  pagination: TaoStatsPagination;
  data: WeightsHistoryData[];
}

// Order options for weights latest (extends base with uid and netuid options)
export type WeightsLatestOrder = BaseOrderOptions | 'uid_asc' | 'uid_desc' | 'netuid_asc' | 'netuid_desc';

// Query parameters for getWeightsLatest
export interface GetWeightsLatestParams extends BaseQueryParams {
  hotkey?: string;
  netuid?: number;
  uid?: number;
  order?: WeightsLatestOrder;
}

// Response structure for getWeightsLatest (reuses WeightsHistoryData since structure is identical)
export interface WeightsLatestResponse {
  pagination: TaoStatsPagination;
  data: WeightsHistoryData[];
}

// Validator performance data structure
export interface ValidatorPerformanceData {
  netuid: number;
  hotkey: AddressType;
  block_number: number;
  timestamp: string;
  emission: string;
  blocks_since_weights_set: number;
  update_status: number;
  tempo: number;
}

// Order options for validator performance (uses base order)
export type ValidatorPerformanceOrder = BaseOrderOptions;

// Query parameters for getPerformance
export interface GetPerformanceParams extends BaseQueryParams {
  hotkey: string; // Required validator hotkey address
  netuid: number; // Required subnet ID
  order?: ValidatorPerformanceOrder; // Optional sort order
  // page and limit are inherited from BaseQueryParams
}

// Response structure for getPerformance
export interface ValidatorPerformanceResponse {
  pagination: TaoStatsPagination;
  data: ValidatorPerformanceData[];
}

// dTao validator performance latest data structure
export interface DTaoValidatorPerformanceLatestData {
  name: string;
  hotkey: AddressType;
  coldkey: AddressType;
  block_number: number;
  timestamp: string;
  netuid: number;
  uid: number;
  position: number;
  last_updated: number;
  nominators: number;
  vtrust: string;
  validator_type: string;
  take: string;
  childkey_take: string;
  proportion: string;
  subnet_weight: string;
  root_weight: string;
  alpha: string;
  family_subnet_weight: string;
  family_root_weight: string;
  family_alpha: string;
  dominance: string;
  dividends: string;
  nominator_return_per_day: string;
  validator_return_per_day: string;
}

// Order options for dTao validator performance latest (uses base order)

export type DTaoValidatorPerformanceLatestOrder = BaseOrderOptions;
// Query parameters for getdTaoValidatorPerformanceLatest
export interface GetdTaoValidatorPerformanceLatestParams extends BaseQueryParams {
  hotkey: string; // Required validator hotkey
  netuid: number; // Required subnet ID
  order?: DTaoValidatorPerformanceLatestOrder; // Optional sort order
  // page and limit are inherited from BaseQueryParams
}

// Response structure for getdTaoValidatorPerformanceLatest
export interface DTaoValidatorPerformanceLatestResponse {
  pagination: TaoStatsPagination;
  data: DTaoValidatorPerformanceLatestData[];
}

// Query parameters for getdTaoValidatorPerformanceHistory
export interface GetdTaoValidatorPerformanceHistoryParams extends BaseQueryParams {
  hotkey: string; // Required validator hotkey
  netuid: number; // Required subnet ID
  order?: BaseOrderOptions; // Optional sort order (uses base order)
  block_number?: number; // Optional exact block number
  block_start?: number; // Optional block number for start of range
  block_end?: number; // Optional block number for end of range
  timestamp_start?: number; // Optional unix timestamp of start
  timestamp_end?: number; // Optional unix timestamp of end
  // page and limit are inherited from BaseQueryParams
}

// Response structure for getdTaoValidatorPerformanceHistory (reuses the same data structure as latest)
export interface DTaoValidatorPerformanceHistoryResponse {
  pagination: TaoStatsPagination;
  data: DTaoValidatorPerformanceLatestData[];
}

// Axon info structure (can be null or detailed object)
export interface ValidatorAxonInfo {
  block: number;
  ip: string;
  ipType: number;
  placeholder1: number;
  placeholder2: number;
  port: number;
  protocol: number;
  version: number;
}

// Validator metrics latest data structure
export interface ValidatorMetricsLatestData {
  coldkey: AddressType;
  hotkey: AddressType;
  netuid: number;
  uid: number;
  block_number: number;
  timestamp: string;
  active: boolean;
  validator_permit: boolean;
  is_immunity_period: boolean;
  updated: number;
  registered_block_number: number;
  rank: number;
  validator_trust: string;
  stake: string;
  emission: string;
  daily_reward: string;
  incentive: string;
  consensus: string;
  dividends: string;
  trust: string;
  axon_info: ValidatorAxonInfo | null;
}

// Order options for validator metrics latest (only netuid options)
export type ValidatorMetricsLatestOrder = 'netuid_asc' | 'netuid_desc';

// Query parameters for getMetricsLatest
export interface GetMetricsLatestParams extends BaseQueryParams {
  hotkey?: string; // Optional validator hotkey
  coldkey?: string; // Optional validator coldkey
  netuid?: number; // Optional subnet ID
  order?: ValidatorMetricsLatestOrder; // Optional sort order
  // page and limit are inherited from BaseQueryParams
}

// Response structure for getMetricsLatest
export interface ValidatorMetricsLatestResponse {
  pagination: TaoStatsPagination;
  data: ValidatorMetricsLatestData[];
}

// Query parameters for getMetricsHistory
export interface GetMetricsHistoryParams extends BaseQueryParams {
  hotkey?: string; // Optional validator hotkey
  coldkey?: string; // Optional validator coldkey
  netuid?: number; // Optional subnet ID
  block_number?: number; // Optional exact block number
  block_start?: number; // Optional block number for start of range
  block_end?: number; // Optional block number for end of range
  timestamp_start?: number; // Optional start of timestamp range in Unix timestamp (seconds since 1970-01-01) (inclusive)
  timestamp_end?: number; // Optional end of timestamp range in Unix timestamp (seconds since 1970-01-01) (inclusive)
  order?: BaseOrderOptions; // Optional sort order (uses base order)
  // page and limit are inherited from BaseQueryParams
}

// Response structure for getMetricsHistory (reuses the same data structure as latest)
export interface ValidatorMetricsHistoryResponse {
  pagination: TaoStatsPagination;
  data: ValidatorMetricsLatestData[];
}

// Parent-child relationship data structure
export interface ParentChildRelationshipData {
  hotkey: AddressType;
  coldkey: AddressType;
  stake: string;
  family_stake: string;
  take: string;
  childkey_take: string;
  proportion: string;
  proportion_staked: string;
  root_weight: string;
  root_stake: string;
  alpha_stake: string;
  root_stake_as_alpha: string;
  total_alpha_stake: string;
  family_root_stake: string;
  family_alpha_stake: string;
  family_root_stake_as_alpha: string;
  family_total_alpha_stake: string;
  proportion_root_stake: string;
  proportion_alpha_stake: string;
  proportion_root_stake_as_alpha: string;
  proportion_total_alpha_stake: string;
}

// Parent-child hotkey relations latest data structure
export interface ParentChildHotkeyRelationsLatestData {
  hotkey: AddressType;
  coldkey: AddressType;
  block_number: number;
  timestamp: string;
  netuid: number;
  stake: string;
  family_stake: string;
  take: string;
  childkey_take: string;
  children: ParentChildRelationshipData[];
  parents: ParentChildRelationshipData[];
  root_weight: string;
  root_stake: string;
  alpha_stake: string;
  root_stake_as_alpha: string;
  total_alpha_stake: string;
  family_root_stake: string;
  family_alpha_stake: string;
  family_root_stake_as_alpha: string;
  family_total_alpha_stake: string;
}

// Query parameters for getParentChildHotkeyRelationsLatest
export interface GetParentChildHotkeyRelationsLatestParams extends BaseQueryParams {
  hotkey?: string; // Optional validator hotkey
  netuid?: number; // Optional subnet ID
  block_number?: number; // Optional exact block number
  block_range_start?: number; // Optional block number for start of range
  block_range_end?: number; // Optional block number for end of range
  timestamp_start?: number; // Optional start of timestamp range in Unix timestamp (seconds since 1970-01-01) (inclusive)
  timestamp_end?: number; // Optional end of timestamp range in Unix timestamp (seconds since 1970-01-01) (inclusive)
  // page and limit are inherited from BaseQueryParams
  // Note: order parameter not specified in metadata
}

// Response structure for getParentChildHotkeyRelationsLatest
export interface ParentChildHotkeyRelationsLatestResponse {
  pagination: TaoStatsPagination;
  data: ParentChildHotkeyRelationsLatestData[];
}

// Order options for parent-child hotkey relations history (extends base with subnet_id options)
export type ParentChildHotkeyRelationsHistoryOrder = BaseOrderOptions | 'subnet_id_asc' | 'subnet_id_desc';

// Query parameters for getParentChildHotkeyRelationsHistory
export interface GetParentChildHotkeyRelationsHistoryParams extends BaseQueryParams {
  hotkey?: string; // Optional validator hotkey
  netuid?: number; // Optional subnet ID
  block_number?: number; // Optional exact block number
  block_start?: number; // Optional block number for start of range
  block_end?: number; // Optional block number for end of range
  timestamp_start?: number; // Optional start of timestamp range in Unix timestamp (seconds since 1970-01-01) (inclusive)
  timestamp_end?: number; // Optional end of timestamp range in Unix timestamp (seconds since 1970-01-01) (inclusive)
  order?: ParentChildHotkeyRelationsHistoryOrder; // Optional sort order (extends base with subnet_id options)
  // page and limit are inherited from BaseQueryParams
}

// Response structure for getParentChildHotkeyRelationsHistory (reuses the same data structure as latest)
export interface ParentChildHotkeyRelationsHistoryResponse {
  pagination: TaoStatsPagination;
  data: ParentChildHotkeyRelationsLatestData[];
}

// Subnet dominance information (reusable across validator endpoints)
export interface SubnetDominance {
  netuid: number;
  dominance: string;
  family_stake: string;
}

// Order options for validator latest (comprehensive ordering)
export type ValidatorLatestOrder =
  | 'rank_asc' | 'rank_desc'
  | 'dominance_asc' | 'dominance_desc'
  | 'stake_asc' | 'stake_desc'
  | 'stake_change_asc' | 'stake_change_desc'
  | 'nominators_asc' | 'nominators_desc'
  | 'nominators_change_asc' | 'nominators_change_desc'
  | 'take_asc' | 'take_desc'
  | 'nominator_return_asc' | 'nominator_return_desc';

// Query parameters for getValidatorLatest
export interface GetValidatorLatestParams extends BaseQueryParams {
  hotkey?: string; // Optional validator hotkey
  stake_min?: string; // Optional min stake in rao
  stake_max?: string; // Optional max stake in rao
  apr_min?: string; // Optional min APR as a number (ex 0.10 for 10%)
  apr_max?: string; // Optional max APR as a number (ex 0.10 for 10%)
  order?: ValidatorLatestOrder; // Optional sort order
  // page and limit are inherited from BaseQueryParams
}

// Individual validator data for latest endpoint
export interface ValidatorLatestData {
  hotkey: AddressType;
  coldkey: AddressType;
  name: string | null;
  block_number: number;
  timestamp: string;
  created_on_date: string;
  rank: number;
  nominators: number;
  nominators_24_hr_change: number;
  system_stake: string;
  stake: string;
  stake_24_hr_change: string;
  dominance: string;
  validator_stake: string;
  take: string;
  total_daily_return: string;
  validator_return: string;
  nominator_return_per_k: string;
  apr: string;
  nominator_return_per_k_7_day_average: string;
  nominator_return_per_k_30_day_average: string;
  apr_7_day_average: string;
  apr_30_day_average: string;
  pending_emission: string;
  blocks_until_next_reward: number;
  last_reward_block: number;
  registrations: number[];
  permits: number[];
  subnet_dominance: SubnetDominance[];
}

// Response structure for getValidatorLatest
export interface ValidatorLatestResponse {
  pagination: TaoStatsPagination;
  data: ValidatorLatestData[];
}

// Query parameters for getdTaoValidatorLatest (reuses ValidatorLatestOrder)
export interface GetdTaoValidatorLatestParams extends BaseQueryParams {
  hotkey?: string; // Optional hotkey of the validator
  stake_min?: string; // Optional min stake as rao
  stake_max?: string; // Optional max stake as rao
  apr_min?: string; // Optional apr min as number
  apr_max?: string; // Optional max apr as number
  order?: ValidatorLatestOrder; // Optional sort order (reuses ValidatorLatestOrder)
  // page and limit are inherited from BaseQueryParams
}

// Individual dTao validator data for latest endpoint
export interface dTaoValidatorLatestData {
  hotkey: AddressType;
  coldkey: AddressType;
  name: string | null;
  block_number: number;
  timestamp: string;
  created_on_date: string;
  rank: number;
  root_rank: number;
  alpha_rank: number;
  active_subnets: number;
  global_nominators: number;
  global_nominators_24_hr_change: number;
  take: string;
  global_weighted_stake: string; // as rao
  global_weighted_stake_24_hr_change: string; // as rao
  global_alpha_stake_as_tao: string; // as rao
  root_stake: string; // as rao
  weighted_root_stake: string; // as rao
  dominance: string;
  dominance_24_hr_change: string;
  nominator_return_per_day: string; // as rao
  validator_return_per_day: string; // as rao
}

// Response structure for getdTaoValidatorLatest
export interface dTaoValidatorLatestResponse {
  pagination: TaoStatsPagination;
  data: dTaoValidatorLatestData[];
}

// Query parameters for getValidatorHistory
export interface GetValidatorHistoryParams extends BaseQueryParams {
  hotkey?: string; // Optional validator hotkey
  block_number?: number; // Optional exact block number
  block_start?: number; // Optional block number for start of range
  block_end?: number; // Optional block number for end of range
  timestamp_start?: number; // Optional start of timestamp range in Unix timestamp (seconds since 1970-01-01) (inclusive)
  timestamp_end?: number; // Optional end of timestamp range in Unix timestamp (seconds since 1970-01-01) (inclusive)
  order?: BaseOrderOptions; // Optional sort order (uses base order)
  // page and limit are inherited from BaseQueryParams
}

// Response structure for getValidatorHistory (reuses ValidatorLatestData structure)
export interface ValidatorHistoryResponse {
  pagination: TaoStatsPagination;
  data: ValidatorLatestData[];
}

// Query parameters for getdTaoValidatorHistory
export interface GetdTaoValidatorHistoryParams extends BaseQueryParams {
  hotkey?: string; // Optional validator hotkey
  block_number?: number; // Optional exact block number
  block_start?: number; // Optional block number for start of range
  block_end?: number; // Optional block number for end of range
  timestamp_start?: number; // Optional start of timestamp range in Unix timestamp (seconds since 1970-01-01) (inclusive)
  timestamp_end?: number; // Optional end of timestamp range in Unix timestamp (seconds since 1970-01-01) (inclusive)
  order?: BaseOrderOptions; // Optional sort order (uses base order)
  // page and limit are inherited from BaseQueryParams
}

// Response structure for getdTaoValidatorHistory (reuses dTaoValidatorLatestData structure)
export interface dTaoValidatorHistoryResponse {
  pagination: TaoStatsPagination;
  data: dTaoValidatorLatestData[];
}

