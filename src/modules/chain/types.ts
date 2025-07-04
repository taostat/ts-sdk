import { BaseQueryParams, AddressType, BaseOrderOptions } from '../../types/common';

// Block data structure returned by the API
export interface BlockData {
  block_number: number;
  hash: string;
  parent_hash: string;
  state_root: string;
  extrinsics_root: string;
  spec_name: string;
  spec_version: number;
  impl_name: string;
  impl_version: number;
  timestamp: string;
  validator: string | null;
  events_count: number;
  extrinsics_count: number;
  calls_count: number;
}

// Order options for blocks
export type BlockOrderOptions =
  | 'spec_version_asc'
  | 'spec_version_desc'
  | 'block_number_asc'
  | 'block_number_desc'
  | 'timestamp_asc'
  | 'timestamp_desc'
  | 'hash_asc'
  | 'hash_desc'
  | 'events_count_asc'
  | 'events_count_desc'
  | 'extrinsics_count_asc'
  | 'extrinsics_count_desc';

// Block interval data structure returned by the interval API
export interface BlockIntervalData {
  block_number: number;
  timestamp: string;
}

// Frequency options for block intervals
export type BlockIntervalFrequency = 'by_day' | 'by_hour';

// Order options for block intervals
export type BlockIntervalOrderOptions = 'date_asc' | 'date_desc';

// Query parameters for getBlocks
export interface GetBlocksParams extends BaseQueryParams {
  block_start?: number; // Block number for start of range
  block_end?: number; // Block number for end of range
  timestamp_start?: number; // Start of timestamp range in Unix timestamp (seconds since 1970-01-01) (inclusive)
  timestamp_end?: number; // End of timestamp range in Unix timestamp (seconds since 1970-01-01) (inclusive)
  block_number?: number; // Exact block number (as opposed to a range)
  hash?: string; // Block hash number
  spec_version?: number; // Spec version filter
  validator?: string; // Validator filter (not used currently)
  order?: BlockOrderOptions; // Sort order
  // page and limit are inherited from BaseQueryParams
}

// Extrinsic signature structure
export interface ExtrinsicSignature {
  address: {
    __kind: string;
    value: string;
  };
  signature: {
    __kind: string;
    value: string;
  };
  signedExtensions: {
    chargeTransactionPayment: string;
    checkMetadataHash: {
      mode: {
        __kind: string;
      };
    };
    checkMortality: {
      __kind: string;
    };
    checkNonce: number;
  };
}

// Extrinsic error structure
export interface ExtrinsicError {
  extra_info: string;
  name: string;
  pallet: string;
}

// Extrinsic call arguments (varies by extrinsic type)
export interface ExtrinsicCallArgs {
  [key: string]: any; // Flexible structure as it varies by extrinsic type
  allowPartial?: boolean;
  amountStaked?: string;
  amountUnstaked?: string;
  hotkey?: string;
  limitPrice?: string;
  netuid?: number;
}

// Extrinsic data structure returned by the API
export interface ExtrinsicData {
  timestamp: string;
  block_number: number;
  hash: string;
  id: string;
  index: number;
  version: number;
  signature: ExtrinsicSignature;
  signer_address: string;
  tip: string;
  fee: string;
  success: boolean;
  error: ExtrinsicError | null;
  call_id: string;
  full_name: string;
  call_args: ExtrinsicCallArgs;
}

// Order options for extrinsics
export type ExtrinsicOrderOptions =
  BaseOrderOptions
  | 'id_asc'
  | 'id_desc'
  | 'success_asc'
  | 'success_desc'
  | 'signer_address_asc'
  | 'signer_address_desc';

// Query parameters for getBlockNumbersByInterval
export interface GetBlockNumbersByIntervalParams extends BaseQueryParams {
  timestamp_start: number; // Required - timestamp range in Unix timestamp (seconds since 1970-01-01) (inclusive)
  timestamp_end: number; // Required - timestamp range in Unix timestamp (seconds since 1970-01-01) (inclusive)
  frequency: BlockIntervalFrequency; // Required - how frequently to grab blocks
  order?: BlockIntervalOrderOptions; // Sort order
  // page and limit are inherited from BaseQueryParams
}

// Event arguments structure (varies by event type)
export interface EventArgs {
  [key: string]: any; // Flexible structure as it varies by event type
  actualFee?: string;
  tip?: string;
  who?: string;
  rounds?: string[];
  dispatchInfo?: {
    class: {
      __kind: string;
    };
    paysFee: {
      __kind: string;
    };
    weight: {
      proofSize: string;
      refTime: string;
    };
  };
  dispatchError?: {
    __kind: string;
    value: any;
  };
}

