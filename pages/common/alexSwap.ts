import { setup } from './setup';
import {
  callReadOnlyFunction,
  cvToJSON,
  contractPrincipalCV,
  uintCV
} from '@stacks/transactions';

export async function getPairDetailsSimpleWeightPool(tokenX: string, tokenY: string): Promise<any> {
  const call = await callReadOnlyFunction({
    contractAddress: setup.alexAddress as string,
    contractName: "simple-weight-pool-alex",
    functionName: "get-balances",
    functionArgs: [
      contractPrincipalCV(tokenX.split(".")[0], tokenX.split(".")[1]),
      contractPrincipalCV(tokenY.split(".")[0], tokenY.split(".")[1])
    ],
    senderAddress: setup.managerAddress as string,
    network: setup.network,
  });
  const result = cvToJSON(call).value.value;
  return result;
}

export async function getPairDetailsFixedWeightPool(tokenX: string, tokenY: string): Promise<any> {
  const call = await callReadOnlyFunction({
    contractAddress: setup.alexAddress as string,
    contractName: "fixed-weight-pool-v1-01",
    functionName: "get-balances",
    functionArgs: [
      contractPrincipalCV(tokenX.split(".")[0], tokenX.split(".")[1]),
      contractPrincipalCV(tokenY.split(".")[0], tokenY.split(".")[1]),
      uintCV(50000000),
      uintCV(50000000),
    ],
    senderAddress: setup.managerAddress as string,
    network: setup.network,
  });
  const result = cvToJSON(call).value.value;
  return result;
}

export async function getAutoAlexPrice(stxPrice: number): Promise<number> {
  const stxAlexPair = await getPairDetailsFixedWeightPool(`${setup.alexAddress}.token-wstx`, `${setup.alexAddress}.age000-governance-token`)
  const alexPrice = (stxAlexPair['balance-x'].value / stxAlexPair['balance-y'].value) * stxPrice;

  const alexPair = await getPairDetailsSimpleWeightPool(`${setup.alexAddress}.age000-governance-token`, `${setup.alexAddress}.auto-alex`)
  const autoAlexPrice = (alexPair['balance-x'].value / alexPair['balance-y'].value) * alexPrice;

  return autoAlexPrice;
}
