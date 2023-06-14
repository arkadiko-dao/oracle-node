import { config } from '@common/config';
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

export async function getPriceAmmPool(tokenX: string, tokenY: string, factor: number): Promise<any> {
  const call = await callReadOnlyFunction({
    contractAddress: config.alexAddress as string,
    contractName: "amm-swap-pool-v1-1",
    functionName: "get-price",
    functionArgs: [
      contractPrincipalCV(tokenX.split(".")[0], tokenX.split(".")[1]),
      contractPrincipalCV(tokenY.split(".")[0], tokenY.split(".")[1]),
      uintCV(factor),
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

export async function getAutoAlexV2Price(stxPrice: number): Promise<number> {
  const stxAlexPair = await getPairDetailsFixedWeightPool(`${config.alexAddress}.token-wstx`, `${config.alexAddress}.age000-governance-token`)
  const alexPrice = (stxAlexPair['balance-x'].value / stxAlexPair['balance-y'].value) * stxPrice;

  const autoAlexPrice = await getPriceAmmPool(`${config.alexAddress}.age000-governance-token`, `${config.alexAddress}.auto-alex-v2`, 100000000);
  return alexPrice * (1 / (autoAlexPrice / 100000000));
}

export async function getUsdaPrice(): Promise<number> {
  const call = await callReadOnlyFunction({
    contractAddress: config.alexAddress as string,
    contractName: "amm-swap-pool",
    functionName: "get-price",
    functionArgs: [
      contractPrincipalCV(config.alexAddress, "token-wxusd"),
      contractPrincipalCV(config.alexAddress, "token-wusda"),
      uintCV(500000),
    ],
    senderAddress: config.managerAddress as string,
    network: config.network,
  });
  const result = cvToJSON(call).value.value;
  return 100000000 / result;
}