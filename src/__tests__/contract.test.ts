// Phase 1 safety net: contract-lock test.
//
// For every method in the FROZEN public contract, instantiate its module with a
// mock HttpClient, invoke the method, and assert it calls the correct HTTP verb
// against the correct path (path params normalized to {param}). This locks the
// public REST surface BEFORE the codegen refactor (Phase 2+). If a refactor drops,
// renames, or re-routes any of these methods, this test fails.

import { FROZEN_CONTRACT, ContractEntry } from './frozen-contract';

import { AccountsModule } from '../modules/accounts';
import { ChainModule } from '../modules/chain';
import { DelegationsModule } from '../modules/delegations';
import { LiveModule } from '../modules/live';
import { MetagraphModule } from '../modules/metagraph';
import { SubnetsModule } from '../modules/subnets';
import { TaoPricesModule } from '../modules/tao-prices';
import { TradingViewModule } from '../modules/trading-view';
import { ValidatorsModule } from '../modules/validators';

interface Call {
  verb: string;
  path: string;
  params?: unknown;
}

function makeMockHttp() {
  const calls: Call[] = [];
  const rec = (verb: string) => (path: string, params?: unknown) => {
    calls.push({ verb, path, params });
    return Promise.resolve({ data: { data: [], pagination: {} } });
  };
  const http = {
    get: rec('get'),
    post: rec('post'),
    put: rec('put'),
    delete: rec('delete'),
  };
  return { http, calls };
}

function buildModules(http: any): Record<string, any> {
  return {
    accounts: new AccountsModule(http),
    chain: new ChainModule(http),
    delegations: new DelegationsModule(http),
    live: new LiveModule(http),
    metagraph: new MetagraphModule(http),
    subnets: new SubnetsModule(http),
    taoPrices: new TaoPricesModule(http),
    tradingView: new TradingViewModule(http),
    validators: new ValidatorsModule(http),
  };
}

// Normalize a concrete called path back to a template by collapsing the segments
// that we passed as sentinel path params (and stripping any query string).
const SENTINEL = 'PARAM_SENTINEL';
function normalize(path: string): string {
  const noQuery = path.split('?')[0];
  return noQuery
    .split('/')
    .map((seg) => (seg === SENTINEL ? '{param}' : seg))
    .join('/');
}

describe('frozen public REST contract (Phase 1 lock)', () => {
  it('covers the expected number of methods', () => {
    expect(FROZEN_CONTRACT.length).toBe(74);
  });

  it('every contract module is instantiable', () => {
    const { http } = makeMockHttp();
    const mods = buildModules(http);
    const names = new Set(FROZEN_CONTRACT.map((e) => e.module));
    for (const n of names) {
      expect(mods[n]).toBeDefined();
    }
  });

  describe.each(FROZEN_CONTRACT)(
    '$module.$method -> $verb $path',
    (entry: ContractEntry) => {
      it('calls the correct verb + path', async () => {
        const { http, calls } = makeMockHttp();
        const mods = buildModules(http);
        const mod = mods[entry.module];
        expect(mod).toBeDefined();

        const fn = mod[entry.method];
        expect(typeof fn).toBe('function');

        const paramsObj = {
          address: SENTINEL,
          netuid: 0,
          page: 1,
          block_start: 1,
          block_end: 2,
        };

        // Path-param methods ({param} in the frozen path) take a scalar path arg
        // first; object-param methods take a params object first. Dispatch on the
        // frozen path shape so each method gets the arg type it expects.
        if (entry.path.includes('{param}')) {
          await fn.call(mod, SENTINEL, paramsObj);
        } else {
          await fn.call(mod, paramsObj);
        }

        const match = calls.find(
          (c) => c.verb === entry.verb && normalize(c.path) === entry.path
        );
        expect(match).toBeDefined();
      });
    }
  );
});
