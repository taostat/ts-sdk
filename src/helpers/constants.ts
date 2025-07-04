// API Constants
export const DEFAULT_BASE_URL = 'https://api.taostats.io';
export const DEFAULT_TIMEOUT = 30000;
export const DEFAULT_RETRIES = 3;
export const DEFAULT_RPC_URL = 'wss://api.taostats.io/api/v1/rpc/ws/finney_archive?authorization={API_KEY}';

// Common query parameter defaults
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Price intervals
export const PRICE_INTERVALS = ['1m', '5m', '1h', '4h', '1d', '1w', '1M'] as const;

// Transaction types
export const TRANSACTION_TYPES = ['transfer', 'stake', 'unstake', 'delegate', 'reward'] as const;

// Transaction statuses
export const TRANSACTION_STATUSES = ['pending', 'confirmed', 'failed'] as const;

// Known existential deposit
export const EXISTENTIAL_DEPOSIT = '0.0000005';

export const TAOSTATS_HOTKEY = '5GKH9FPPnWSUoeeTJp19wVtd84XqFW4pyK2ijV2GsFbhTrP1';
export const MIN_LIQUIDITY = 5000000; // 0.005 tao
export const STAKE_FEE = 50000; // 0.0005 tao
