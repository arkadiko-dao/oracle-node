import { tokenInfo } from "@common/config";
import { fetchOnChainPrice } from "./onchain";
import { PriceSourceInterface } from "./interface";

export class SourceCoinMarketCap implements PriceSourceInterface {

  // Return price as int
  public async fetchPrice(symbol: string): Promise<number> {
    const price = await this.fetchPriceHelper(symbol);
    return Math.round(price * Math.pow(10, tokenInfo[symbol].decimals));
  }

  // Return price as double
  async fetchPriceHelper(symbol: string): Promise<number> {
    // API
    if (symbol == "STX") {
      return await this.fetchPriceAPI("4847");
    } else if (symbol == "BTC") {
      return await this.fetchPriceAPI("1");
    }

    // On chain
    const stxPrice = await this.fetchPriceAPI("4847");
    return await fetchOnChainPrice(symbol, stxPrice);
  }

  async fetchPriceAPI(id: string): Promise<number> {
    try {
      const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=${id}&convert=USD`
      const response = await fetch(url, {
        headers: {
          "X-CMC_PRO_API_KEY": process.env.API_CMC_KEY!
        }
      });
      const data = await response.json();
      return data.data[id].quote.USD.price;
    } catch (error) {
      return 0
    }
  }
}
