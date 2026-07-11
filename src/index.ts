// Main client
export { TaoStatsClient } from './client/taostats-client';

// Core types
export * from './types/common';
export * from './types/config';
export * from './types/errors';

// Read-surface module classes: GENERATED from the OpenAPI spec.
export {
  AccountsModule,
  ChainModule,
  DelegationsModule,
  LiveModule,
  MetagraphModule,
  SubnetsModule,
  TaoPricesModule,
  TradingViewModule,
  ValidatorsModule,
  OtcModule,
  EvmModule,
  AccountingModule,
} from './generated/modules';

// Generated OpenAPI types (paths/components) for advanced consumers.
export type { paths } from './generated/schema';

// Transaction/signing module classes: HAND-WRITTEN.
export * from './modules/stake';
export * from './modules/unstake';
export * from './modules/move';
// export * from './modules/transfer';

// Utility exports
export * from './helpers/constants';

// Default export
export { TaoStatsClient as default } from './client/taostats-client';
