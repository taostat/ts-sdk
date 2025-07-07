import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { TaoStatsConfig } from '../types/config';
import { TaoStatsError } from '../types/errors';
import { ApiResponse } from '../types/common';
import { DEFAULT_BASE_URL, DEFAULT_TIMEOUT, DEFAULT_RETRIES, DEFAULT_RPC_URL } from '../helpers/constants';

export class HttpClient {
  private client: AxiosInstance;
  private config: TaoStatsConfig;

  constructor(config: TaoStatsConfig) {
    let effectiveRpcUrl = DEFAULT_RPC_URL;

    if (config.apiKey) {
      effectiveRpcUrl = DEFAULT_RPC_URL.replace('{API_KEY}', config.apiKey);
    } else if (config.rpcUrl) {
      effectiveRpcUrl = config.rpcUrl;
    } else if (typeof process !== 'undefined' && process.env?.RPC_URL) {
      effectiveRpcUrl = process.env.RPC_URL;
    }

    this.config = {
      baseUrl: DEFAULT_BASE_URL,
      timeout: DEFAULT_TIMEOUT,
      retries: DEFAULT_RETRIES,
      ...config,
      rpcUrl: effectiveRpcUrl,
      seed: config.seed || (typeof process !== 'undefined' && process.env?.TAO_ACCOUNT_SEED || ''),
      privateKey: config.privateKey || (typeof process !== 'undefined' && process.env?.TAO_ACCOUNT_PRIVATE_KEY || '')
    };

    this.client = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        'accept': 'application/json',
        ...(this.config.apiKey && { 'Authorization': this.config.apiKey }),
        'User-Agent': 'taostats-sdk/1.0.0',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Checks if API key is required for this request
        if (!this.config.apiKey && config.url && !config.url.includes('/status/')) {
          throw new TaoStatsError(
            'API key is required for TaoStats API calls. Please provide apiKey in TaoStatsClient config. ' +
            'Note: API key is not required with custom rpc url for blockchain operations (transfer, stake and unstake modules).'
          );
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Retry logic
        if (
          error.response?.status >= 500 &&
          originalRequest._retryCount < (this.config.retries || 3)
        ) {
          originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

          // Exponential backoff
          const delay = Math.pow(2, originalRequest._retryCount) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));

          return this.client(originalRequest);
        }

        throw this.handleError(error);
      }
    );
  }

  private handleError(error: any): TaoStatsError {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.data?.error || error.message;
      return new TaoStatsError(
        message,
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      // Request was made but no response received
      return new TaoStatsError('Network error: No response received');
    } else {
      // Something else happened
      return new TaoStatsError(error.message);
    }
  }

  async get<T = any>(
    url: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get(url, {
        params,
        ...config,
      });
      return this.formatResponse(response);
    } catch (error) {
      throw error;
    }
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post(url, data, config);
      return this.formatResponse(response);
    } catch (error) {
      throw error;
    }
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put(url, data, config);
      return this.formatResponse(response);
    } catch (error) {
      throw error;
    }
  }

  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete(url, config);
      return this.formatResponse(response);
    } catch (error) {
      throw error;
    }
  }

  private formatResponse<T>(response: AxiosResponse): ApiResponse<T> {
    return {
      success: response.status >= 200 && response.status < 300,
      data: response.data,
    };
  }
} 