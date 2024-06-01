import { tokenInfo } from "@common/config";
import { PriceSourceInterface } from "./interface";
import { fetchOnChainPrice } from "./onchain";

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

    // On chain
    const stxPrice = await this.fetchPriceAPI("blockstack", decimals);
    return await fetchOnChainPrice(symbol, stxPrice);
  }

  async fetchPriceAPI(id: string, decimals: number): Promise<number> {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&precision=${decimals}&x_cg_demo_api_key=CG-qmcsLMfDVnbXtcZovVyZzk26`;
    const response = await fetch(url, { credentials: 'omit' });
    const data = await response.json();
    console.log(data)
    return data[id].usd;
  }
}
