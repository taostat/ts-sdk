import { HttpClient } from '../../client/http-client';
import { ApiResponse } from '../../types/common';
import {
  TradingViewUDFResponse,
  GetTradingViewHistoryParams,
} from './types';

export class TradingViewModule {
  constructor(private httpClient: HttpClient) { }

  /**
   * Get TradingView UDF history data for subnets
   * @param params - Query parameters including symbol, resolution, from/to timestamps
   * @returns Promise with TradingView UDF formatted data
   */
  async getTradingViewHistory(params: GetTradingViewHistoryParams): Promise<ApiResponse<TradingViewUDFResponse>> {
    return this.httpClient.get<TradingViewUDFResponse>('/api/dtao/tradingview/udf/history', params);
  }
} 