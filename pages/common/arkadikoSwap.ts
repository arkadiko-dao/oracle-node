import { config } from './config';
import {
  callReadOnlyFunction,
  cvToJSON,
  contractPrincipalCV
} from '@stacks/transactions';

export async function getPairDetails(tokenX: string, tokenY: string): Promise<any> {
  const call = await callReadOnlyFunction({
    contractAddress: config.arkadikoAddress as string,
    contractName: "arkadiko-swap-v2-1",
    functionName: "get-pair-details",
    functionArgs: [
      contractPrincipalCV(tokenX.split(".")[0], tokenX.split(".")[1]),
      contractPrincipalCV(tokenY.split(".")[0], tokenY.split(".")[1])
    ],
    senderAddress: config.managerAddress as string,
    network: config.network,
  });
  const result = cvToJSON(call).value;
  return result;
}

export async function getDikoPrice(): Promise<number> {
  const pairDetails = await getPairDetails(`${config.arkadikoAddress}.arkadiko-token`, `${config.arkadikoAddress}.usda-token`)
  const dikoPrice = pairDetails['balance-y'].value / pairDetails['balance-x'].value;
  return dikoPrice;
}

export async function getUsdaPrice(stxPrice: number): Promise<number> {
  const pairDetails = await getPairDetails(`${config.arkadikoAddress}.wrapped-stx-token`, `${config.arkadikoAddress}.usda-token`)
  const stxPriceSwap = pairDetails['balance-y'].value / pairDetails['balance-x'].value;
  const usdaPrice = stxPrice/stxPriceSwap;
  return usdaPrice;
}
