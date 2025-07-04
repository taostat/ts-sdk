import { BaseQueryParams, TaoStatsPagination } from '../../types/common';

// TAO Price Data (used by getTaoPrice and getTaoPriceHistory)
export interface TaoPriceData {
  created_at: string;
  updated_at: string;
  name: string;
  symbol: string;
  slug: string;
  circulating_supply: string;
  max_supply: string;
  total_supply: string;
  last_updated: string;
  price: string;
  volume_24h: string;
  market_cap: string;
  percent_change_1h: string;
  percent_change_24h: string;
  percent_change_7d: string;
  percent_change_30d: string;
  percent_change_60d: string;
  percent_change_90d: string;
  market_cap_dominance: string;
  fully_diluted_market_cap: string;
}

// TAO OHLC Data (used by getTaoPriceOHLC)
export interface TaoOHLCData {
  period: string;
  timestamp: string;
  asset: string;
  volume_24h: string;
  open: string;
  high: string;
  low: string;
  close: string;
}

// API Response wrapper for TAO data
export interface TaoStatsResponse<T> {
  pagination: TaoStatsPagination;
  data: T[];
}

// Query parameters for getTaoPrice
export interface GetTaoPriceParams {
  asset?: string; // defaults to 'tao', only 'tao' supported
}

// Query parameters for getTaoPriceHistory
export interface GetTaoPriceHistoryParams extends BaseQueryParams {
  asset?: string; // defaults to 'TAO'
  timestamp_start?: number; // Unix timestamp (seconds)
  timestamp_end?: number; // Unix timestamp (seconds)
  order?: string; // order of responses
}

// Query parameters for getTaoPriceOHLC
export interface GetTaoPriceOHLCParams extends BaseQueryParams {
  asset?: string; // defaults to 'tao'
  period?: '1h' | '1d' | '1m'; // defaults to '1d'
  timestamp_start?: number; // Unix timestamp (seconds)
  timestamp_end?: number; // Unix timestamp (seconds)
} 