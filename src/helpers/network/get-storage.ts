import { Codec } from '@polkadot/types/types';
import { StorageEntries, StorageKeys } from './types';
import { ApiManager } from './api-manager';
import { raoToTao } from '../validation';
import { getAlphaBalance } from './get-balance';


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

/**
 * Checks if a subnet exists
 */
export async function checkSubnetExists(netuid: number): Promise<boolean> {
  try {
    const result = await getStorage('networksAdded', 'subtensorModule', netuid);
    return result ? result.toString() === 'true' : false;
  } catch (error) {
    console.error(`Error checking subnet ${netuid} existence:`, error);
    return false;
  }
}

/**
 * Gets stake balance for a specific coldkey-hotkey pair in a subnet
 */
export async function getStakeBalance(
  coldkey: string,
  hotkey: string,
  netuid: number,
): Promise<string> {
  try {
    // Use the existing getAlphaBalance function which knows the correct storage pattern
    const balanceRaw = await getAlphaBalance(coldkey, hotkey, netuid);
    return raoToTao(balanceRaw.toString());
  } catch (error) {
    console.error(`Error getting stake balance for ${coldkey}/${hotkey} in subnet ${netuid}:`, error);
    return '0';
  }
}

/**
 * Gets subnet information including pool data for slippage calculations
 */
export async function getSubnetInfo(netuid: number, rpcUrl?: string): Promise<{
  taoIn: string;
  alphaIn: string;
  isDynamic: boolean;
  price: string;
} | null> {
  try {
    // Try to get subnet pool information
    // These storage keys might need adjustment based on actual Subtensor implementation
    const [taoReserve, alphaReserve, subnetInfo] = await Promise.all([
      getStorage('taoReserves', 'subtensorModule', netuid),
      getStorage('alphaReserves', 'subtensorModule', netuid),
      getStorage('subnetInfo', 'subtensorModule', netuid)
    ]);

    if (!taoReserve || !alphaReserve) {
      // Try alternative storage patterns
      const poolData = await getStorage('poolData', 'subtensorModule', netuid);
      if (poolData) {
        // Parse pool data structure
        const poolInfo = JSON.parse(poolData.toString());
        return {
          taoIn: raoToTao(poolInfo.tao_reserve || '0'),
          alphaIn: raoToTao(poolInfo.alpha_reserve || '0'),
          isDynamic: poolInfo.is_dynamic || false,
          price: poolInfo.price || '1'
        };
      }
      return null;
    }

    return {
      taoIn: raoToTao(taoReserve.toString()),
      alphaIn: raoToTao(alphaReserve.toString()),
      isDynamic: true, // Assume dynamic for now
      price: '1' // Will be calculated from reserves
    };
  } catch (error) {
    console.error(`Error getting subnet info for ${netuid}:`, error);
    return null;
  }
}

