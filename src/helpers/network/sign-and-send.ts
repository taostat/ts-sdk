import { SubmittableExtrinsic } from '@polkadot/api/types';
import { ISubmittableResult, IKeyringPair } from '@polkadot/types/types';
import { Index } from '@polkadot/types/interfaces';
import { ApiManager } from './api-manager';

/**
 * Signs and sends a transaction using the provided account and optional nonce.
 * @param tx - The transaction to sign and send.
 * @param account - The account to sign the transaction with.
 * @param _nonce - Optional nonce for the transaction. If not provided, it will be fetched from the API.
 * @returns A promise that resolves with the transaction hash or an error message.
 */
export async function signAndSend(
  tx: SubmittableExtrinsic<'promise', ISubmittableResult>,
  account: IKeyringPair,
  _nonce?: Index,
): Promise<{ hash?: string; error?: string }> {
  return new Promise((resolve) => {
    const apiManager = ApiManager.getInstance();
    apiManager.getApi()
      .then((api) => {
        const noncePromise =
          _nonce === undefined
            ? api.rpc.system.accountNextIndex(account.address)
            : Promise.resolve(_nonce);

        noncePromise
          .then((nonce) => {
            try {
              tx.signAndSend(account, { nonce }, ({ status, events }) => {
                if (status.isInBlock) {
                  events.forEach(({ event }) => {
                    if (api.events.system.ExtrinsicSuccess.is(event)) {
                    } else if (api.events.system.ExtrinsicFailed.is(event)) {
                      console.log('Error:', (event as any)?.data?.toString());
                      resolve({ error: (event as any)?.data?.toString() });
                    }
                  });
                } else if (status.isFinalized) {
                  console.log(`Transaction finalized: ${status.asFinalized}`);
                  resolve({ hash: status.asFinalized.toString() });
                }
              });
            } catch (error) {
              console.log('Transaction error:', error);
              resolve({
                error: error instanceof Error ? error.message : 'Unknown error',
              });
            }
          })
          .catch((error) => {
            console.log('Nonce error:', error);
            resolve({
              error: error instanceof Error ? error.message : 'Unknown error',
            });
          });
      })
      .catch((error) => {
        console.log('API error:', error);
        resolve({
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      });
  });
}
