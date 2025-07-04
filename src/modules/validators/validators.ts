import { HttpClient } from '../../client/http-client';
import { ApiResponse } from '../../types/common';
import {
  GetYieldParams,
  ValidatorYieldResponse,
  GetValidatorsInSubnetParams,
  ValidatorsInSubnetResponse,
  GetWeightCopiersParams,
  WeightCopiersResponse,
  GetAlphaSharesHistoryParams,
  AlphaSharesHistoryResponse,
  GetAlphaSharesLatestParams,
  AlphaSharesLatestResponse,
  GetWeightsHistoryParams,
  WeightsHistoryResponse,
  GetWeightsLatestParams,
  WeightsLatestResponse,
  GetPerformanceParams,
  ValidatorPerformanceResponse,
  GetdTaoValidatorPerformanceLatestParams,
  DTaoValidatorPerformanceLatestResponse,
  GetdTaoValidatorPerformanceHistoryParams,
  DTaoValidatorPerformanceHistoryResponse,
  GetMetricsLatestParams,
  ValidatorMetricsLatestResponse,
  GetMetricsHistoryParams,
  ValidatorMetricsHistoryResponse,
  GetParentChildHotkeyRelationsLatestParams,
  ParentChildHotkeyRelationsLatestResponse,
  GetParentChildHotkeyRelationsHistoryParams,
  ParentChildHotkeyRelationsHistoryResponse,
  GetValidatorLatestParams,
  ValidatorLatestResponse,
  GetdTaoValidatorLatestParams,
  dTaoValidatorLatestResponse,
  GetValidatorHistoryParams,
  ValidatorHistoryResponse,
  GetdTaoValidatorHistoryParams,
  dTaoValidatorHistoryResponse,
} from './types';

export class ValidatorsModule {
  constructor(private httpClient: HttpClient) { }

  /**
   * Get latest validator yield data including APY calculations and epoch participation
   * @param params - Optional query parameters for filtering by hotkey, netuid, min_stake, and ordering
   * @returns Promise with paginated validator yield data
   */
  async getYield(params?: GetYieldParams): Promise<ApiResponse<ValidatorYieldResponse>> {
    return this.httpClient.get<ValidatorYieldResponse>('/api/dtao/validator/yield/latest/v1', params);
  }

  /**
   * Get available validators in a specific subnet
   * @param params - Query parameters including required netuid
   * @returns Promise with paginated validators in subnet data
   */
  async getValidatorsInSubnet(params: GetValidatorsInSubnetParams): Promise<ApiResponse<ValidatorsInSubnetResponse>> {
    return this.httpClient.get<ValidatorsInSubnetResponse>('/api/dtao/validator/available/v1', params);
  }

  /**
   * Get validators that are weight copiers
   * @param params - Optional query parameters for pagination
   * @returns Promise with paginated weight copiers data
   */
  async getWeightCopiers(params?: GetWeightCopiersParams): Promise<ApiResponse<WeightCopiersResponse>> {
    return this.httpClient.get<WeightCopiersResponse>('/api/validator/weight_copier/v1', params);
  }

  /**
   * Get historical alpha shares data for validators
   * @param params - Optional query parameters for filtering by hotkey, netuid, time ranges, and ordering
   * @returns Promise with paginated alpha shares history data
   */
  async getAlphaSharesHistory(params?: GetAlphaSharesHistoryParams): Promise<ApiResponse<AlphaSharesHistoryResponse>> {
    return this.httpClient.get<AlphaSharesHistoryResponse>('/api/dtao/hotkey_alpha_shares/history/v1', params);
  }

  /**
   * Get latest alpha shares data for validators
   * @param params - Optional query parameters for filtering by alpha range, hotkey, netuid, and ordering
   * @returns Promise with paginated latest alpha shares data
   */
  async getAlphaSharesLatest(params?: GetAlphaSharesLatestParams): Promise<ApiResponse<AlphaSharesLatestResponse>> {
    return this.httpClient.get<AlphaSharesLatestResponse>('/api/dtao/hotkey_alpha_shares/latest/v1', params);
  }

  /**
   * Get validator weights history data
   * @param params - Optional query parameters for filtering by hotkey, netuid, uid, block ranges, timestamps, and ordering
   * @returns Promise with paginated validator weights history data
   */
  async getWeightsHistory(params?: GetWeightsHistoryParams): Promise<ApiResponse<WeightsHistoryResponse>> {
    return this.httpClient.get<WeightsHistoryResponse>('/api/validator/weights/history/v2', params);
  }

  /**
   * Get latest validator weights data
   * @param params - Optional query parameters for filtering by hotkey, netuid, uid, and ordering
   * @returns Promise with paginated latest validator weights data
   */
  async getWeightsLatest(params?: GetWeightsLatestParams): Promise<ApiResponse<WeightsLatestResponse>> {
    return this.httpClient.get<WeightsLatestResponse>('/api/validator/weights/latest/v2', params);
  }

  /**
   * Get validator performance data including emission, weight setting status, and tempo information
   * @param params - Query parameters including required hotkey and netuid, with optional ordering
   * @returns Promise with paginated validator performance data
   */
  async getPerformance(params: GetPerformanceParams): Promise<ApiResponse<ValidatorPerformanceResponse>> {
    return this.httpClient.get<ValidatorPerformanceResponse>('/api/validator/performance/v1', params);
  }

