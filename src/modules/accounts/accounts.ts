import { HttpClient } from '../../client/http-client';
import { ApiResponse, PaginatedResponse, V1PaginatedResponse } from '../../types/common';
import {
  AccountData,
  TransferData,
  OnChainIdentityData,
  GetAccountParams,
  GetAccountHistoryParams,
  GetTransfersParams,
  GetOnChainIdentityParams,
  PendingColdkeySwapResponse,
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
  async getTransfers(params?: GetTransfersParams): Promise<ApiResponse<V1PaginatedResponse<TransferData>>> {
    const {
      order,
      order_by,
      order_dir,
      startDate: _startDate,
      endDate: _endDate,
      ...filters
    } = params ?? {};
    const orderDir = order_dir ?? (order?.endsWith('_desc') ? 'desc' : order ? 'asc' : undefined);
    const mappedOrderBy = order_by ?? (order?.startsWith('amount_') ? 'amount' : order ? 'timestamp' : undefined);
    return this.httpClient.get<V1PaginatedResponse<TransferData>>('/v1/transfers', {
      ...filters,
      ...(mappedOrderBy ? { order_by: mappedOrderBy } : {}),
      ...(orderDir ? { order_dir: orderDir } : {}),
    });
  }

  /**
   * Get on-chain identity/profile information
   * @param params - Optional query parameters. If address is provided, gets specific identity
   * @returns Promise with on-chain identity data
   */
  async getOnChainIdentity(params?: GetOnChainIdentityParams): Promise<ApiResponse<PaginatedResponse<OnChainIdentityData>>> {
    return this.httpClient.get<PaginatedResponse<OnChainIdentityData>>('/api/identity/latest/v1', params);
  }

  /**
   * Get pending coldkey swap information
   * @returns Promise with pending coldkey swap data including SS58 keys, execution details, and predicted execution timestamp
   */
  async getPendingColdkeySwap(): Promise<ApiResponse<PendingColdkeySwapResponse>> {
    return this.httpClient.get<PendingColdkeySwapResponse>('/v1/accounts/pending-coldkey-swaps');
  }

}