// Event data structure returned by the API
export interface EventData {
  id: string;
  extrinsic_index: number;
  index: number;
  phase: string;
  pallet: string;
  name: string;
  full_name: string;
  args: EventArgs;
  block_number: number;
  extrinsic_id: string;
  call_id: string | null;
  timestamp: string;
}

// Order options for events
export type EventOrderOptions =
  BaseOrderOptions
  | 'phase_asc'
  | 'phase_desc'
  | 'pallet_asc'
  | 'pallet_desc'
  | 'name_asc'
  | 'name_desc'
  | 'id_asc'
  | 'id_desc'
  | 'extrinsic_id_asc'
  | 'extrinsic_id_desc';

// Query parameters for getExtrinsics
export interface GetExtrinsicsParams extends BaseQueryParams {
  block_number?: number; // Exact block number
  block_start?: number; // Block number for start of range
  block_end?: number; // Block number for end of range
  timestamp_start?: number; // Start of timestamp range in Unix timestamp (seconds since 1970-01-01) (inclusive)
  timestamp_end?: number; // End of timestamp range in Unix timestamp (seconds since 1970-01-01) (inclusive)
  hash?: string; // Extrinsic hash
  full_name?: string; // Full name of the extrinsic. Ex "SubtensorModule.add_stake"
  id?: string; // Extrinsic ID
  signer_address?: string; // SS58 or hex address of signing wallet
  order?: ExtrinsicOrderOptions; // Sort order
  // page and limit are inherited from BaseQueryParams
}

// Chain call origin structure
export interface ChainCallOrigin {
  __kind: string;
  value: {
    __kind: string;
    value: string;
  };
}

// Chain call arguments structure (varies by call type)
export interface ChainCallArgs {
  [key: string]: any; // Flexible structure as it varies by call type
  amountStaked?: string;
  amountUnstaked?: string;
  alphaAmount?: string;
  hotkey?: string;
  netuid?: number;
  destinationHotkey?: string;
  destinationNetuid?: number;
  originHotkey?: string;
  originNetuid?: number;
  destinationColdkey?: string;
  commit?: string;
  revealRound?: string;
  calls?: any[]; // For batch calls
  dests?: number[];
  weights?: number[];
  versionKey?: string;
  info?: any;
}

// Chain call data structure returned by the API
export interface ChainCallData {
  id: string;
  extrinsic_id: string;
  parent_id: string | null;
  extrinsic_index: number;
  success: boolean;
  error: ExtrinsicError | null; // Reusing ExtrinsicError structure
  pallet: string;
  name: string;
  full_name: string;
  args: ChainCallArgs;
  origin: ChainCallOrigin;
  origin_address: string;
  timestamp: string;
  block_number: number;
}

// Network options for chain calls
export type ChainCallNetwork = 'finney' | 'nakamoto' | 'kusanagi';

// Order options for chain calls
export type ChainCallOrderOptions = BaseOrderOptions;

// Query parameters for getEvents
export interface GetEventsParams extends BaseQueryParams {
  block_number?: number; // The exact block number
  block_start?: number; // Block number for start of range
  block_end?: number; // Block number for end of range
  timestamp_start?: number; // Start of timestamp range in Unix timestamp (seconds since 1970-01-01) (inclusive)
  timestamp_end?: number; // End of timestamp range in Unix timestamp (seconds since 1970-01-01) (inclusive)
  pallet?: string; // Pallet name
  phase?: string; // Event phase
  name?: string; // Event name
  full_name?: string; // Full name of the event, e.g. "SubtensorModule.AxonServed"
  extrinsic_id?: string; // Extrinsic Id of the events
  call_id?: string; // Call ID
  id?: string; // Event ID
  order?: EventOrderOptions; // Sort order
  // page and limit are inherited from BaseQueryParams
}

// Network statistics data structure returned by the API
export interface NetworkStatsData {
  block_number: number;
  timestamp: string;
  issued: string; // TAO issued as rao
  staked: string; // TAO staked as rao total
  staked_alpha: string; // TAO staked as alpha
  staked_root: string; // TAO staked to root
  subnet_locked: string; // Number of locked subnets
  free: string; // Free TAO (as rao)
  accounts: number; // Number of accounts
  active_accounts?: number; // Number of active accounts (optional field)
  balance_holders: number; // Number of accounts with balance
  active_balance_holders?: number; // Number of active accounts with balance (optional field)
  extrinsics: number; // Total extrinsics
  transfers: number; // Total transfers
  subnets: number; // Number of subnets
  subnet_registration_cost: string; // Registration cost as rao
}

