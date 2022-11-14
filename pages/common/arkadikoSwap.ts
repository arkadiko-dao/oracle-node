import { setup } from './setup';
import {
  callReadOnlyFunction,
  cvToJSON,
  contractPrincipalCV
} from '@stacks/transactions';

export async function getPairDetails(tokenX: string, tokenY: string): Promise<any> {
  const call = await callReadOnlyFunction({
    contractAddress: setup.arkadikoAddress as string,
    contractName: "arkadiko-swap-v2-1",
    functionName: "get-pair-details",
    functionArgs: [
      contractPrincipalCV(tokenX.split(".")[0], tokenX.split(".")[1]),
      contractPrincipalCV(tokenY.split(".")[0], tokenY.split(".")[1])
    ],
    senderAddress: setup.managerAddress as string,
    network: setup.network,
  });
  const result = cvToJSON(call).value.value.value;
  return result;
}

export async function getDikoPrice(): Promise<number> {
  const pairDetails = await getPairDetails(`${setup.arkadikoAddress}.arkadiko-token`, `${setup.arkadikoAddress}.usda-token`)
  const dikoPrice = pairDetails['balance-y'].value / pairDetails['balance-x'].value;
  return dikoPrice;
}

export async function getUsdaPrice(stxPrice: number): Promise<number> {
  const pairDetails = await getPairDetails(`${setup.arkadikoAddress}.wrapped-stx-token`, `${setup.arkadikoAddress}.usda-token`)
  const stxPriceSwap = pairDetails['balance-y'].value / pairDetails['balance-x'].value;
  const usdaPrice = stxPrice/stxPriceSwap;
  return usdaPrice;
}
