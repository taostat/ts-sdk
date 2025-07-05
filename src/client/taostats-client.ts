import { HttpClient } from './http-client';
import { TaoStatsConfig } from '../types/config';
import { ApiResponse } from '../types/common';

// Import modules
import { TaoPricesModule } from '../modules/tao-prices';
import { TradingViewModule } from '../modules/trading-view';
import { DelegationsModule } from '../modules/delegations';
import { AccountsModule } from '../modules/accounts';
// import { TransferModule } from '../modules/transfer';
import { StakeModule } from '../modules/stake';
import { UnstakeModule } from '../modules/unstake';
// import { MoveModule } from '../modules/move';
// import { UtilsModule } from '../modules/utils';
import { ChainModule } from '../modules/chain';
import { LiveModule } from '../modules/live';
import { SubnetsModule } from '../modules/subnets';
import { MetagraphModule } from '../modules/metagraph';
import { ValidatorsModule } from '../modules/validators';
import { ApiManager } from '../helpers/network/api-manager';

export class TaoStatsClient {
  private httpClient: HttpClient;

  // Module instances
  public readonly taoPrices: TaoPricesModule;
  public readonly tradingView: TradingViewModule;
  public readonly delegations: DelegationsModule;
  public readonly accounts: AccountsModule;
  // public readonly transfer: TransferModule;
  public readonly stake: StakeModule;
  public readonly unstake: UnstakeModule;
  // public readonly move: MoveModule;
  // public readonly utils: UtilsModule;
  public readonly chain: ChainModule;
  public readonly live: LiveModule;
  public readonly subnets: SubnetsModule;
  public readonly metagraph: MetagraphModule;
  public readonly validators: ValidatorsModule;
  constructor(config: TaoStatsConfig) {
    this.httpClient = new HttpClient(config);
    ApiManager.getInstance(this.httpClient);

    // Initialize modules
    this.taoPrices = new TaoPricesModule(this.httpClient);
    this.tradingView = new TradingViewModule(this.httpClient);
    this.delegations = new DelegationsModule(this.httpClient);
    this.accounts = new AccountsModule(this.httpClient);
    // this.transfer = new TransferModule(this.httpClient);
    this.stake = new StakeModule(this.httpClient);
    this.unstake = new UnstakeModule(this.httpClient);
    // this.move = new MoveModule(this.httpClient);
    // this.utils = new UtilsModule(this.httpClient);
    this.chain = new ChainModule(this.httpClient);
    this.live = new LiveModule(this.httpClient);
    this.subnets = new SubnetsModule(this.httpClient);
    this.metagraph = new MetagraphModule(this.httpClient);
    this.validators = new ValidatorsModule(this.httpClient);
  }

  /**
   * Get health status of the API
   */
  async getHealth(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.httpClient.get<{ status: string; timestamp: string }>('/api/status/v1');
  }
} 