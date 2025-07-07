import { ApiPromise, WsProvider } from '@polkadot/api';
import { ApiDecoration } from '@polkadot/api/types';
import { HttpClient } from '../../client/http-client';

/**
 * ApiManager class that manages blockchain API connections
 * Gets RPC URL from HttpClient configuration
 */
export class ApiManager {
  private static instance: ApiManager;
  private httpClient: HttpClient;
  private api?: ApiPromise;
  private currentRpcUrl?: string;
  private apiAtCache: Map<string, ApiDecoration<'promise'>> = new Map();

  private constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public static getInstance(httpClient?: HttpClient): ApiManager {
    if (!ApiManager.instance) {
      if (!httpClient) {
        throw new Error('HttpClient required for first ApiManager initialization');
      }
      ApiManager.instance = new ApiManager(httpClient);
    }
    return ApiManager.instance;
  }

  /**
   * Get the RPC URL from the HttpClient configuration
   */
  private getRpcUrl(): string | undefined {
    return (this.httpClient as any).config?.rpcUrl;
  }

  /**
   * Get API instance, reusing existing connection if RPC URL hasn't changed
   */
  async getApi(): Promise<ApiPromise> {
    const rpcUrl = this.getRpcUrl();

    if (this.api && this.currentRpcUrl && this.currentRpcUrl !== rpcUrl) {
      try {
        await this.api.disconnect();
      } catch (error) {
        console.warn('Warning: Error disconnecting previous API connection:', error);
      }
      this.api = undefined;
    }

    if (!this.api) {
      console.log(`Connecting to RPC: ${rpcUrl}`);
      const wsProvider = new WsProvider(rpcUrl);
      this.api = await ApiPromise.create({ provider: wsProvider, noInitWarn: true });
      this.currentRpcUrl = rpcUrl;
      console.log('Polkadot API Connected successfully');

      this.api.on('error', (error: any) => {
        console.error('Polkadot API Error:', error);
      });
      this.api.on('disconnected', () => {
        console.log('Polkadot API Disconnected - will reconnect on next call');
        // Reset the API instance so it can reconnect
        this.api = undefined;
        this.currentRpcUrl = undefined;
      });
    }

    return this.api;
  }

  /**
   * Get API instance at a specific block
   */
  async getApiAtBlock(blockNumber: number): Promise<ApiDecoration<'promise'>> {
    const api = await this.getApi();
    const hash = await api.rpc.chain.getBlockHash(blockNumber);
    const hashStr = hash.toString();

    if (!this.apiAtCache.has(hashStr)) {
      // Wait for a free slot if the cache is full
      while (this.apiAtCache.size >= 32) {
        await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for 100ms
      }

      this.apiAtCache.set(hashStr, await api.at(hash));
    }

    return this.apiAtCache.get(hashStr)!;
  }

  /**
   * Clear cached API instances at specific blocks
   */
  clearChainApiAtBlock(block?: number) {
    if (block && this.api) {
      const hash = this.api.rpc.chain.getBlockHash(block).toString();
      if (hash) {
        this.apiAtCache.delete(hash);
      }
    } else {
      this.apiAtCache.clear();
    }
  }

  /**
   * Get account config from the HttpClient configuration
   */
  private getAccountConfig(): { seed?: string; privateKey?: string } {
    const config = (this.httpClient as any).config;
    return {
      seed: config?.seed,
      privateKey: config?.privateKey
    };
  }

  /**
   * Get account config (public method for getAccounts to use)
   */
  public getAccountConfiguration(): { seed?: string; privateKey?: string } {
    return this.getAccountConfig();
  }
} 