import { StorageKey } from '@polkadot/types';
import { AnyTuple, Codec } from '@polkadot/types/types';
import BigNumber from './bignumber';

export type StorageEntry = [StorageKey<AnyTuple>, Codec];
export type StorageEntries = StorageEntry[];
export type StorageKeys = StorageKey<AnyTuple>[];

export type PoolPrice = {
  price: BigNumber;
  alpha: BigNumber;
  tao: BigNumber;
  alphaEmission: BigNumber;
  taoEmission: BigNumber;
};
