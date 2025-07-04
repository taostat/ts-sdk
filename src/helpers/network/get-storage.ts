import { Codec } from '@polkadot/types/types';
import { StorageEntries, StorageKeys } from './types';
import { ApiManager } from './api-manager';


export async function getStorage(
  storageKey: string,
  pallet = 'subtensorModule',
  args?: any,
): Promise<Codec | undefined> {
  const apiManager = ApiManager.getInstance();
  const api = await apiManager.getApi();

  if (!api.query[pallet]?.[storageKey]) {
    return undefined;
  }

  if (!args) {
    return api.query[pallet][storageKey]();
  } else if (Array.isArray(args)) {
    return api.query[pallet][storageKey](...args);
  } else {
    return api.query[pallet][storageKey](args);
  }
}

export async function getBlockStorage(
  blockNumber: number,
  storageKey: string,
  pallet = 'subtensorModule',
  args?: any,
): Promise<Codec | undefined> {
  const apiManager = ApiManager.getInstance();
  const apiAt = await apiManager.getApiAtBlock(blockNumber);

  if (!apiAt.query[pallet]?.[storageKey]) {
    return undefined;
  }

  if (!args) {
    return apiAt.query[pallet][storageKey]();
  } else if (Array.isArray(args)) {
    return apiAt.query[pallet][storageKey](...args);
  } else {
    return apiAt.query[pallet][storageKey](args);
  }
}

export async function getBlockStorageEntries(
  blockNumber: number,
  storageKey: string,
  pallet = 'subtensorModule',
  args?: any,
): Promise<StorageEntries> {
  const apiManager = ApiManager.getInstance();
  const apiAt = await apiManager.getApiAtBlock(blockNumber);

  if (!apiAt.query[pallet]?.[storageKey]) {
    return [];
  }

  if (args) {
    return apiAt.query[pallet][storageKey].entries(args);
  }

  return apiAt.query[pallet][storageKey].entries();
}

export async function getBlockStorageEntriesPaged(
  blockNumber: number,
  storageKey: string,
  pallet = 'subtensorModule',
  args?: any[],
): Promise<StorageEntries> {
  const apiManager = ApiManager.getInstance();
  const apiAt = await apiManager.getApiAtBlock(blockNumber);

  if (!apiAt.query[pallet]?.[storageKey]) {
    return [];
  }

  const data: StorageEntries = [];

  let startKey: string | undefined = undefined;
  let done = false;

  while (!done) {
    const entries = (await apiAt.query[pallet][storageKey].entriesPaged({
      args: args || [],
      pageSize: 1000,
      startKey,
    })) as any;

    if (entries.length) {
      data.push(...entries);
      startKey = entries[entries.length - 1][0].toString();
    } else {
      done = true;
    }
  }

  return data;
}

export async function getStorageEntriesPaged(
  storageKey: string,
  pallet = 'subtensorModule',
  args?: any[],
): Promise<StorageEntries> {
  const apiManager = ApiManager.getInstance();
  const api = await apiManager.getApi();

  if (!api.query[pallet]?.[storageKey]) {
    return [];
  }

  const data: StorageEntries = [];

  let startKey: string | undefined = undefined;
  let done = false;

  while (!done) {
    const entries = (await api.query[pallet][storageKey].entriesPaged({
      args: args || [],
      pageSize: 1000,
      startKey,
    })) as any;

    if (entries.length) {
      data.push(...entries);
      startKey = entries[entries.length - 1][0].toString();
    } else {
      done = true;
    }
  }

  return data;
}

export async function getBlockStorageKeysPaged(
  blockNumber: number,
  storageKey: string,
  pallet = 'subtensorModule',
  args?: any[],
): Promise<StorageKeys> {
  const apiManager = ApiManager.getInstance();
  const apiAt = await apiManager.getApiAtBlock(blockNumber);

  if (!apiAt.query[pallet]?.[storageKey]) {
    return [];
  }

  const data: StorageKeys = [];

  let startKey: string | undefined = undefined;
  let done = false;

  while (!done) {
    const keys = (await apiAt.query[pallet][storageKey].keysPaged({
      args: args || [],
      pageSize: 1000,
      startKey,
    })) as any;

    if (keys.length) {
      data.push(...keys);
      startKey = keys[keys.length - 1].toString();
    } else {
      done = true;
    }
  }

  return data;
}
