import { getAutoAlexPrice, getUsdaPrice } from "./ammAlex";
import { getDikoPrice } from "./ammArkadiko";

export async function fetchPriceAMM(symbol: string, stxPrice: number): Promise<number> {
  if (symbol == "DIKO") {
    return await getDikoPrice();
  } else if (symbol == "USDA") {
    return await getUsdaPrice();
  } else if (symbol == "auto-alex") {
    return await getAutoAlexPrice(stxPrice);
  }
  return 0.0
}
