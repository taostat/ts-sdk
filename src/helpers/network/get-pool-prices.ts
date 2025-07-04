import BigNumber from './bignumber';
import { getStorage, getStorageEntriesPaged } from './get-storage';
import { PoolPrice } from './types';

/**
 * These functions return predicted prices at the point of execution in the next block, which is after run_coinbase's emission distribution.
 */
export async function getPoolPrice(netuid: number): Promise<PoolPrice> {
  const [
    subnetAlphaInCodec,
    subnetTaoCodec,
    subnetAlphaInEmissionCodec,
    subnetTaoInEmissionCodec,
  ] = await Promise.all([
    getStorage('subnetAlphaIn', 'subtensorModule', [netuid]),
    getStorage('subnetTAO', 'subtensorModule', [netuid]),
    getStorage('subnetAlphaInEmission', 'subtensorModule', [netuid]),
    getStorage('subnetTaoInEmission', 'subtensorModule', [netuid]),
  ]);

  const alpha = new BigNumber(subnetAlphaInCodec?.toJSON() as number);
  const tao = new BigNumber(subnetTaoCodec?.toJSON() as number);
  const alphaEmission = new BigNumber(
    subnetAlphaInEmissionCodec?.toJSON() as number,
  );
  const taoEmission = new BigNumber(
    subnetTaoInEmissionCodec?.toJSON() as number,
  );
  const price = getPrice(
    netuid,
    tao.plus(taoEmission),
    alpha.plus(alphaEmission),
  );

  return {
    price,
    alpha,
    tao,
    alphaEmission,
    taoEmission,
  };
}

export async function getPoolPrices(): Promise<Map<number, PoolPrice>> {
  const [
    subnetAlphaInEntries,
    subnetTaoEntries,
    subnetAlphaInEmissionEntries,
    subnetTaoInEmissionEntries,
  ] = await Promise.all([
    getStorageEntriesPaged('subnetAlphaIn', 'subtensorModule'),
    getStorageEntriesPaged('subnetTAO', 'subtensorModule'),
    getStorageEntriesPaged('subnetAlphaInEmission', 'subtensorModule'),
    getStorageEntriesPaged('subnetTaoInEmission', 'subtensorModule'),
  ]);

  const alphaMap = subnetAlphaInEntries.reduce((acc, [key, value]) => {
    const netuid = key.args[0].toJSON() as number;
    const alpha = new BigNumber(value.toJSON() as number);
    acc.set(netuid, alpha);
    return acc;
  }, new Map<number, BigNumber>());

  const taoMap = subnetTaoEntries.reduce((acc, [key, value]) => {
    const netuid = key.args[0].toJSON() as number;
    const tao = new BigNumber(value.toJSON() as number);
    acc.set(netuid, tao);
    return acc;
  }, new Map<number, BigNumber>());
  const prices = new Map<number, PoolPrice>();

  const alphaEmissionMap = subnetAlphaInEmissionEntries.reduce(
    (acc, [key, value]) => {
      const netuid = key.args[0].toJSON() as number;
      const alphaEmission = new BigNumber(value.toJSON() as number);
      acc.set(netuid, alphaEmission);
      return acc;
    },
    new Map<number, BigNumber>(),
  );

  const taoEmissionMap = subnetTaoInEmissionEntries.reduce(
    (acc, [key, value]) => {
      const netuid = key.args[0].toJSON() as number;
      const taoEmission = new BigNumber(value.toJSON() as number);
      acc.set(netuid, taoEmission);
      return acc;
    },
    new Map<number, BigNumber>(),
  );

  for (const [netuid, alpha] of alphaMap.entries()) {
    const tao = taoMap.get(netuid);
    const alphaEmission = alphaEmissionMap.get(netuid) || new BigNumber(0);
    const taoEmission = taoEmissionMap.get(netuid) || new BigNumber(0);
    if (tao) {
      const price = getPrice(
        netuid,
        tao.plus(taoEmission),
        alpha.plus(alphaEmission),
      );
      prices.set(netuid, {
        price,
        alpha,
        tao,
        alphaEmission,
        taoEmission,
      });
    }
  }

  return prices;
}

function getPrice(netuid: number, tao: BigNumber, alpha: BigNumber) {
  if (netuid === 0) return new BigNumber(1);

  if (alpha.isZero()) return new BigNumber(0);

  return new BigNumber(tao).div(alpha);
}
