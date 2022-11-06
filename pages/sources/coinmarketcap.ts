import { fetchPriceAMM } from "./amm";
import { PriceSourceInterface } from "./interface";

export class SourceCoinMarketCap implements PriceSourceInterface {

  // Return price as int (with given decimals)
  public async fetchPrice(symbol: string, decimals: number): Promise<number> {
    const price = await this.fetchPriceHelper(symbol);
    return Math.round(Math.pow(price, decimals));
  }

  // Return price as double
  async fetchPriceHelper(symbol: string): Promise<number> {
    // API
    if (symbol == "STX") {
      return await this.fetchPriceAPI("4847");
    } else if (symbol == "BTC") {
      return await this.fetchPriceAPI("1");
    }

    // AMM
    const stxPrice = await this.fetchPriceAPI("4847");
    return await fetchPriceAMM(symbol, stxPrice);
  }

  async fetchPriceAPI(id: string): Promise<number> {
    const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=${id}&convert=USD`
    const response = await fetch(url, { 
      headers: {
        "X-CMC_PRO_API_KEY": process.env.CMC_KEY!
      }
    });
    const data = await response.json();
    return data.data[id].quote.USD.price;
  }
}
