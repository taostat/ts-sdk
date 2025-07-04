import { BaseQueryParams, AddressType, TaoStatsPagination,BaseOrderOptions } from '../../types/common';

// Miner incentive distribution data structure
export interface MinerIncentiveDistributionData {
  block_number: number;
  incentive: string;
  is_immunity_period: boolean;
}

// Query parameters for getMinerIncentiveDistributionBySubnet
export interface GetMinerIncentiveDistributionBySubnetParams extends BaseQueryParams {
  netuid: number; // Required subnet ID
  // page and limit are inherited from BaseQueryParams
}

// Response structure for getMinerIncentiveDistributionBySubnet
export interface MinerIncentiveDistributionResponse {
  pagination: TaoStatsPagination;
  data: MinerIncentiveDistributionData[];
}

// Subnet axon IP distribution data structure
export interface SubnetAxonIpDistributionData {
  ip: string;
  count: number;
}

// Query parameters for getSubnetAxonIpDistribution
export interface GetSubnetAxonIpDistributionParams extends BaseQueryParams {
  netuid: number; // Required subnet ID
  // page and limit are inherited from BaseQueryParams
}

// Response structure for getSubnetAxonIpDistribution
export interface SubnetAxonIpDistributionResponse {
  pagination: TaoStatsPagination;
  data: SubnetAxonIpDistributionData[];
}

// Subnet coldkey distribution data structure
export interface SubnetColdkeyDistributionData {
  coldkey: string;
  count: number;
}

// Query parameters for getSubnetColdkeyDistribution
export interface GetSubnetColdkeyDistributionParams extends BaseQueryParams {
  netuid: number; // Required subnet ID
  // page and limit are inherited from BaseQueryParams
}

// Response structure for getSubnetColdkeyDistribution
export interface SubnetColdkeyDistributionResponse {
  pagination: TaoStatsPagination;
  data: SubnetColdkeyDistributionData[];
}


// Miner weight data structure
export interface MinerWeightData {
  block_number: number;
  timestamp: string;
  netuid: number;
  miner_uid: number;
  validator_uid: number;
  weight: string;
  validator_hotkey: AddressType;
  miner_hotkey: AddressType;
}

// Query parameters for getLatestMinerWeight
export interface GetLatestMinerWeightParams extends BaseQueryParams {
  netuid: number; // Required subnet ID
  // page and limit are inherited from BaseQueryParams
}

// Response structure for getLatestMinerWeight
export interface LatestMinerWeightResponse {
  pagination: TaoStatsPagination;
  data: MinerWeightData[];
}


// Query parameters for getMinerWeightHistory
export interface GetMinerWeightHistoryParams extends BaseQueryParams {
  netuid: number; // Required subnet ID
  miner_uid?: number; // Optional neuron ID
  validator_uid?: number; // Optional UID of validator
  block_number?: number; // Optional exact block number
  block_start?: number; // Optional block number for start of range
  block_end?: number; // Optional block number for end of range
  timestamp_start?: number; // Optional start of timestamp range in Unix timestamp (seconds since 1970-01-01) (inclusive)
  timestamp_end?: number; // Optional end of timestamp range in Unix timestamp (seconds since 1970-01-01) (inclusive)
  order?: BaseOrderOptions; // Optional sort order
  // page and limit are inherited from BaseQueryParams
}

// Response structure for getMinerWeightHistory
export interface MinerWeightHistoryResponse {
  pagination: TaoStatsPagination;
  data: MinerWeightData[];
}

// Neuron deregistration data structure
export interface NeuronDeregistrationData {
  block_number: number;
  timestamp: string;
  netuid: number;
  uid: number;
  hotkey: AddressType;
  coldkey: AddressType;
  incentive: string;
  emission: string; // as rao
  was_drained: boolean;
}


// Query parameters for getNeuronDeregistrations
export interface GetNeuronDeregistrationsParams extends BaseQueryParams {
  netuid?: number; // Optional subnet ID
  uid?: number; // Optional neuron ID
  hotkey?: string; // Optional hotkey of neuron
  block_number?: number; // Optional exact block number
  block_start?: number; // Optional block number for start of range
  block_end?: number; // Optional block number for end of range
  timestamp_start?: number; // Optional start of timestamp range in Unix timestamp (seconds since 1970-01-01) (inclusive)
  timestamp_end?: number; // Optional end of timestamp range in Unix timestamp (seconds since 1970-01-01) (inclusive)
  order?: BaseOrderOptions; // Optional sort order
  // page and limit are inherited from BaseQueryParams
}

// Response structure for getNeuronDeregistrations
export interface NeuronDeregistrationsResponse {
  pagination: TaoStatsPagination;
  data: NeuronDeregistrationData[];
}

// Neuron registration data structure
export interface NeuronRegistrationData {
  block_number: number;
  timestamp: string;
  netuid: number;
  uid: number;
  hotkey: AddressType;
  coldkey: AddressType;
  registration_cost: string; // as rao
}

// Order options for neuron registrations (includes registration cost options)
export type NeuronRegistrationOrder = BaseOrderOptions | 'registration_cost_asc' | 'registration_cost_desc';

