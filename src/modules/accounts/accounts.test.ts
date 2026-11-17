import { HttpClient } from '../../client/http-client';
import { AccountsModule } from './accounts';

describe('AccountsModule NEW API routes', () => {
  let get: jest.Mock;
  let module: AccountsModule;

  beforeEach(() => {
    get = jest.fn().mockResolvedValue({ success: true, data: { data: [], pagination: {} } });
    module = new AccountsModule({ get } as unknown as HttpClient);
  });

  test('uses transfers v1 with plain SS58 fields and translates legacy sort options', async () => {
    await module.getTransfers({
      to: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
      block_start: 100,
      limit: 50,
      order: 'amount_desc',
      startDate: 'ignored',
    });

    expect(get).toHaveBeenCalledWith('/v1/transfers', {
      to: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
      block_start: 100,
      limit: 50,
      order_by: 'amount',
      order_dir: 'desc',
    });
  });

  test('uses pending coldkey swaps v1 with no query parameters', async () => {
    await module.getPendingColdkeySwap();

    expect(get).toHaveBeenCalledWith('/v1/accounts/pending-coldkey-swaps');
  });
});
