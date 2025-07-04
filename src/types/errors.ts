// Custom error class for TaoStats API errors
export class TaoStatsError extends Error {
  public statusCode?: number;
  public response?: any;

  constructor(message: string, statusCode?: number, response?: any) {
    super(message);
    this.name = 'TaoStatsError';
    this.statusCode = statusCode;
    this.response = response;
  }
} 