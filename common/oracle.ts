import { config } from './config';
import {
  AnchorMode,
  broadcastTransaction,
  bufferCV,
  callReadOnlyFunction,
  cvToJSON,
  listCV,
  makeContractCall,
  stringAsciiCV,
  uintCV
} from '@stacks/transactions';
import { PriceObject } from './price';
import { getNonce } from './stacks';

export async function isTrustedOracle(publicKey: string): Promise<boolean> {
  const call = await callReadOnlyFunction({
    contractAddress: config.oracleAddress as string,
    contractName: config.oracleContractName,
    functionName: "is-trusted-oracle",
    functionArgs: [
      bufferCV(Buffer.from(publicKey, "hex"))
    ],
    senderAddress: config.oracleAddress as string,
    network: config.network,
  });
  const result = cvToJSON(call).value;
  return result;
}

export async function getSignableMessage(price: PriceObject): Promise<string> {
  const call = await callReadOnlyFunction({
    contractAddress: config.oracleAddress as string,
    contractName: config.oracleContractName,
    functionName: "get-signable-message-hash",
    functionArgs: [
      uintCV(price.block),
      uintCV(price.tokenId),
      uintCV(price.price),
      uintCV(price.decimals),
    ],
    senderAddress: config.oracleAddress as string,
    network: config.network,
  });
  const result = cvToJSON(call).value;
  return result;
}

export async function getTokenId(symbol: string): Promise<any> {
  const call = await callReadOnlyFunction({
    contractAddress: config.oracleAddress as string,
    contractName: config.oracleContractName,
    functionName: "get-token-id-from-name",
    functionArgs: [
      stringAsciiCV(symbol)
    ],
    senderAddress: config.oracleAddress as string,
    network: config.network,
  });
  const result = cvToJSON(call).value;
  return result;
}

export async function getTokenNames(tokenId: number): Promise<any> {
  const call = await callReadOnlyFunction({
    contractAddress: config.oracleAddress as string,
    contractName: config.oracleContractName,
    functionName: "get-token-names-from-id",
    functionArgs: [
      uintCV(tokenId),
    ],
    senderAddress: config.oracleAddress as string,
    network: config.network,
  });
  const result = cvToJSON(call).value;
  return result;
}

export async function getMinimumSigners(): Promise<any> {
  const call = await callReadOnlyFunction({
    contractAddress: config.oracleAddress as string,
    contractName: config.oracleContractName,
    functionName: "get-minimum-valid-signers",
    functionArgs: [],
    senderAddress: config.oracleAddress as string,
    network: config.network,
  });
  const result = cvToJSON(call).value;
  return result;
}

export async function getPriceInfo(symbol: string): Promise<any> {
  const call = await callReadOnlyFunction({
    contractAddress: config.oracleAddress as string,
    contractName: config.oracleContractName,
    functionName: "get-price",
    functionArgs: [
      stringAsciiCV(symbol)
    ],
    senderAddress: config.oracleAddress as string,
    network: config.network,
  });
  const result = cvToJSON(call).value;
  return result;
}

export async function pushPriceInfo(price: PriceObject, signatures: string[]): Promise<any> {
  const nonce = await getNonce(config.managerAddress)
  return await pushPriceInfoHelper(price, signatures, nonce);
}

async function pushPriceInfoHelper(price: PriceObject, signatures: string[], nonce: number): Promise<any> {
  const txOptions = {
    contractAddress: config.oracleAddress as string,
    contractName: config.oracleContractName,
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
    fee: (0.5 * 1000000),
    network: config.network,
    anchorMode: AnchorMode.Any
  };

  const transaction = await makeContractCall(txOptions);
  const result = await broadcastTransaction(transaction, config.network);

  // Increase nonce if needed
  if ((result.reason as string) == "ConflictingNonceInMempool" || (result.reason as string) == "BadNonce") {
    return await pushPriceInfoHelper(price, signatures, nonce+1);
  }

  return result;
}