// Query parameters for getNeuronRegistrations
export interface GetNeuronRegistrationsParams extends BaseQueryParams {
  netuid?: number; // Optional subnet ID
  uid?: number; // Optional neuron ID
  hotkey?: string; // Optional hotkey of neuron
  coldkey?: string; // Optional coldkey of neuron
  block_number?: number; // Optional exact block number
  block_start?: number; // Optional block number for start of range
  block_end?: number; // Optional block number for end of range
  timestamp_start?: number; // Optional start of timestamp range in Unix timestamp (seconds since 1970-01-01) (inclusive)
  timestamp_end?: number; // Optional end of timestamp range in Unix timestamp (seconds since 1970-01-01) (inclusive)
  order?: NeuronRegistrationOrder; // Optional sort order
  // page and limit are inherited from BaseQueryParams
}

// Response structure for getNeuronRegistrations
export interface NeuronRegistrationsResponse {
  pagination: TaoStatsPagination;
  data: NeuronRegistrationData[];
}

// Root subnet history data structure
export interface RootSubnetHistoryData {
  hotkey: AddressType;
  coldkey: AddressType;
  uid: number;
  block_number: number;
  timestamp: string;
  stake: string;
  consensus: string;
  senator: boolean;
  rank: string;
  pruning_score: string;
  subnet_weights: Record<string, string>; // Dynamic subnet ID to weight mapping
}


// Query parameters for getRootSubnetHistory
export interface GetRootSubnetHistoryParams extends BaseQueryParams {
  hotkey?: string; // Optional validator hotkey
  block_start?: number; // Optional block number for start of range
  block_end?: number; // Optional block number for end of range
  timestamp_start?: number; // Optional Unix timestamp start
  timestamp_end?: number; // Optional Unix timestamp end
  order?: BaseOrderOptions; // Optional sort order
  // page and limit are inherited from BaseQueryParams
}

// Response structure for getRootSubnetHistory
export interface RootSubnetHistoryResponse {
  pagination: TaoStatsPagination;
  data: RootSubnetHistoryData[];
}

// Order options for root subnet latest data
export type RootSubnetOrder = 'uid_asc' | 'uid_desc' | 'stake_asc' | 'stake_desc';

// Query parameters for getRootSubnet (latest data)
export interface GetRootSubnetParams extends BaseQueryParams {
  order?: RootSubnetOrder; // Optional sort order
  // page and limit are inherited from BaseQueryParams
}

// Response structure for getRootSubnet (reuses RootSubnetHistoryData since structure is identical)
export interface RootSubnetResponse {
  pagination: TaoStatsPagination;
  data: RootSubnetHistoryData[]; // Reusing the same data structure as it's identical
}

// Axon information structure
export interface AxonInfo {
  block: number;
  ip: string;
  ipType: number;
  placeholder1: number;
  placeholder2: number;
  port: number;
  protocol: number;
  version: number;
}

// Metagraph history data structure
export interface MetagraphHistoryData {
  hotkey: AddressType;
  coldkey: AddressType;
  netuid: number;
  uid: number;
  block_number: number;
  timestamp: string;
  stake: string;
  trust: string;
  validator_trust: string;
  consensus: string;
  incentive: string;
  dividends: string;
  emission: string;
  active: boolean;
  validator_permit: boolean;
  updated: number;
  daily_reward: string;
  registered_at_block: number;
  is_immunity_period: boolean;
  rank: number;
  is_child_key: boolean;
  axon: AxonInfo | null;
  root_weight: string;
  alpha_stake: string;
  root_stake: string;
  root_stake_as_alpha: string;
  total_alpha_stake: string;
}


// Query parameters for getHistory
export interface GetHistoryParams extends BaseQueryParams {
  netuid?: number;
  uid?: number;
  hotkey?: string;
  coldkey?: string;
  block_start?: number;
  block_end?: number;
  timestamp_start?: number;
  timestamp_end?: number;
  order?: BaseOrderOptions;
}

// Response structure for getHistory
export interface MetagraphHistoryResponse {
  pagination: TaoStatsPagination;
  data: MetagraphHistoryData[];
}

// Order options for metagraph latest data
export type MetagraphLatestOrder = BaseOrderOptions| 'updated_asc' | 'updated_desc' | 'uid_asc' | 'uid_desc' | 'stake_asc' | 'stake_desc' | 'trust_asc' | 'trust_desc' | 'validator_trust_asc' | 'validator_trust_desc' | 'consensus_asc' | 'consensus_desc' | 'incentive_asc' | 'incentive_desc' | 'dividends_asc' | 'dividends_desc' | 'emission_asc' | 'emission_desc' | 'active_asc' | 'active_desc' | 'hotkey_asc' | 'hotkey_desc' | 'coldkey_asc' | 'coldkey_desc' | 'validator_permit_asc' | 'validator_permit_desc' | 'axon_asc' | 'axon_desc' | 'daily_reward_asc' | 'daily_reward_desc' | 'registered_at_asc' | 'registered_at_desc' | 'is_immunity_period_asc' | 'is_immunity_period_desc';

// Query parameters for getLatest
export interface GetLatestParams extends BaseQueryParams {
  netuid: number;
  search?: string;
  uid?: number;
  active?: boolean;
  hotkey?: string;
  coldkey?: string;
  validator_permit?: boolean;
  is_immunity_period?: boolean;
  is_child_key?: boolean;
  order?: MetagraphLatestOrder;
}

// Response structure for getLatest (reuses MetagraphHistoryData since structure is identical)
export interface MetagraphLatestResponse {
  pagination: TaoStatsPagination;
  data: MetagraphHistoryData[];
}
