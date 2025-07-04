import { HttpClient } from '../../client/http-client';
import { ApiResponse } from '../../types/common';
import {
  TaoPriceData,
  TaoOHLCData,
  TaoStatsResponse,
  GetTaoPriceParams,
  GetTaoPriceHistoryParams,
  GetTaoPriceOHLCParams,
} from './types';

export class TaoPricesModule {
  constructor(private httpClient: HttpClient) { }

  /**
   * Get the latest TAO price
   * @param params - Query parameters for the request
   * @returns Promise with the latest TAO price data
   */
  async getTaoPrice(params?: GetTaoPriceParams): Promise<ApiResponse<TaoStatsResponse<TaoPriceData>>> {
    const requestParams = { asset: 'tao', ...params };
    return this.httpClient.get<TaoStatsResponse<TaoPriceData>>('/api/price/latest/v1', requestParams);
  }

  /**
   * Get TAO price history
   * @param params - Query parameters including timestamp range, pagination, etc.
   * @returns Promise with historical TAO price data
   */
  async getTaoPriceHistory(params?: GetTaoPriceHistoryParams): Promise<ApiResponse<TaoStatsResponse<TaoPriceData>>> {
    const requestParams = { asset: 'TAO', ...params };
    return this.httpClient.get<TaoStatsResponse<TaoPriceData>>('/api/price/history/v1', requestParams);
  }

  /**
   * Get TAO OHLC (Open, High, Low, Close) candlestick data
   * @param params - Query parameters including period, timestamp range, pagination, etc.
   * @returns Promise with TAO OHLC data
   */
  async getTaoPriceOHLC(params?: GetTaoPriceOHLCParams): Promise<ApiResponse<TaoStatsResponse<TaoOHLCData>>> {
    const requestParams = { asset: 'tao', period: '1d', ...params };
    return this.httpClient.get<TaoStatsResponse<TaoOHLCData>>('/api/price/ohlc/v1', requestParams);
  }
} 