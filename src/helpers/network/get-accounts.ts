import { Keyring } from '@polkadot/api';
import type { IKeyringPair } from '@polkadot/types/types';
import { ApiManager } from './api-manager';
import { hexToU8a } from '@polkadot/util';

interface AccountConfig {
  seed?: string;  // Mnemonic seed phrase
  privateKey?: string;  // Raw private key
  address?: string;  // Optional: if we only have the address
  type?: 'sr25519'  // Optional: Key type (default: sr25519)
}

interface AccountPair {
  user: IKeyringPair;
  proxy?: IKeyringPair;  // Make proxy optional
}

function createAccount(config: AccountConfig): IKeyringPair {
  const keyring = new Keyring({ type: config.type || 'sr25519' });

  if (!config.seed && !config.privateKey) {
    throw new Error('Either seed phrase or private key must be provided');
  }

  try {
    if (config.seed) {
      return keyring.addFromUri(config.seed);
    } else if (config.privateKey) {
      return keyring.addFromSeed(hexToU8a(config.privateKey));
    }
    throw new Error('Invalid account configuration');
  } catch (error) {
    throw new Error(`Failed to create account: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function getAccounts(config?: {
  user?: AccountConfig;
  proxy?: AccountConfig;
}): AccountPair {

  const clientConfig = ApiManager.getInstance().getAccountConfiguration();

  const userConfig: AccountConfig = config?.user || {
    seed: clientConfig.seed,
    privateKey: clientConfig.privateKey,
    type: 'sr25519'
  };

  const proxyConfig: AccountConfig | undefined = config?.proxy ||
    (typeof process !== 'undefined' && process.env?.TAO_TRANSFER_PROXY_SEED ? {
      seed: process.env.TAO_TRANSFER_PROXY_SEED,
      type: 'sr25519'
    } : undefined);

  const user = createAccount(userConfig);
  console.log(`Using user account: ${user.address}`);

  const result: AccountPair = { user };

  if (proxyConfig) {
    result.proxy = createAccount(proxyConfig);
    console.log(`Using proxy account: ${result.proxy.address}`);
  }

  return result;
}
