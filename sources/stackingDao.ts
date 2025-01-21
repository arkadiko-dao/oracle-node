import { config } from "@common/config";
import {
  callReadOnlyFunction,
  cvToJSON,
  contractPrincipalCV,
} from "@stacks/transactions";

export async function getStxPerStStx(): Promise<any> {
  const call = await callReadOnlyFunction({
    contractAddress: "SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG",
    contractName: "data-core-v2",
    functionName: "get-stx-per-ststx",
    functionArgs: [
      contractPrincipalCV(
        "SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG",
        "reserve-v1"
      ),
    ],
    senderAddress: config.managerAddress as string,
    network: config.network,
  });
  const result = cvToJSON(call).value.value / 1000000;
  return result;
}

export async function getStStxPrice(stxPrice: number): Promise<number> {
  const ratio = await getStxPerStStx();
  return ratio * stxPrice;
}
