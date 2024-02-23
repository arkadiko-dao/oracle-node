import { getAutoAlexPrice, getAutoAlexV2Price, getUsdaPrice as getUsdaPriceAlex } from "./alex";
import { getDikoPrice, getUsdaPrice as getUsdaPriceArkadiko } from "./arkadiko";
import { getStStxPrice } from "./stackingDao";

export async function fetchOnChainPrice(symbol: string, stxPrice: number): Promise<number> {
  if (symbol == "DIKO") {
    return await getDikoPrice();
  } else if (symbol == "USDA") {
    return await getUsdaPriceAlex();
  } else if (symbol == "STX/USDA") {
    return await getUsdaPriceArkadiko(stxPrice);
  } else if (symbol == "auto-alex") {
    return await getAutoAlexPrice(stxPrice);
  } else if (symbol == "auto-alex-v2") {
    return await getAutoAlexV2Price(stxPrice);
  } else if (symbol == "stSTX") {
    return await getStStxPrice(stxPrice);
  }
  return 0.0
}
