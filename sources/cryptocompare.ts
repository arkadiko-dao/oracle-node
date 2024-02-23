import { tokenInfo } from "@common/config";
import { fetchOnChainPrice } from "./onchain";
import { PriceSourceInterface } from "./interface";

export class SourceCryptoCompare implements PriceSourceInterface {

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
    const url = `https://min-api.cryptocompare.com/data/price?fsym=${id}&tsyms=USD`
    const response = await fetch(url, {
      headers: {
        "Apikey": process.env.API_CRYPTOCOMPARE_KEY!
      }
    });
    const data = await response.json();
    return data.USD;
  }
}
