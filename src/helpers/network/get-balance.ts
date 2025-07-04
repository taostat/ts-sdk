import BigNumber from './bignumber';
import { decodeNumeric } from './decode-numeric';
import { getBlockStorage, getStorage } from './get-storage';


export async function getFreeBalance(coldkey: string) {
  const codec = await getStorage('account', 'system', [coldkey]);

  if (!codec) {
    return new BigNumber(0);
  }

  const data = codec.toJSON() as unknown as { data: { free: bigint } };

  return new BigNumber(data.data.free.toString());
}

export async function getAlphaBalance(
  coldkey: string,
  hotkey: string,
  netuid: number,
) {
  const [alphaCodec, totalHotkeyAlphaCodec, totalHotkeySharesCodec] =
    await Promise.all([
      getStorage('alpha', 'subtensorModule', [hotkey, coldkey, netuid]),
      getStorage('totalHotkeyAlpha', 'subtensorModule', [hotkey, netuid]),
      getStorage('totalHotkeyShares', 'subtensorModule', [hotkey, netuid]),
    ]);

  if (!alphaCodec || !totalHotkeyAlphaCodec || !totalHotkeySharesCodec) {
    return new BigNumber(0);
  }

  const shares = decodeNumeric(alphaCodec);
  const totalHotkeyAlpha = decodeNumeric(totalHotkeyAlphaCodec);
  const totalHotkeyShares = decodeNumeric(totalHotkeySharesCodec);

  if (
    shares.isZero() ||
    totalHotkeyShares.isZero() ||
    totalHotkeyAlpha.isZero()
  ) {
    return new BigNumber(0);
  }

  const proportion = shares.div(totalHotkeyShares);
  const balance = totalHotkeyAlpha
    .times(proportion)
    .integerValue(BigNumber.ROUND_FLOOR);

  return balance;
}

export async function getAlphaBalanceAtBlock(
  coldkey: string,
  hotkey: string,
  netuid: number,
  block: number,
) {
  const [alphaCodec, totalHotkeyAlphaCodec, totalHotkeySharesCodec] =
    await Promise.all([
      getBlockStorage(block, 'alpha', 'subtensorModule', [
        hotkey,
        coldkey,
        netuid,
      ]),
      getBlockStorage(block, 'totalHotkeyAlpha', 'subtensorModule', [
        hotkey,
        netuid,
      ]),
      getBlockStorage(block, 'totalHotkeyShares', 'subtensorModule', [
        hotkey,
        netuid,
      ]),
    ]);

  if (!alphaCodec || !totalHotkeyAlphaCodec || !totalHotkeySharesCodec) {
    return new BigNumber(0);
  }

  const shares = decodeNumeric(alphaCodec);
  const totalHotkeyAlpha = decodeNumeric(totalHotkeyAlphaCodec);
  const totalHotkeyShares = decodeNumeric(totalHotkeySharesCodec);

  if (
    shares.isZero() ||
    totalHotkeyShares.isZero() ||
    totalHotkeyAlpha.isZero()
  ) {
    return new BigNumber(0);
  }

  const proportion = shares.div(totalHotkeyShares);
  const balance = totalHotkeyAlpha
    .times(proportion)
    .integerValue(BigNumber.ROUND_FLOOR);

  return balance;
}
