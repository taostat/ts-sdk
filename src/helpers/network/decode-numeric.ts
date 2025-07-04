import BigNumber from './bignumber';
import { Codec } from '@polkadot/types/types';

export function decodeNumeric(raw: Codec): BigNumber {
  const json = raw.toJSON();

  if (typeof json === 'number') {
    return new BigNumber(json);
  }
  if (typeof json === 'bigint') {
    return new BigNumber(json);
  }
  if (typeof json === 'object') {
    const numeric = new BigNumber((json as { bits: string }).bits.toString());
    return numeric;
  }
  if (typeof json === 'string') {
    return new BigNumber(json);
  }
  throw Error(`Expected number, got ${typeof json}`);
}
