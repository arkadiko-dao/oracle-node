import { config } from './config';
import {
  callReadOnlyFunction,
  cvToJSON,
  stringAsciiCV,
  uintCV
} from '@stacks/transactions';
import { PriceObject } from './price';

export async function getSignableMessage(price: PriceObject): Promise<string> {
  const call = await callReadOnlyFunction({
    contractAddress: config.arkadikoAddress as string,
    contractName: "arkadiko-oracle-v1-1",
    functionName: "get-signable-message-hash",
    functionArgs: [
      uintCV(price.block),
      uintCV(price.tokenId),
      uintCV(price.price),
      uintCV(price.decimals),
    ],
    senderAddress: config.arkadikoAddress as string,
    network: config.network,
  });
  const result = cvToJSON(call).value;
  return result;
}

export async function getTokenId(symbol: string): Promise<any> {
  const call = await callReadOnlyFunction({
    contractAddress: config.arkadikoAddress as string,
    contractName: "arkadiko-oracle-v1-1",
    functionName: "get-token-id-from-name",
    functionArgs: [
      stringAsciiCV(symbol)
    ],
    senderAddress: config.arkadikoAddress as string,
    network: config.network,
  });
  const result = cvToJSON(call).value;
  return result;
}

export async function getTokenNames(tokenId: number): Promise<any> {
  const call = await callReadOnlyFunction({
    contractAddress: config.arkadikoAddress as string,
    contractName: "arkadiko-oracle-v1-1",
    functionName: "get-token-names-from-id",
    functionArgs: [
      uintCV(tokenId),
    ],
    senderAddress: config.arkadikoAddress as string,
    network: config.network,
  });
  const result = cvToJSON(call).value;
  return result;
}

export async function getMinimumSigners(): Promise<any> {
  const call = await callReadOnlyFunction({
    contractAddress: config.arkadikoAddress as string,
    contractName: "arkadiko-oracle-v1-1",
    functionName: "get-minimum-valid-signers",
    functionArgs: [],
    senderAddress: config.arkadikoAddress as string,
    network: config.network,
  });
  const result = cvToJSON(call).value;
  return result;
}

export async function getPriceInfo(symbol: string): Promise<any> {
  const call = await callReadOnlyFunction({
    contractAddress: config.arkadikoAddress as string,
    contractName: "arkadiko-oracle-v1-1",
    functionName: "get-price",
    functionArgs: [
      stringAsciiCV(symbol)
    ],
    senderAddress: config.arkadikoAddress as string,
    network: config.network,
  });
  const result = cvToJSON(call).value;
  return result;
}

export async function pushPriceInfo(price: PriceObject, signatures: string[]): Promise<any> {

}
