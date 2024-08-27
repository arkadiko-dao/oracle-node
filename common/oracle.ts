import { config } from "./config";
import { cheetah } from "@nieldeckx/stacks-cheetah";
import {
  AnchorMode,
  broadcastTransaction,
  bufferCV,
  callReadOnlyFunction,
  cvToJSON,
  listCV,
  makeContractCall,
  stringAsciiCV,
  uintCV,
} from "@stacks/transactions";
import { PriceObject } from "./price";
import { TransactionFeePriority } from "@nieldeckx/stacks-cheetah/dist/src/write";

export async function isTrustedOracle(publicKey: string): Promise<boolean> {
  const result = await cheetah.callReadOnlyFunction({
    contractAddress: config.oracleAddress as string,
    contractName: config.oracleContractName,
    functionName: "is-trusted-oracle",
    functionArgs: [bufferCV(Buffer.from(publicKey, "hex"))],
    senderAddress: config.oracleAddress as string,
  });
  return result;
}

export async function getSignableMessage(price: PriceObject): Promise<string> {
  const result = await cheetah.callReadOnlyFunction({
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
  });
  return result;
}

export async function getTokenId(symbol: string): Promise<any> {
  const result = await cheetah.callReadOnlyFunction({
    contractAddress: config.oracleAddress as string,
    contractName: config.oracleContractName,
    functionName: "get-token-id-from-name",
    functionArgs: [stringAsciiCV(symbol)],
    senderAddress: config.oracleAddress as string,
  });
  return result;
}

export async function getTokenNames(tokenId: number): Promise<any> {
  const result = await cheetah.callReadOnlyFunction({
    contractAddress: config.oracleAddress as string,
    contractName: config.oracleContractName,
    functionName: "get-token-names-from-id",
    functionArgs: [uintCV(tokenId)],
    senderAddress: config.oracleAddress as string,
  });
  return result;
}

export async function getMinimumSigners(): Promise<any> {
  const result = await cheetah.callReadOnlyFunction({
    contractAddress: config.oracleAddress as string,
    contractName: config.oracleContractName,
    functionName: "get-minimum-valid-signers",
    functionArgs: [],
    senderAddress: config.oracleAddress as string,
  });
  return result;
}

export async function getPriceInfo(symbol: string): Promise<any> {
  const result = await cheetah.callReadOnlyFunction({
    contractAddress: config.oracleAddress as string,
    contractName: config.oracleContractName,
    functionName: "get-price",
    functionArgs: [stringAsciiCV(symbol)],
    senderAddress: config.oracleAddress as string,
  });
  return result;
}

export async function pushPriceInfo(
  price: PriceObject,
  signatures: string[],
  nonce: number | undefined,
  fee: number | undefined
): Promise<any> {
  const txOptions: any = {
    contractAddress: config.oracleAddress as string,
    contractName: config.oracleContractName,
    functionName: "update-price-multi",
    functionArgs: [
      uintCV(price.block),
      uintCV(price.tokenId),
      uintCV(price.price),
      uintCV(price.decimals),
      listCV(
        signatures.map((signature) => bufferCV(Buffer.from(signature, "hex")))
      ),
    ],

    senderAddress: config.managerAddress,
    senderKey: config.managerKey,
  };

  if (nonce) {
    txOptions.nonce = nonce;
  } else {
    txOptions.nonce = await cheetah.getNonce(config.managerAddress);
  }

  if (fee) {
    txOptions.fee = Math.round(fee);
  } else {
    txOptions.fee = await cheetah.getFee(TransactionFeePriority.medium);
  }

  return await cheetah.broadcastTransaction(txOptions);
}
