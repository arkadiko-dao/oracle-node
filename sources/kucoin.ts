import { tokenInfo } from "@common/config";
import { fetchOnChainPrice } from "./onchain";
import { PriceSourceInterface } from "./interface";

export class SourceKucoin implements PriceSourceInterface {

  // Return price as int
  public async fetchPrice(symbol: string): Promise<number> {
    const price = await this.fetchPriceHelper(symbol);
    return Math.round(price * Math.pow(10, tokenInfo[symbol].decimals));
  }

  // Return price as double
  async fetchPriceHelper(symbol: string): Promise<number> {
    // API
    if (symbol == "STX") {
      return await this.fetchPriceAPI("STX");
    } else if (symbol == "BTC") {
      return await this.fetchPriceAPI("BTC");
    }

    // On chain
    const stxPrice = await this.fetchPriceAPI("STX");
    return await fetchOnChainPrice(symbol, stxPrice);
  }

  async fetchPriceAPI(id: string): Promise<number> {
    const url = `https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=${id}-USDT`;
    const response = await fetch(url, { credentials: 'omit' });
    const data = await response.json();
    return data.data.price;
  }
}
