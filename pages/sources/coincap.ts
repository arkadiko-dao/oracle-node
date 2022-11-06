import { fetchPriceAMM } from "./amm";
import { PriceSourceInterface } from "./interface";

export class SourceCoinCap implements PriceSourceInterface {

  // Return price as int (with given decimals)
  public async fetchPrice(symbol: string, decimals: number): Promise<number> {
    const price = await this.fetchPriceHelper(symbol, decimals);
    return Math.round(Math.pow(price, decimals));
  }

  // Return price as double
  async fetchPriceHelper(symbol: string, decimals: number): Promise<number> {
    // API
    if (symbol == "STX") {
      return await this.fetchPrice("stacks", decimals);
    } else if (symbol == "BTC") {
      return await this.fetchPrice("bitcoin", decimals);
    }

    // AMM
    const stxPrice = await this.fetchPrice("blockstack", decimals);
    return await fetchPriceAMM(symbol, stxPrice);
  }

  async fetchPriceAPI(id: string): Promise<number> {
    const url = `api.coincap.io/v2/assets/${id}`;
    const response = await fetch(url, { credentials: 'omit' });
    const data = await response.json();
    return data[id].usd;
  }
}
