import { config } from './config';
import {
  callReadOnlyFunction,
  cvToJSON,
  stringAsciiCV,
} from '@stacks/transactions';

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

