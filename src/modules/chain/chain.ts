import { HttpClient } from '../../client/http-client';
import { ApiResponse, PaginatedResponse } from '../../types/common';
import { BlockData, GetBlocksParams, BlockIntervalData, GetBlockNumbersByIntervalParams, ExtrinsicData, GetExtrinsicsParams, EventData, GetEventsParams, ChainCallData, GetChainCallsParams, NetworkStatsData, GetStatsHistoryParams, RuntimeVersionData, GetRuntimeVersionHistoryParams, ProxyCallData, GetProxyCallsParams } from './types';

export class ChainModule {
  constructor(private httpClient: HttpClient) { }

  /**
   * Get blockchain blocks with optional filtering and pagination
   * @param params - Optional query parameters for filtering blocks
   * @returns Promise with paginated block data
   */
  async getBlocks(params?: GetBlocksParams): Promise<ApiResponse<PaginatedResponse<BlockData>>> {
    return this.httpClient.get<PaginatedResponse<BlockData>>('/api/block/v1', params);
  }

  /**
   * Get block numbers at specific time intervals (hourly or daily)
   * @param params - Query parameters including required timestamp range and frequency
   * @returns Promise with paginated block interval data
   */
  async getBlockNumbersByInterval(params: GetBlockNumbersByIntervalParams): Promise<ApiResponse<PaginatedResponse<BlockIntervalData>>> {
    return this.httpClient.get<PaginatedResponse<BlockIntervalData>>('/api/block/interval/v1', params);
  }

  /**
   * Get all primary extrinsics (transactions) with optional filtering and pagination
   * @param params - Optional query parameters for filtering extrinsics
   * @returns Promise with paginated extrinsic data
   */
  async getExtrinsics(params?: GetExtrinsicsParams): Promise<ApiResponse<PaginatedResponse<ExtrinsicData>>> {
    return this.httpClient.get<PaginatedResponse<ExtrinsicData>>('/api/extrinsic/v1', params);
  }

  /**
   * Get blockchain events with optional filtering and pagination
   * @param params - Optional query parameters for filtering events
   * @returns Promise with paginated event data
   */
  async getEvents(params?: GetEventsParams): Promise<ApiResponse<PaginatedResponse<EventData>>> {
    return this.httpClient.get<PaginatedResponse<EventData>>('/api/event/v1', params);
  }

  /**
   * Get all blockchain calls including nested calls from batch/proxy extrinsics
   * @param params - Optional query parameters for filtering chain calls
   * @returns Promise with paginated chain call data
   */
  async getChainCalls(params?: GetChainCallsParams): Promise<ApiResponse<PaginatedResponse<ChainCallData>>> {
    return this.httpClient.get<PaginatedResponse<ChainCallData>>('/api/call/v1', params);
  }

  /**
   * Get the latest network statistics including staking, accounts, and blockchain metrics
   * @returns Promise with latest network statistics data
   */
  async getLatestStats(): Promise<ApiResponse<PaginatedResponse<NetworkStatsData>>> {
    return this.httpClient.get<PaginatedResponse<NetworkStatsData>>('/api/stats/latest/v1');
  }

  /**
   * Get historical network statistics with optional filtering and pagination
   * @param params - Optional query parameters for filtering historical stats
   * @returns Promise with paginated historical network statistics data
   */
  async getStatsHistory(params?: GetStatsHistoryParams): Promise<ApiResponse<PaginatedResponse<NetworkStatsData>>> {
    return this.httpClient.get<PaginatedResponse<NetworkStatsData>>('/api/stats/history/v1', params);
  }

  /**
   * Get the latest runtime version information
   * @returns Promise with latest runtime version data
   */
  async getRuntimeVersion(): Promise<ApiResponse<PaginatedResponse<RuntimeVersionData>>> {
    return this.httpClient.get<PaginatedResponse<RuntimeVersionData>>('/api/runtime_version/latest/v1');
  }

  /**
   * Get historical runtime version information with optional filtering and pagination
   * @param params - Optional query parameters for filtering runtime version history
   * @returns Promise with paginated historical runtime version data
   */
  async getRuntimeVersionHistory(params?: GetRuntimeVersionHistoryParams): Promise<ApiResponse<PaginatedResponse<RuntimeVersionData>>> {
    return this.httpClient.get<PaginatedResponse<RuntimeVersionData>>('/api/runtime_version/history/v1', params);
  }

  /**
   * Get proxy call transactions where one account executes transactions on behalf of another
   * @param params - Optional query parameters for filtering proxy calls
   * @returns Promise with paginated proxy call data
   */
  async getProxyCalls(params?: GetProxyCallsParams): Promise<ApiResponse<PaginatedResponse<ProxyCallData>>> {
    return this.httpClient.get<PaginatedResponse<ProxyCallData>>('/api/proxy_call/v1', params);
  }
}
