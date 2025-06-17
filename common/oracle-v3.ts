import { config } from "./config";
import { cheetah } from "@nieldeckx/stacks-cheetah";
import {
  stringAsciiCV,
} from "@stacks/transactions";

export async function fetchPrice(symbol: string): Promise<boolean> {
  const result = await cheetah.callReadOnlyFunction({
    contractAddress: config.oracleAddress as string,
    contractName: "arkadiko-oracle-v3-0",
    functionName: "fetch-price",
    functionArgs: [stringAsciiCV(symbol)],
    senderAddress: config.oracleAddress as string,
  });
  return result;
}
