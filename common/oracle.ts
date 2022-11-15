import { config } from './config';
import {
  AnchorMode,
  broadcastTransaction,
  bufferCV,
  callReadOnlyFunction,
  cvToJSON,
  getNonce,
  listCV,
  makeContractCall,
  stringAsciiCV,
  uintCV
} from '@stacks/transactions';
import { PriceObject } from './price';

export async function isTrustedOracle(publicKey: string): Promise<boolean> {
  const call = await callReadOnlyFunction({
    contractAddress: config.arkadikoAddress as string,
    contractName: "arkadiko-oracle-v2-1",
    functionName: "is-trusted-oracle",
    functionArgs: [
      bufferCV(Buffer.from(publicKey, "hex"))
    ],
    senderAddress: config.arkadikoAddress as string,
    network: config.network,
  });
  const result = cvToJSON(call).value;
  return result;
}

export async function getSignableMessage(price: PriceObject): Promise<string> {
  const call = await callReadOnlyFunction({
    contractAddress: config.arkadikoAddress as string,
    contractName: "arkadiko-oracle-v2-1",
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
    contractName: "arkadiko-oracle-v2-1",
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
    contractName: "arkadiko-oracle-v2-1",
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
    contractName: "arkadiko-oracle-v2-1",
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
    contractName: "arkadiko-oracle-v2-1",
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
  const nonce = await getNonce(config.managerAddress)

  const txOptions = {
    contractAddress: config.arkadikoAddress as string,
    contractName: "arkadiko-oracle-v2-1",
    functionName: "update-price-multi",
    functionArgs: [
      uintCV(price.block),
      uintCV(price.tokenId),
      uintCV(price.price),
      uintCV(price.decimals),
      listCV(signatures.map(signature => bufferCV(Buffer.from(signature, "hex")))),
    ],
    senderKey: config.managerKey,
    nonce: nonce,
    postConditionMode: 1,
    fee: (0.001 * 1000000),
    network: config.network,
    anchorMode: AnchorMode.Any
  };

  const transaction = await makeContractCall(txOptions);
  const result = await broadcastTransaction(transaction, config.network);
  return result;
}
