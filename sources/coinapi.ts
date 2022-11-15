import { tokenDecimals } from "@common/config";
import { fetchPriceAMM } from "./amm";
import { PriceSourceInterface } from "./interface";

export class SourceCoinApi implements PriceSourceInterface {

  // Return price as int
  public async fetchPrice(symbol: string): Promise<number> {
    const price = await this.fetchPriceHelper(symbol);
    return Math.round(price * Math.pow(10, tokenDecimals[symbol]));
  }

  // Return price as double
  async fetchPriceHelper(symbol: string): Promise<number> {
    // API
    if (symbol == "STX") {
      return await this.fetchPriceAPI("BINANCE_SPOT_STX_USDT");
    } else if (symbol == "BTC") {
      return await this.fetchPriceAPI("BINANCE_SPOT_BTC_USDT");
    }

    // AMM
    const stxPrice = await this.fetchPriceAPI("BINANCE_SPOT_STX_USDT");
    return await fetchPriceAMM(symbol, stxPrice);
  }

  async fetchPriceAPI(id: string): Promise<number> {
    const url = `https://rest.coinapi.io/v1/quotes/current?apiKey=${process.env.NEXT_PUBLIC_COINAPI_KEY!}&filter_symbol_id=${id}`;
    const response = await fetch(url, { credentials: 'omit' });
    const data = await response.json();
    return data[0].last_trade.price;
  }
}
