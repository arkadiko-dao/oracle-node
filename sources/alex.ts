import { config } from "@common/config";
import {
  callReadOnlyFunction,
  cvToJSON,
  contractPrincipalCV,
  uintCV,
} from "@stacks/transactions";

export async function getWelshPrice(stxPrice: number): Promise<number> {
  const call = await callReadOnlyFunction({
    contractAddress: config.alexAddress as string,
    contractName: "amm-pool-v2-01",
    functionName: "get-price",
    functionArgs: [
      contractPrincipalCV(config.alexAddress, "token-wstx-v2"),
      contractPrincipalCV(config.alexAddress, "token-wcorgi"),
      uintCV(100000000),
    ],
    senderAddress: config.managerAddress as string,
    network: config.network,
  });
  const result = cvToJSON(call).value.value / 100000000;
  return stxPrice / result;
}
