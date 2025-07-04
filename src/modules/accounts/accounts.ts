import { HttpClient } from '../../client/http-client';
import { ApiResponse, PaginatedResponse } from '../../types/common';
import {
  AccountData,
  TransferData,
  OnChainIdentityData,
  GetAccountParams,
  GetAccountHistoryParams,
  GetTransfersParams,
  GetOnChainIdentityParams,
} from './types';

export class AccountsModule {
  constructor(private httpClient: HttpClient) { }

  /**
   * Get current account data/balances
   * @param params - Optional query parameters. If address is provided, gets specific account with 24hr comparison data
   * @returns Promise with current account data (single account or paginated list)
   */
  async getAccount(params?: GetAccountParams): Promise<ApiResponse<PaginatedResponse<AccountData>>> {
    return this.httpClient.get<PaginatedResponse<AccountData>>('/api/account/latest/v1', params);
  }

  /**
   * Get historical account balance snapshots over time
   * @param params - Query parameters including required address
   * @returns Promise with historical account balance data
   */
  async getAccountHistory(params: GetAccountHistoryParams): Promise<ApiResponse<PaginatedResponse<AccountData>>> {
    return this.httpClient.get<PaginatedResponse<AccountData>>('/api/account/history/v1', params);
  }

  /**
   * Get transfer/transaction data
   * @param params - Optional query parameters for filtering transfers
   * @returns Promise with transfer transaction data
   */
  async getTransfers(params?: GetTransfersParams): Promise<ApiResponse<PaginatedResponse<TransferData>>> {
    return this.httpClient.get<PaginatedResponse<TransferData>>('/api/transfer/v1', params);
  }

  /**
   * Get on-chain identity/profile information
   * @param params - Optional query parameters. If address is provided, gets specific identity
   * @returns Promise with on-chain identity data
   */
  async getOnChainIdentity(params?: GetOnChainIdentityParams): Promise<ApiResponse<PaginatedResponse<OnChainIdentityData>>> {
    return this.httpClient.get<PaginatedResponse<OnChainIdentityData>>('/api/identity/latest/v1', params);
  }
} 