  /**
   * Get latest dTao validator performance data including comprehensive metrics like vtrust, take rates, weights, and returns
   * @param params - Query parameters including required hotkey and netuid, with optional ordering
   * @returns Promise with paginated dTao validator performance data
   */
  async getdTaoValidatorPerformanceLatest(params: GetdTaoValidatorPerformanceLatestParams): Promise<ApiResponse<DTaoValidatorPerformanceLatestResponse>> {
    return this.httpClient.get<DTaoValidatorPerformanceLatestResponse>('/api/dtao/validator/performance/latest/v1', params);
  }

  /**
   * Get historical dTao validator performance data with comprehensive filtering options including block and timestamp ranges
   * @param params - Query parameters including required hotkey and netuid, with optional filtering for blocks, timestamps, and ordering
   * @returns Promise with paginated historical dTao validator performance data
   */
  async getdTaoValidatorPerformanceHistory(params: GetdTaoValidatorPerformanceHistoryParams): Promise<ApiResponse<DTaoValidatorPerformanceHistoryResponse>> {
    return this.httpClient.get<DTaoValidatorPerformanceHistoryResponse>('/api/dtao/validator/performance/history/v1', params);
  }

  /**
   * Get latest validator metrics including comprehensive blockchain data, trust scores, rewards, and axon information
   * @param params - Optional query parameters for filtering by hotkey, coldkey, netuid, and ordering
   * @returns Promise with paginated validator metrics data
   */
  async getMetricsLatest(params?: GetMetricsLatestParams): Promise<ApiResponse<ValidatorMetricsLatestResponse>> {
    return this.httpClient.get<ValidatorMetricsLatestResponse>('/api/validator/metrics/latest/v1', params);
  }

  /**
   * Get historical validator metrics with comprehensive filtering options including block and timestamp ranges
   * @param params - Optional query parameters for filtering by hotkey, coldkey, netuid, block ranges, timestamps, and ordering
   * @returns Promise with paginated historical validator metrics data
   */
  async getMetricsHistory(params?: GetMetricsHistoryParams): Promise<ApiResponse<ValidatorMetricsHistoryResponse>> {
    return this.httpClient.get<ValidatorMetricsHistoryResponse>('/api/validator/metrics/history/v1', params);
  }

  /**
   * Get latest parent-child hotkey relationships including detailed stake distributions, proportions, and family metrics
   * @param params - Optional query parameters for filtering by hotkey, netuid, block ranges, and timestamps
   * @returns Promise with paginated parent-child hotkey relations data
   */
  async getParentChildHotkeyRelationsLatest(params?: GetParentChildHotkeyRelationsLatestParams): Promise<ApiResponse<ParentChildHotkeyRelationsLatestResponse>> {
    return this.httpClient.get<ParentChildHotkeyRelationsLatestResponse>('/api/hotkey/family/latest/v1', params);
  }

  /**
   * Get historical parent-child hotkey relationships with comprehensive filtering options including block and timestamp ranges
   * @param params - Optional query parameters for filtering by hotkey, netuid, block ranges, timestamps, and ordering (including subnet_id options)
   * @returns Promise with paginated historical parent-child hotkey relations data
   */
  async getParentChildHotkeyRelationsHistory(params?: GetParentChildHotkeyRelationsHistoryParams): Promise<ApiResponse<ParentChildHotkeyRelationsHistoryResponse>> {
    return this.httpClient.get<ParentChildHotkeyRelationsHistoryResponse>('/api/hotkey/family/history/v1', params);
  }

  /**
   * Get latest validator information including comprehensive metrics, stakes, APR, dominance, and subnet-specific data
   * @param params - Optional query parameters for filtering by hotkey, stake ranges, APR ranges, and ordering
   * @returns Promise with paginated validator data including detailed metrics and subnet dominance information
   */
  async getValidatorLatest(params?: GetValidatorLatestParams): Promise<ApiResponse<ValidatorLatestResponse>> {
    return this.httpClient.get<ValidatorLatestResponse>('/api/validator/latest/v1', params);
  }

  /**
   * Get latest dTao validator information including comprehensive global metrics, multiple ranking systems, and weighted stakes
   * @param params - Optional query parameters for filtering by hotkey, stake ranges, APR ranges, and ordering
   * @returns Promise with paginated dTao validator data including global weighted stakes, alpha stakes, and multiple ranking systems
   */
  async getdTaoValidatorLatest(params?: GetdTaoValidatorLatestParams): Promise<ApiResponse<dTaoValidatorLatestResponse>> {
    return this.httpClient.get<dTaoValidatorLatestResponse>('/api/dtao/validator/latest/v1', params);
  }

  /**
   * Get historical validator information with comprehensive filtering options including block and timestamp ranges
   * @param params - Optional query parameters for filtering by hotkey, block ranges, timestamps, and ordering
   * @returns Promise with paginated historical validator data including detailed metrics and subnet dominance information
   */
  async getValidatorHistory(params?: GetValidatorHistoryParams): Promise<ApiResponse<ValidatorHistoryResponse>> {
    return this.httpClient.get<ValidatorHistoryResponse>('/api/validator/history/v1', params);
  }

  /**
   * Get historical dTao validator information with comprehensive filtering options including block and timestamp ranges
   * @param params - Optional query parameters for filtering by hotkey, block ranges, timestamps, and ordering
   * @returns Promise with paginated historical dTao validator data including global weighted stakes, alpha stakes, and multiple ranking systems
   */
  async getdTaoValidatorHistory(params?: GetdTaoValidatorHistoryParams): Promise<ApiResponse<dTaoValidatorHistoryResponse>> {
    return this.httpClient.get<dTaoValidatorHistoryResponse>('/api/dtao/validator/history/v1', params);
  }
}
