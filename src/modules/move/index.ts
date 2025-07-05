import { HttpClient } from '../../client/http-client';
import { moveStake } from './move';
import { getAccounts } from '../../helpers/network/get-accounts';
import { ApiManager } from '../../helpers/network/api-manager';
import { MoveAlphaParams, MoveParams, MoveResult } from './types';


/**
 * Move module class that handles stake movement between hotkeys and subnets
 */
export class MoveModule {
  private httpClient: HttpClient;
  private apiManager: ApiManager;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
    this.apiManager = ApiManager.getInstance();
  }

  /**
   * Move staked Alpha between hotkeys while keeping the same coldkey ownership
   * Supports both same-subnet and cross-subnet moves with slippage protection
   */
  async stake(params: MoveAlphaParams): Promise<MoveResult> {
    const api = await this.apiManager.getApi();
    const accounts = getAccounts();

    return moveStake(api, accounts.user, {
      originHotkey: params.originHotkey,
      destinationHotkey: params.destinationHotkey,
      originNetuid: params.originNetuid,
      destinationNetuid: params.destinationNetuid,
      amount: params.amount,
      maxSlippageTolerance: params.maxSlippageTolerance,
      disableSlippageProtection: params.disableSlippageProtection,
    });
  }
} 