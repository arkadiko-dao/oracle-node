import { fetchPriceAMM } from "./amm";
import { PriceSourceInterface } from "./interface";

export class SourceCryptoCompare implements PriceSourceInterface {

  // Return price as int (with given decimals)
  public async fetchPrice(symbol: string, decimals: number): Promise<number> {
    const price = await this.fetchPriceHelper(symbol);
    return Math.round(price * decimals);
  }

  // Return price as double
  async fetchPriceHelper(symbol: string): Promise<number> {
    // API
    if (symbol == "STX") {
      return await this.fetchPriceAPI("STX");
    } else if (symbol == "BTC") {
      return await this.fetchPriceAPI("BTC");
    }

    // AMM
    const stxPrice = await this.fetchPriceAPI("STX");
    return await fetchPriceAMM(symbol, stxPrice);
  }

  async fetchPriceAPI(id: string): Promise<number> {
    const url = `https://min-api.cryptocompare.com/data/price?fsym=${id}&tsyms=USD`
    const response = await fetch(url, { 
      headers: {
        "Apikey": process.env.CRYPTOCOMPARE_KEY!
      }
    });
    const data = await response.json();
    return data.USD;
  }
}
