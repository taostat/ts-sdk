import { HttpClient } from '../../client/http-client';
import { ApiResponse } from '../../types/common';
import { LiveBalanceInfo, LiveBlockExtrinsics, BlockRangeParams, LiveBlockRangeExtrinsics, LiveRawBlockExtrinsics, LiveNodeTransactionPool, LiveNodeVersion, LivePalletConstants, LivePalletEvents } from './types';

export class LiveModule {
  constructor(private httpClient: HttpClient) { }

  /**
   * Get free TAO balance information for a specific address
   * @param address - Required coldkey address
   * @returns Promise with balance information
   */
  async getFreeTaoBalance(address: string): Promise<ApiResponse<LiveBalanceInfo>> {
    return this.httpClient.get<LiveBalanceInfo>(`/api/v1/live/accounts/${address}/balance-info`);
  }

  /**
   * Get the latest block with all its extrinsics
   * @returns Promise with the latest block and its extrinsics data
   */
  async getLatestBlockExtrinsics(): Promise<ApiResponse<LiveBlockExtrinsics>> {
    return this.httpClient.get<LiveBlockExtrinsics>('/api/v1/live/blocks/head');
  }

  /**
   * Get all extrinsics for a block range
   * @param params - Block range parameters (block_start and block_end)
   * @returns Promise with extrinsics data for the specified block range
   */
  async getExtrinsicsForBlockRange(params: BlockRangeParams): Promise<ApiResponse<LiveBlockRangeExtrinsics>> {
    const queryParams = new URLSearchParams({
      block_start: params.block_start.toString(),
      block_end: params.block_end.toString(),
    });

    return this.httpClient.get<LiveBlockRangeExtrinsics>(`/api/v1/live/blocks?${queryParams}`);
  }

  /**
   * Get extrinsics for a specific block number
   * @param blockNumber - Required block number
   * @returns Promise with the block and its extrinsics data
   */
  async getExtrinsicsForSpecificBlock(blockNumber: number): Promise<ApiResponse<LiveBlockExtrinsics>> {
    return this.httpClient.get<LiveBlockExtrinsics>(`/api/v1/live/blocks/${blockNumber}`);
  }

  /**
   * Get raw hex-encoded extrinsics for a specific block number
   * @param blockNumber - Required block number
   * @returns Promise with the block and its raw extrinsics data
   */
  async getRawExtrinsicsForSpecificBlock(blockNumber: number): Promise<ApiResponse<LiveRawBlockExtrinsics>> {
    return this.httpClient.get<LiveRawBlockExtrinsics>(`/api/v1/live/blocks/${blockNumber}/extrinsics-raw`);
  }

  /**
   * Get the current transaction pool from the node
   * @returns Promise with pending transactions in the node's transaction pool
   */
  async getNodeTransactionPool(): Promise<ApiResponse<LiveNodeTransactionPool>> {
    return this.httpClient.get<LiveNodeTransactionPool>('/api/v1/live/node/transaction-pool');
  }

  /**
   * Get version information from the node
   * @returns Promise with node version details
   */
  async getNodeVersion(): Promise<ApiResponse<LiveNodeVersion>> {
    return this.httpClient.get<LiveNodeVersion>('/api/v1/live/node/version');
  }

  /**
   * Get constants for a specific pallet
   * @param palletId - Required pallet identifier (e.g.,'aura', 'balances', 'commitments', 'crowdloan', 'drand', 'grandpa', 'multisig', 'proxy', 'registry', 'safeMode', 'scheduler', 'subtensorModule', 'system', 'timestamp', 'transactionPayment', 'utility' etc.)
   * @returns Promise with pallet constants data
   */
  async getPalletByConstants(palletId: string): Promise<ApiResponse<LivePalletConstants>> {
    return this.httpClient.get<LivePalletConstants>(`/api/v1/live/pallets/${palletId}/consts`);
  }

  /**
   * Get events for a specific pallet
   * @param palletId - Required pallet identifier (e.g.,'adminUtils','aura', 'balances', 'baseFee', 'commitments', 'crowdloan', 'drand','ethereum', 'evm', 'evmChainId','grandpa', 'multisig', 'proxy', 'registry', 'preimage', 'randomnessCollectiveFlip','safeMode', 'scheduler','senateMembers','substrate' ,'subtensorModule','sudo' , 'system', 'timestamp', 'transactionPayment','triumvirate' ,'triumvirateMembers',etc.)
   * @returns Promise with pallet events data
   */
  async getPalletEvents(palletId: string): Promise<ApiResponse<LivePalletEvents>> {
    return this.httpClient.get<LivePalletEvents>(`/api/v1/live/pallets/${palletId}/events`);
  }
}
