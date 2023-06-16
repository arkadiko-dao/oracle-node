import { tokenInfo } from "@common/config";
import { fetchPriceAMM } from "./amm";
import { PriceSourceInterface } from "./interface";

export class SourceCoinGecko implements PriceSourceInterface {

  // Return price as int
  public async fetchPrice(symbol: string): Promise<number> {
    const price = await this.fetchPriceHelper(symbol, tokenInfo[symbol].decimals);
    return Math.round(price * Math.pow(10, tokenInfo[symbol].decimals));
  }

  // Return price as double
  async fetchPriceHelper(symbol: string, decimals: number): Promise<number> {
    // API
    if (symbol == "STX") {
      return await this.fetchPriceAPI("blockstack", decimals);
    } else if (symbol == "BTC") {
      return await this.fetchPriceAPI("bitcoin", decimals);
    }

    // AMM
    const stxPrice = await this.fetchPriceAPI("blockstack", decimals);
    return await fetchPriceAMM(symbol, stxPrice);
  }

  async fetchPriceAPI(id: string, decimals: number): Promise<number> {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&precision=${decimals}`;
    const response = await fetch(url, { credentials: 'omit' });
    const data = await response.json();
    return data[id].usd;
  }
}
