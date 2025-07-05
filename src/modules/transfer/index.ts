import { HttpClient } from '../../client/http-client';
import { transferTao } from './tao';
import { transferAlpha } from './alpha';

// Main transfer functions
export { transferTao } from './tao';
export { transferAlpha } from './alpha';

// Types
export type {
  TaoTransferParams,
  TransferResult,
  AlphaTransferParams,
  BalanceInfo,
  AccountConfig,
  ValidationResult
} from './types';


// Validation utilities
export {
  validateAddress,
  validateAmount,
  checkSufficientBalance,
  taoToRao,
  raoToTao
} from '../../helpers/validation';


export type { SlippageInfo } from './types';

// Import types for the interface
import type { TaoTransferParams, AlphaTransferParams, TransferResult } from './types';
import { ApiManager } from '../../helpers/network/api-manager';

/**
 * Transfer module class that handles TAO and Alpha transfers
 */
export class TransferModule {
  private httpClient: HttpClient;
  private apiManager: ApiManager;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
    this.apiManager = ApiManager.getInstance();
  }

  /**
   * Transfer TAO between accounts
  */
  async tao(params: TaoTransferParams): Promise<TransferResult> {
    const api = await this.apiManager.getApi();
    return transferTao(params, api);
  }

  /**
   * Transfer Alpha tokens between subnets
   */
  async alpha(params: AlphaTransferParams): Promise<TransferResult> {
    const api = await this.apiManager.getApi();
    return transferAlpha(params, api);
  }
} 