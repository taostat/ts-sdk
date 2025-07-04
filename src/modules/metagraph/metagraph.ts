import { HttpClient } from '../../client/http-client';
import { ApiResponse } from '../../types/common';
import {
  GetMinerIncentiveDistributionBySubnetParams,
  MinerIncentiveDistributionResponse,
  GetSubnetAxonIpDistributionParams,
  SubnetAxonIpDistributionResponse,
  GetSubnetColdkeyDistributionParams,
  SubnetColdkeyDistributionResponse,
  GetLatestMinerWeightParams,
  LatestMinerWeightResponse,
  GetMinerWeightHistoryParams,
  MinerWeightHistoryResponse,
  GetNeuronDeregistrationsParams,
  NeuronDeregistrationsResponse,
  GetNeuronRegistrationsParams,
  NeuronRegistrationsResponse,
  GetRootSubnetHistoryParams,
  RootSubnetHistoryResponse,
  GetRootSubnetParams,
  RootSubnetResponse,
  GetHistoryParams,
  MetagraphHistoryResponse,
  GetLatestParams,
  MetagraphLatestResponse,
} from './types';

export class MetagraphModule {
  constructor(private httpClient: HttpClient) { }

  /**
   * Get miner incentive distribution by subnet
   * @param params - Query parameters including required netuid (subnet ID)
   * @returns Promise with paginated miner incentive distribution data
   */
  async getMinerIncentiveDistributionBySubnet(params: GetMinerIncentiveDistributionBySubnetParams): Promise<ApiResponse<MinerIncentiveDistributionResponse>> {
    return this.httpClient.get<MinerIncentiveDistributionResponse>('/api/subnet/distribution/incentive/v1', params);
  }

  /**
   * Get subnet axon IP distribution
   * @param params - Query parameters including required netuid (subnet ID)
   * @returns Promise with paginated subnet axon IP distribution data
   */
  async getSubnetAxonIpDistribution(params: GetSubnetAxonIpDistributionParams): Promise<ApiResponse<SubnetAxonIpDistributionResponse>> {
    return this.httpClient.get<SubnetAxonIpDistributionResponse>('/api/subnet/distribution/ip/v1', params);
  }

  /**
   * Get subnet coldkey distribution
   * @param params - Query parameters including required netuid (subnet ID)
   * @returns Promise with paginated subnet coldkey distribution data
   */
  async getSubnetColdkeyDistribution(params: GetSubnetColdkeyDistributionParams): Promise<ApiResponse<SubnetColdkeyDistributionResponse>> {
    return this.httpClient.get<SubnetColdkeyDistributionResponse>('/api/subnet/distribution/coldkey/v1', params);
  }

  /**
   * Get latest miner weights
   * @param params - Query parameters including required netuid (subnet ID)
   * @returns Promise with paginated latest miner weight data
   */
  async getLatestMinerWeight(params: GetLatestMinerWeightParams): Promise<ApiResponse<LatestMinerWeightResponse>> {
    return this.httpClient.get<LatestMinerWeightResponse>('/api/miner/weights/latest/v1', params);
  }

  /**
   * Get miner weight history with comprehensive filtering options
   * @param params - Query parameters including required netuid and optional filters for miner_uid, validator_uid, time ranges, and ordering
   * @returns Promise with paginated historical miner weight data
   */
  async getMinerWeightHistory(params: GetMinerWeightHistoryParams): Promise<ApiResponse<MinerWeightHistoryResponse>> {
    return this.httpClient.get<MinerWeightHistoryResponse>('/api/miner/weights/history/v1', params);
  }

  /**
   * Get neuron deregistration events with comprehensive filtering options
   * @param params - Optional query parameters for filtering by netuid, uid, hotkey, time ranges, and ordering
   * @returns Promise with paginated neuron deregistration data
   */
  async getNeuronDeregistrations(params?: GetNeuronDeregistrationsParams): Promise<ApiResponse<NeuronDeregistrationsResponse>> {
    return this.httpClient.get<NeuronDeregistrationsResponse>('/api/subnet/neuron/deregistration/v1', params);
  }

  /**
   * Get neuron registration events with comprehensive filtering options
   * @param params - Optional query parameters for filtering by netuid, uid, hotkey, coldkey, time ranges, and ordering (including registration cost)
   * @returns Promise with paginated neuron registration data
   */
  async getNeuronRegistrations(params?: GetNeuronRegistrationsParams): Promise<ApiResponse<NeuronRegistrationsResponse>> {
    return this.httpClient.get<NeuronRegistrationsResponse>('/api/subnet/neuron/registration/v1', params);
  }

  /**
   * Get root subnet historical data including validator weights, consensus, and subnet weight distributions
   * @param params - Optional query parameters for filtering by hotkey, time ranges, block ranges, and ordering
   * @returns Promise with paginated root subnet history data including dynamic subnet weights mapping
   */
  async getRootSubnetHistory(params?: GetRootSubnetHistoryParams): Promise<ApiResponse<RootSubnetHistoryResponse>> {
    return this.httpClient.get<RootSubnetHistoryResponse>('/api/metagraph/root/history/v1', params);
  }

  /**
   * Get latest root subnet data including current validator weights, consensus, and subnet weight distributions
   * @param params - Optional query parameters for ordering and pagination
   * @returns Promise with paginated root subnet data
   */
  async getRootSubnet(params?: GetRootSubnetParams): Promise<ApiResponse<RootSubnetResponse>> {
    return this.httpClient.get<RootSubnetResponse>('/api/metagraph/root/latest/v1', params);
  }

  /**
   * Get comprehensive metagraph history data including detailed neuron information across subnets
   * @param params - Optional query parameters for filtering by netuid, uid, hotkey, coldkey, time ranges, and ordering
   * @returns Promise with paginated metagraph history data
   */
  async getHistory(params?: GetHistoryParams): Promise<ApiResponse<MetagraphHistoryResponse>> {
    return this.httpClient.get<MetagraphHistoryResponse>('/api/metagraph/history/v1', params);
  }

  /**
   * Get latest metagraph data for a specific subnet including current neuron information
   * @param params - Query parameters including required netuid and optional filters for search, uid, active status, keys, and ordering
   * @returns Promise with paginated latest metagraph data
   */
  async getLatest(params: GetLatestParams): Promise<ApiResponse<MetagraphLatestResponse>> {
    return this.httpClient.get<MetagraphLatestResponse>('/api/metagraph/latest/v1', params);
  }
}
