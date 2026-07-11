import { HttpClient } from './http-client';
import { TaoStatsConfig } from '../types/config';
import { ApiResponse } from '../types/common';

// Read-surface modules: GENERATED from the OpenAPI spec (pnpm run codegen).
// Do not hand-edit — regenerate instead. These preserve the existing public
// method names/paths (locked by the frozen-contract test) with types derived
// from the spec, and add the previously-missing endpoints.
import {
  AccountsModule,
  ChainModule,
  DelegationsModule,
  LiveModule,
  MetagraphModule,
  SubnetsModule,
  TaoPricesModule,
  TradingViewModule,
  ValidatorsModule,
  // new additive modules (previously-missing API surfaces)
  OtcModule,
  EvmModule,
  AccountingModule,
} from '../generated/modules';

// Transaction/signing modules: HAND-WRITTEN. These use @polkadot/api for
// signing, not the REST spec, so they are intentionally NOT generated.
import { TransferModule } from '../modules/transfer';
import { StakeModule } from '../modules/stake';
import { UnstakeModule } from '../modules/unstake';
import { MoveModule } from '../modules/move';

import { ApiManager } from '../helpers/network/api-manager';

export class TaoStatsClient {
  private httpClient: HttpClient;

  // Read modules (generated)
  public readonly taoPrices: TaoPricesModule;
  public readonly tradingView: TradingViewModule;
  public readonly delegations: DelegationsModule;
  public readonly accounts: AccountsModule;
  public readonly chain: ChainModule;
  public readonly live: LiveModule;
  public readonly subnets: SubnetsModule;
  public readonly metagraph: MetagraphModule;
  public readonly validators: ValidatorsModule;
  // New additive modules
  public readonly otc: OtcModule;
  public readonly evm: EvmModule;
  public readonly accounting: AccountingModule;

  // Transaction/signing modules (hand-written)
  public readonly transfer: TransferModule;
  public readonly stake: StakeModule;
  public readonly unstake: UnstakeModule;
  public readonly move: MoveModule;

  constructor(config: TaoStatsConfig) {
    this.httpClient = new HttpClient(config);
    ApiManager.getInstance(this.httpClient);

    // Read modules (generated)
    this.taoPrices = new TaoPricesModule(this.httpClient);
    this.tradingView = new TradingViewModule(this.httpClient);
    this.delegations = new DelegationsModule(this.httpClient);
    this.accounts = new AccountsModule(this.httpClient);
    this.chain = new ChainModule(this.httpClient);
    this.live = new LiveModule(this.httpClient);
    this.subnets = new SubnetsModule(this.httpClient);
    this.metagraph = new MetagraphModule(this.httpClient);
    this.validators = new ValidatorsModule(this.httpClient);
    // New additive modules
    this.otc = new OtcModule(this.httpClient);
    this.evm = new EvmModule(this.httpClient);
    this.accounting = new AccountingModule(this.httpClient);

    // Transaction/signing modules (hand-written)
    this.transfer = new TransferModule(this.httpClient);
    this.stake = new StakeModule(this.httpClient);
    this.unstake = new UnstakeModule(this.httpClient);
    this.move = new MoveModule(this.httpClient);
  }

  /**
   * Get health status of the API
   */
  async getHealth(): Promise<
    ApiResponse<{ status: string; timestamp: string }>
  > {
    return this.httpClient.get<{ status: string; timestamp: string }>(
      '/api/status/v1'
    );
  }
}
