import { config } from './config';
import {
  callReadOnlyFunction,
  cvToJSON,
  contractPrincipalCV,
  uintCV
} from '@stacks/transactions';

export async function getPairDetailsSimpleWeightPool(tokenX: string, tokenY: string): Promise<any> {
  const call = await callReadOnlyFunction({
    contractAddress: config.alexAddress as string,
    contractName: "simple-weight-pool-alex",
    functionName: "get-balances",
    functionArgs: [
      contractPrincipalCV(tokenX.split(".")[0], tokenX.split(".")[1]),
      contractPrincipalCV(tokenY.split(".")[0], tokenY.split(".")[1])
    ],
    senderAddress: config.managerAddress as string,
    network: config.network,
  });
  const result = cvToJSON(call).value.value;
  return result;
}

export async function getPairDetailsFixedWeightPool(tokenX: string, tokenY: string): Promise<any> {
  const call = await callReadOnlyFunction({
    contractAddress: config.alexAddress as string,
    contractName: "fixed-weight-pool-v1-01",
    functionName: "get-balances",
    functionArgs: [
      contractPrincipalCV(tokenX.split(".")[0], tokenX.split(".")[1]),
      contractPrincipalCV(tokenY.split(".")[0], tokenY.split(".")[1]),
      uintCV(50000000),
      uintCV(50000000),
    ],
    senderAddress: config.managerAddress as string,
    network: config.network,
  });
  const result = cvToJSON(call).value.value;
  return result;
}

export async function getAutoAlexPrice(stxPrice: number): Promise<number> {
  const stxAlexPair = await getPairDetailsFixedWeightPool(`${config.alexAddress}.token-wstx`, `${config.alexAddress}.age000-governance-token`)
  const alexPrice = (stxAlexPair['balance-x'].value / stxAlexPair['balance-y'].value) * stxPrice;

  const alexPair = await getPairDetailsSimpleWeightPool(`${config.alexAddress}.age000-governance-token`, `${config.alexAddress}.auto-alex`)
  const autoAlexPrice = (alexPair['balance-x'].value / alexPair['balance-y'].value) * alexPrice;

  return autoAlexPrice;
}
