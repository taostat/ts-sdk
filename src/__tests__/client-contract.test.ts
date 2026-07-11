// Phase 3 gate: assert the PUBLIC TaoStatsClient surface (post-flip to generated
// read modules) still satisfies the frozen contract. This is the real
// user-facing guarantee — the client is now wired to generated modules, and
// every frozen method must still exist on client.<module>.<method> and call the
// correct verb+path.

import { FROZEN_CONTRACT, ContractEntry } from './frozen-contract';
import { TaoStatsClient } from '../client/taostats-client';

interface Call {
  verb: string;
  path: string;
}

const SENTINEL = 'PARAM_SENTINEL';
const normalize = (p: string): string =>
  p
    .split('?')[0]
    .split('/')
    .map((s) => (s === SENTINEL ? '{param}' : s))
    .join('/');

// Build a client whose HttpClient is intercepted to record calls instead of
// hitting the network. We reach into the private httpClient and swap its verbs.
function makeClient() {
  const calls: Call[] = [];
  const client = new TaoStatsClient({ apiKey: 'test-key' });
  const rec =
    (verb: string) =>
    (path: string): Promise<unknown> => {
      calls.push({ verb, path });
      return Promise.resolve({
        success: true,
        data: { data: [], pagination: {} },
      });
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const http = (client as any).httpClient;
  http.get = rec('get');
  http.post = rec('post');
  http.put = rec('put');
  http.delete = rec('delete');
  return { client, calls };
}

describe('public TaoStatsClient satisfies frozen contract (Phase 3 flip)', () => {
  describe.each(FROZEN_CONTRACT)(
    'client.$module.$method -> $verb $path',
    (entry: ContractEntry) => {
      it('routes to correct verb + path via the public client', async () => {
        const { client, calls } = makeClient();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mod = (client as any)[entry.module];
        expect(mod).toBeDefined();
        const fn = mod[entry.method];
        expect(typeof fn).toBe('function');

        if (entry.path.includes('{param}')) {
          await fn.call(mod, SENTINEL, {
            address: SENTINEL,
            netuid: 0,
            page: 1,
            block_start: 1,
            block_end: 2,
          });
        } else {
          await fn.call(mod, {
            address: SENTINEL,
            netuid: 0,
            page: 1,
            block_start: 1,
            block_end: 2,
          });
        }

        const match = calls.find(
          (c) => c.verb === entry.verb && normalize(c.path) === entry.path
        );
        expect(match).toBeDefined();
      });
    }
  );
});
