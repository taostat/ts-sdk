import { HttpClient } from '../../client/http-client';
import { ApiResponse } from '../../types/common';
import { SubnetsQueryParams, SubnetsResponse, HistoricalSubnetPricesQueryParams, HistoricalSubnetPricesResponse, LatestSubnetPricesResponse, SubnetRegistrationsQueryParams, SubnetRegistrationsResponse, RegistrationCostHistoryQueryParams, RegistrationCostHistoryResponse, CurrentRegistrationCostResponse, SubnetOwnerQueryParams, SubnetOwnerResponse, SubnetIdentityQueryParams, SubnetIdentityResponse, SubnetEmissionQueryParams, SubnetEmissionResponse, SubnetsPoolsHistoryQueryParams, SubnetsPoolsHistoryResponse, CurrentSubnetPoolsQueryParams, CurrentSubnetPoolsResponse, SubnetHistoryQueryParams, SubnetHistoryResponse } from './types';

export class SubnetsModule {
  constructor(private httpClient: HttpClient) { }

  /**
   * Get subnets with their hyperparameters
   * @param params - Optional query parameters for filtering, pagination, and ordering
   * @returns Promise with paginated subnets data
   */
  async getSubnets(params?: SubnetsQueryParams): Promise<ApiResponse<SubnetsResponse>> {
    return this.httpClient.get<SubnetsResponse>('/api/subnet/latest/v1', params);
  }

  /**
   * Get historical subnet prices sum with volume data
   * @param params - Optional query parameters (frequency defaults to 'by_day')
   * @returns Promise with paginated historical subnet price data
   */
  async getHistoricalSubnetPricesSum(params?: HistoricalSubnetPricesQueryParams): Promise<ApiResponse<HistoricalSubnetPricesResponse>> {
    return this.httpClient.get<HistoricalSubnetPricesResponse>('/api/dtao/pool/total_price/history/v1', params);
  }

  /**
   * Get the latest subnet prices sum with fear and greed index
   * @returns Promise with the latest subnet price data
   */
  async getLatestSubnetPricesSum(): Promise<ApiResponse<LatestSubnetPricesResponse>> {
    return this.httpClient.get<LatestSubnetPricesResponse>('/api/dtao/pool/total_price/latest/v1');
  }

  /**
   * Get subnet registration history with comprehensive filtering options
   * @param params - Optional query parameters for filtering by netuid, owner, timestamps, blocks, etc.
   * @returns Promise with paginated subnet registration data
   */
  async getSubnetRegistrations(params?: SubnetRegistrationsQueryParams): Promise<ApiResponse<SubnetRegistrationsResponse>> {
    return this.httpClient.get<SubnetRegistrationsResponse>('/api/subnet/registration/v1', params);
  }

  /**
   * Get registration cost history with purchase indicators
   * @param params - Optional query parameters for filtering by blocks, timestamps, etc.
   * @returns Promise with paginated registration cost history data
   */
  async getSubnetRegistrationCostHistory(params?: RegistrationCostHistoryQueryParams): Promise<ApiResponse<RegistrationCostHistoryResponse>> {
    return this.httpClient.get<RegistrationCostHistoryResponse>('/api/subnet/registration_cost/history/v1', params);
  }

  /**
   * Get the current subnet registration cost
   * @returns Promise with the latest registration cost data
   */
  async getCurrentSubnetRegistrationCost(): Promise<ApiResponse<CurrentRegistrationCostResponse>> {
    return this.httpClient.get<CurrentRegistrationCostResponse>('/api/subnet/registration_cost/latest/v1');
  }

  /**
   * Get subnet ownership history and coldkey swap tracking
   * @param params - Optional query parameters for filtering by netuid, owner, swap status, timestamps, blocks, etc.
   * @returns Promise with paginated subnet owner data
   */
  async getSubnetOwner(params?: SubnetOwnerQueryParams): Promise<ApiResponse<SubnetOwnerResponse>> {
    return this.httpClient.get<SubnetOwnerResponse>('/api/subnet/owner/v1', params);
  }

  /**
   * Get subnet identity information including names, descriptions, and contact details
   * @param params - Optional query parameters for pagination
   * @returns Promise with paginated subnet identity data
   */
  async getSubnetIdentity(params?: SubnetIdentityQueryParams): Promise<ApiResponse<SubnetIdentityResponse>> {
    return this.httpClient.get<SubnetIdentityResponse>('/api/subnet/identity/v1', params);
  }

  /**
   * Get subnet emission data including TAO and Alpha pool information
   * @param params - Optional query parameters for filtering by netuid, blocks, timestamps, and ordering by various metrics
   * @returns Promise with paginated subnet emission data
   */
  async getSubnetEmission(params?: SubnetEmissionQueryParams): Promise<ApiResponse<SubnetEmissionResponse>> {
    return this.httpClient.get<SubnetEmissionResponse>('/api/dtao/subnet_emission/v1', params);
  }

  /**
   * Get subnets pools history including market cap, liquidity, and token distribution data
   * @param params - Optional query parameters for filtering by netuid, frequency, blocks, timestamps, and comprehensive ordering options
   * @returns Promise with paginated subnets pools history data
   */
  async getSubnetsPoolsHistory(params?: SubnetsPoolsHistoryQueryParams): Promise<ApiResponse<SubnetsPoolsHistoryResponse>> {
    return this.httpClient.get<SubnetsPoolsHistoryResponse>('/api/dtao/pool/history/v1', params);
  }

  /**
   * Get current subnet pools data with comprehensive trading metrics, price changes, and 7-day price history
   * @param params - Optional query parameters for filtering by netuid and ordering by various metrics
   * @returns Promise with paginated current subnet pools data including fear & greed index, volume data, and trading statistics
   */
  async getCurrentSubnetPools(params?: CurrentSubnetPoolsQueryParams): Promise<ApiResponse<CurrentSubnetPoolsResponse>> {
    return this.httpClient.get<CurrentSubnetPoolsResponse>('/api/dtao/pool/latest/v1', params);
  }

  /**
   * Get historical subnet hyperparameter data with comprehensive filtering and frequency options
   * @param params - Query parameters including required netuid and optional frequency, time ranges, and ordering
   * @returns Promise with paginated subnet history data including all hyperparameters and configuration changes over time
   */
  async getSubnetHistory(params: SubnetHistoryQueryParams): Promise<ApiResponse<SubnetHistoryResponse>> {
    return this.httpClient.get<SubnetHistoryResponse>('/api/subnet/history/v1', params);
  }
}
