// TradingView UDF History Response
export interface TradingViewUDFResponse {
  s: string; // status ("ok")
  t: number[]; // unix timestamps
  c: number[]; // close prices
  o: number[]; // open prices
  h: number[]; // high prices
  l: number[]; // low prices
  v: number[]; // volumes
}

// Query parameters for getTradingViewHistory
export interface GetTradingViewHistoryParams {
  symbol: string; // required: "SUB-" followed by subnet netuid (e.g., "SUB-19")
  resolution: string; // required: granularity (1,5,15,60 for minutes, 1D,7D,30D for days)
  from: number; // required: unix timestamp
  to: number; // required: unix timestamp
} 