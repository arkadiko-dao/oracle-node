import { getAutoAlexPrice, getAutoAlexV2Price, getUsdaPrice } from "./ammAlex";
import { getDikoPrice } from "./ammArkadiko";

export async function fetchPriceAMM(symbol: string, stxPrice: number): Promise<number> {
  if (symbol == "DIKO") {
    return await getDikoPrice();
  } else if (symbol == "USDA") {
    return await getUsdaPrice();
  } else if (symbol == "auto-alex") {
    return await getAutoAlexPrice(stxPrice);
  } else if (symbol == "auto-alex-v2") {
    return await getAutoAlexV2Price(stxPrice);
  }
  return 0.0
}
