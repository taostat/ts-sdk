import { HttpClient } from '../../client/http-client';
import { unstakeFromRoot, unstakeFromSubnet, estimateUnstakeFeeWithApi } from './unstake';
import { getAccounts } from '../../helpers/network/get-accounts';
import { calculateUnstakeSlippage } from '../../helpers/network/get-slippage';
import { ApiManager } from '../../helpers/network/api-manager';
import { UnstakeResult, UnstakeFromRootParams, UnstakeAlphaParams, UnstakeEstimate } from './types';


/**
 * Unstake module class that handles TAO and Alpha unstaking operations
 */
export class UnstakeModule {
  private httpClient: HttpClient;
  private apiManager: ApiManager;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
    this.apiManager = ApiManager.getInstance();
  }

  /**
   * Unstake TAO from root network (netuid 0)
   */
  async fromRoot(params: UnstakeFromRootParams): Promise<UnstakeResult> {
    const api = await this.apiManager.getApi();
    const accounts = getAccounts();

    return unstakeFromRoot(
      api,
      accounts.user,
      params.hotkey,
      params.amount,
    );
  }

  /**
   * Unstake from a subnet (converts Alpha to TAO with slippage protection)
   */
  async alpha(params: UnstakeAlphaParams): Promise<UnstakeResult> {
    const api = await this.apiManager.getApi();
    const accounts = getAccounts();

    return unstakeFromSubnet(
      api,
      accounts.user,
      params.hotkey,
      params.subnet,
      params.amount,
      params.slippageTolerance,
      params.allowPartialUnstake,
    );
  }

  /**
   * Estimate the total cost of an unstake operation including transaction fee and slippage
   */
  async estimateUnstake(hotkey: string, amount: string, subnet: number = 0): Promise<UnstakeEstimate> {
    const api = await this.apiManager.getApi();

    // Get transaction fee using existing API connection
    const transactionFee = await estimateUnstakeFeeWithApi(api, hotkey, amount, subnet);

    if (subnet === 0) {
      // Root unstaking - no slippage, only transaction fee
      return {
        totalCost: transactionFee,
        expectedReceived: amount, // 1:1 for root unstaking
      };
    } else {
      // Subnet unstaking - calculate slippage cost (Alpha→TAO conversion)
      try {
        const slippageInfo = await calculateUnstakeSlippage(amount, subnet, transactionFee);

        // idealAmount is the ideal TAO we should get, receivedAmount is actual TAO after fees
        const idealTaoValue = parseFloat(slippageInfo.idealAmount); // Ideal TAO value
        const actualTaoBeforeFee = idealTaoValue - (idealTaoValue * (slippageInfo.slippagePercentage / 100)); // TAO after slippage, before fee
        const slippageCost = (idealTaoValue * (slippageInfo.slippagePercentage / 100)).toString();

        const totalCostValue = parseFloat(amount) + parseFloat(transactionFee) + parseFloat(slippageCost);

        return {
          totalCost: totalCostValue.toString(),
          expectedReceived: slippageInfo.receivedAmount, // TAO received after slippage and fees
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error calculating slippage';
        throw new Error(`Cannot calculate slippage for subnet unstaking - unable to provide accurate cost estimate: ${errorMessage}`);
      }
    }
  }
} 