// Frequency options for stats history
export type StatsHistoryFrequency = 'by_day' | 'by_block';

// Order options for stats history
export type StatsHistoryOrderOptions =
  | 'block_number_asc'
  | 'block_number_desc'
  | 'timestamp_asc'
  | 'timestamp_desc';

// Runtime version data structure returned by the API
export interface RuntimeVersionData {
  block_number: number;
  timestamp: string;
  runtime_version: number;
}

// Order options for runtime version history
export type RuntimeVersionHistoryOrderOptions =
  | 'block_number_asc'
  | 'block_number_desc'
  | 'timestamp_asc'
  | 'timestamp_desc';



// Proxy call arguments structure (varies by call type)
export interface ProxyCallArgs {
  [key: string]: any; // Flexible structure as it varies by call type
  __kind: string; // Type of call (add_stake_limit, unstake_all, force_batch, etc.)
  allowPartial?: boolean;
  amountStaked?: string; // Amount in rao
  hotkey?: string;
  limitPrice?: string; // Limit price in rao
  netuid?: number;
  calls?: any[]; // For batch calls like force_batch
}

// Proxy call data structure returned by the API
export interface ProxyCallData {
  id: string;
  network: string;
  block_number: number;
  timestamp: string;
  signer_address: AddressType; // The proxy account that signed the transaction
  real_address: AddressType; // The real account on whose behalf the transaction was executed
  args: ProxyCallArgs;
  extrinsic_id: string;
  extrinsic_hash: string;
}

// Order options for proxy calls
export type ProxyCallOrderOptions =
  | 'block_number_asc'
  | 'block_number_desc'
  | 'timestamp_asc'
  | 'timestamp_desc';

// Query parameters for getRuntimeVersionHistory
export interface GetRuntimeVersionHistoryParams extends BaseQueryParams {
  block_start?: number; // Block number for start of range
  block_end?: number; // Block number for end of range
  timestamp_start?: number; // Timestamp range in Unix timestamp (seconds since 1970-01-01) (inclusive)
  timestamp_end?: number; // Timestamp range in Unix timestamp (seconds since 1970-01-01) (inclusive)
  order?: RuntimeVersionHistoryOrderOptions; // Sort order
  // page and limit are inherited from BaseQueryParams
}

// Query parameters for getProxyCalls
export interface GetProxyCallsParams extends BaseQueryParams {
  id?: string; // Proxy call ID
  signer_address?: string; // SS58 or hex format of the proxy account
  real_address?: string; // SS58 or hex format of the real account
  network?: string; // Network filter
  block_number?: number; // The exact block number
  block_start?: number; // Block number for start of range
  block_end?: number; // Block number for end of range
  timestamp_start?: number; // Unix timestamp start
  timestamp_end?: number; // Unix timestamp end
  extrinsic_hash?: string; // Hash value of the extrinsic
  extrinsic_id?: string; // ID of the extrinsic
  order?: ProxyCallOrderOptions; // Sort order
  // page and limit are inherited from BaseQueryParams
}

// Query parameters for getStatsHistory
export interface GetStatsHistoryParams extends BaseQueryParams {
  block_number?: number; // The exact block number
  block_start?: number; // Block number for start of range
  block_end?: number; // Block number for end of range
  timestamp_start?: number; // Start of timestamp range in Unix timestamp (seconds since 1970-01-01) (inclusive)
  timestamp_end?: number; // End of timestamp range in Unix timestamp (seconds since 1970-01-01) (inclusive)
  frequency?: StatsHistoryFrequency; // Frequency of data points (defaults to by_day)
  order?: StatsHistoryOrderOptions; // Sort order
  // page and limit are inherited from BaseQueryParams
}

// Query parameters for getChainCalls
export interface GetChainCallsParams extends BaseQueryParams {
  origin_address?: string; // Origin address filter
  network?: ChainCallNetwork; // Network filter (defaults to finney)
  block_number?: number; // The exact block number
  block_start?: number; // Block number for start of range
  block_end?: number; // Block number for end of range
  timestamp_start?: number; // Timestamp range in Unix timestamp (seconds since 1970-01-01) (inclusive)
  timestamp_end?: number; // Timestamp range in Unix timestamp (seconds since 1970-01-01) (inclusive)
  success?: boolean; // Was the chain call successful? or did it fail
  full_name?: string; // Full name of the extrinsic Ex SubtensorModule.add_stake
  id?: string; // Call Id
  extrinsic_id?: string; // Extrinsic ID
  parent_id?: string; // Parent ID for nested calls
  order?: ChainCallOrderOptions; // Sort order
  // page and limit are inherited from BaseQueryParams
}
