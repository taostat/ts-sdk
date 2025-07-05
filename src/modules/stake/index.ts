import { HttpClient } from '../../client/http-client';
import { stakeToRoot, stakeToSubnet, estimateStakeFeeWithApi } from './stake';
import { StakeToRootParams, StakeAlphaParams, StakeEstimate, StakeResult } from './types';
import { getAccounts } from '../../helpers/network/get-accounts';
import { calculateStakeSlippage } from '../../helpers/network/get-slippage';
import { ApiManager } from '../../helpers/network/api-manager';


/**
 * Stake module class that handles TAO and Alpha staking operations
 */
export class StakeModule {
  private httpClient: HttpClient;
  private apiManager: ApiManager;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
    this.apiManager = ApiManager.getInstance();
  }

  /**
   * Stake TAO to a validator/miner on root network (netuid 0)
   */
  async toRoot(params: StakeToRootParams): Promise<StakeResult> {
    const api = await this.apiManager.getApi();
    const accounts = getAccounts();

    return stakeToRoot(
      api,
      accounts.user,
      params.hotkey,
      params.amount,
    );
  }

  /**
   * Stake TAO to a subnet (converts to Alpha with slippage protection)
   */
  async alpha(params: StakeAlphaParams): Promise<StakeResult> {
    const api = await this.apiManager.getApi();
    const accounts = getAccounts();

    return stakeToSubnet(
      api,
      accounts.user,
      params.hotkey,
      params.subnet,
      params.amount,
      params.slippageTolerance,
      params.allowPartialStake,
    );
  }

  /**
   * Estimate the total cost of a stake operation including transaction fee and slippage
   */
  async estimateStake(hotkey: string, amount: string, subnet: number = 0): Promise<StakeEstimate> {
    const api = await this.apiManager.getApi();

    // Get transaction fee using existing API connection
    const transactionFee = await estimateStakeFeeWithApi(api, hotkey, amount, subnet);


    if (subnet === 0) {
      // Root staking - no slippage, only transaction fee
      return {
        totalCost: (parseFloat(transactionFee) + parseFloat(amount)).toString(),
        expectedReceived: amount, // 1:1 for root staking
      };
    } else {
      // Subnet staking - calculate slippage cost (TAO→Alpha conversion)
      try {
        const slippageInfo = await calculateStakeSlippage(amount, subnet, transactionFee);

        // idealAmount and receivedAmount are both in TAO-equivalent terms from slippage calculation
        const idealTaoValue = parseFloat(slippageInfo.idealAmount); // TAO input
        const actualTaoValue = parseFloat(slippageInfo.idealAmount); // Same as ideal for staking (we put in TAO, get Alpha)
        const slippageCost = (idealTaoValue * (slippageInfo.slippagePercentage / 100)).toString();

        // Total cost = amount being staked + transaction fee + slippage cost
        const totalCostValue = parseFloat(amount) + parseFloat(transactionFee) + parseFloat(slippageCost);

        return {
          totalCost: totalCostValue.toString(),
          expectedReceived: slippageInfo.receivedAmount, // Alpha received
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error calculating slippage';
        throw new Error(`Cannot calculate slippage for subnet staking - unable to provide accurate cost estimate: ${errorMessage}`);
      }
    }
  }
} 