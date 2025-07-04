import { HttpClient } from '../../client/http-client';
import { ApiResponse, PaginatedResponse } from '../../types/common';
import {
  SlippageData,
  DelegationEventData,
  StakeBalanceSumData,
  StakeBalanceData,
  HistoricalStakeBalanceData,
  GetSlippageParams,
  GetDelegationEventsParams,
  GetStakeBalanceSumInTaoParams,
  GetdTaoStakeBalanceParams,
  GetdTaoHistoricalStakeBalanceParams,
} from './types';

export class DelegationsModule {
  constructor(private httpClient: HttpClient) { }

  /**
   * Calculate slippage for TAO ⇄ Alpha token swaps
   * @param params - Query parameters including netuid, input_tokens, and direction
   * @returns Promise with slippage calculation data
   */
  async getSlippage(params: GetSlippageParams): Promise<ApiResponse<PaginatedResponse<SlippageData>>> {
    // Set default direction if not provided
    const queryParams = {
      direction: 'tao_to_alpha',
      ...params,
    };
    return this.httpClient.get<PaginatedResponse<SlippageData>>('/api/dtao/slippage/v1', queryParams);
  }

  /**
   * Get delegation/stake and undelegation/unstake events
   * @param params - Optional query parameters for filtering delegation events
   * @returns Promise with delegation event data
   */
  async getDelegationEvents(params?: GetDelegationEventsParams): Promise<ApiResponse<PaginatedResponse<DelegationEventData>>> {
    return this.httpClient.get<PaginatedResponse<DelegationEventData>>('/api/delegation/v1', params);
  }

  /**
   * Get aggregated stake balances per coldkey (total across all validators/subnets)
   * @param params - Optional query parameters for filtering aggregated stake data
   * @returns Promise with aggregated stake balance data
   */
  async getStakeBalanceSumInTao(params?: GetStakeBalanceSumInTaoParams): Promise<ApiResponse<PaginatedResponse<StakeBalanceSumData>>> {
    return this.httpClient.get<PaginatedResponse<StakeBalanceSumData>>('/api/dtao/stake_balance_aggregated/latest/v1', params);
  }

  /**
   * Get individual stake balance positions (current)
   * @param params - Optional query parameters for filtering individual stake positions
   * @returns Promise with individual stake balance data
   */
  async getdTaoStakeBalance(params?: GetdTaoStakeBalanceParams): Promise<ApiResponse<PaginatedResponse<StakeBalanceData>>> {
    return this.httpClient.get<PaginatedResponse<StakeBalanceData>>('/api/dtao/stake_balance/latest/v1', params);
  }

  /**
   * Get historical stake balance for a specific position
   * @param params - Query parameters including required coldkey, hotkey, and netuid
   * @returns Promise with historical stake balance data
   */
  async getdTaoHistoricalStakeBalance(params: GetdTaoHistoricalStakeBalanceParams): Promise<ApiResponse<PaginatedResponse<HistoricalStakeBalanceData>>> {
    return this.httpClient.get<PaginatedResponse<HistoricalStakeBalanceData>>('/api/dtao/stake_balance/history/v1', params);
  }
} 