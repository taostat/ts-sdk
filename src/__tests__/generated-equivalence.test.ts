// Phase 2 equivalence gate: the GENERATED modules must satisfy the frozen
// public contract (same 74 methods -> verb+path as the hand-written modules).
// This proves codegen preserves the public API before we flip to it (Phase 3).

import { FROZEN_CONTRACT, ContractEntry } from './frozen-contract';
import * as generated from '../generated/modules';

interface Call {
  verb: string;
  path: string;
}

function makeMockHttp() {
  const calls: Call[] = [];
  const rec = (verb: string) => (path: string) => {
    calls.push({ verb, path });
    return Promise.resolve({ data: { data: [], pagination: {} } });
  };
  return {
    http: {
      get: rec('get'),
      post: rec('post'),
      put: rec('put'),
      delete: rec('delete'),
    },
    calls,
  };
}

const SENTINEL = 'PARAM_SENTINEL';
const normalize = (p: string) =>
  p
    .split('?')[0]
    .split('/')
    .map((s) => (s === SENTINEL ? '{param}' : s))
    .join('/');

function classFor(module: string): any {
  const name = module.charAt(0).toUpperCase() + module.slice(1) + 'Module';
  return (generated as any)[name];
}

describe('generated modules satisfy frozen contract (Phase 2 equivalence)', () => {
  describe.each(FROZEN_CONTRACT)(
    '$module.$method -> $verb $path',
    (entry: ContractEntry) => {
      it('generated method calls correct verb + path', async () => {
        const Cls = classFor(entry.module);
        expect(Cls).toBeDefined();
        const { http, calls } = makeMockHttp();
        const inst = new Cls(http);
        const fn = inst[entry.method];
        expect(typeof fn).toBe('function');

        if (entry.path.includes('{param}')) {
          await fn.call(inst, SENTINEL, {
            address: SENTINEL,
            netuid: 0,
            page: 1,
            block_start: 1,
            block_end: 2,
          });
        } else {
          await fn.call(inst, {
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
