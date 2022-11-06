import { getAutoAlexPrice } from "../common/alexSwap";
import { getDikoPrice, getUsdaPrice } from "../common/arkadikoSwap";
import { PriceSourceInterface } from "./interface";

export class SourceCoinGecko implements PriceSourceInterface {

  public async fetchPrice(symbol: string, decimals: number): Promise<number> {

    // API
    if (symbol == "STX") {
      return await this.fetchPrice("blockstack", decimals);
    } else if (symbol == "BTC") {
      return await this.fetchPrice("bitcoin", decimals);
    }

    // AMM
    return await this.fetchPriceAMM(symbol, decimals);
  }

  async fetchPriceAPI(id: string, decimals: number): Promise<number> {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&precision=${decimals}`;
    const response = await fetch(url, { credentials: 'omit' });
    const data = await response.json();
    return data[id].usd;
  }

  async fetchPriceAMM(symbol: string, decimals: number): Promise<number> {
    if (symbol == "DIKO") {
      return await getDikoPrice();
    } else if (symbol == "USDA") {
      const stxPrice = await this.fetchPriceAPI("STX", 6);
      return await getUsdaPrice(stxPrice);
    } else if (symbol == "auto-alex") {
      const stxPrice = await this.fetchPriceAPI("STX", 6);
      return await getAutoAlexPrice(stxPrice);
    }
    return 0.0
  }
}
