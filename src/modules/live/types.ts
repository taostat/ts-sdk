// Block reference information
export interface BlockReference {
  hash: string;
  height: string;
}

// Live balance information response structure
export interface LiveBalanceInfo {
  at: BlockReference;
  feeFrozen: string;
  free: string;
  frozen: string;
  locks: any[]; // Array structure may vary
  miscFrozen: string;
  nonce: string;
  reserved: string;
  tokenSymbol: string;
}

// Query parameters for block range extrinsics
export interface BlockRangeParams {
  block_start: number;
  block_end: number;
}

// Method information
export interface Method {
  method: string;
  pallet: string;
}

// Weight information
export interface Weight {
  proofSize: string;
  refTime: string;
}

// Dispatch info and error structures
export interface DispatchInfo {
  class: string;
  paysFee: string;
  weight: Weight;
}

export interface ModuleError {
  error: string;
  index: string;
}

export interface ErrorInfo {
  module: ModuleError;
}

// Event data structure
export interface ExtrinsicEvent {
  data: any[]; // Flexible array that can contain various data types
  method: Method;
}

// Era structures
export interface ImmortalEra {
  immortalEra: string;
}

export interface MortalEra {
  mortalEra: [string, string]; // Tuple of two strings
}

export type Era = ImmortalEra | { mortalEra: [string, string] };

// Signer information
export interface Signer {
  id: string;
}

// Signature structure
export interface LiveExtrinsicSignature {
  signature: string;
  signer: Signer;
}

// Address structure for proxy calls
export interface Address {
  id: string;
}

// Proxy call arguments (can be deeply nested)
export interface LiveProxyCallArgs {
  call?: {
    args?: any;
    method?: Method;
  };
  calls?: any[];
  force_proxy_type?: string | null;
  real?: Address;
  [key: string]: any; // Allow additional dynamic properties
}

// Extrinsic structure
export interface BlockExtrinsic {
  args: {
    [key: string]: any; // Flexible structure for various argument types
  };
  era: Era;
  events: ExtrinsicEvent[];
  hash: string;
  info: {
    error?: string;
    [key: string]: any;
  };
  method: Method;
  nonce: string | null;
  paysFee: boolean;
  signature: LiveExtrinsicSignature | null;
  success: boolean;
  tip: string | null;
}

// Log entry structure
export interface BlockLog {
  index: string;
  type: string;
  value: string[];
}

// Events container structure
export interface EventsContainer {
  events: ExtrinsicEvent[];
}

// Complete block with extrinsics response
export interface LiveBlockExtrinsics {
  authorId: string | null;
  extrinsicRoot: string | null;
  extrinsics: BlockExtrinsic[];
  finalized: boolean;
  hash: string;
  logs: BlockLog[];
  number: string;
  onFinalize: EventsContainer;
  onInitialize: EventsContainer;
  parentHash: string;
  stateRoot: string;
}

// Block range response (array of blocks)
export type LiveBlockRangeExtrinsics = LiveBlockExtrinsics[];

// Raw extrinsics response structure
export interface LiveRawBlockExtrinsics {
  digest: {
    logs: BlockLog[];
  };
  extrinsicRoot: string;
  extrinsics: string[]; // Array of hex-encoded raw extrinsic strings
  number: string; // Hex-encoded block number
  parentHash: string;
  stateRoot: string;
}

// Transaction pool entry
export interface LiveTransactionPoolEntry {
  encodedExtrinsic: string;
  hash: string;
  partialFee: string | null;
  priority: string | null;
  tip: string | null;
}

// Node transaction pool response
export interface LiveNodeTransactionPool {
  pool: LiveTransactionPoolEntry[];
}

// Node version information
export interface LiveNodeVersion {
  chain: string;
  clientImplName: string;
  clientVersion: string;
}

// Pallet constant item
export interface LivePalletConstantItem {
  docs: string[];
  name: string;
  type: string;
  value: string;
}

// Pallet constants response
export interface LivePalletConstants {
  at: BlockReference;
  items: LivePalletConstantItem[];
  pallet: string;
  palletIndex: string;
}

// Pallet event field
export interface LivePalletEventField {
  docs: string[];
  name: string;
  type: string;
  typeName: string;
}

// Pallet event item
export interface LivePalletEventItem {
  args: string[];
  docs: string[];
  fields: LivePalletEventField[];
  index: string;
  name: string;
}

// Pallet events response
export interface LivePalletEvents {
  at: BlockReference;
  items: LivePalletEventItem[];
  pallet: string;
  palletIndex: string;
}
