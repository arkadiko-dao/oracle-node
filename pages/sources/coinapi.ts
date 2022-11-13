import { fetchPriceAMM } from "./amm";
import { PriceSourceInterface } from "./interface";

export class SourceCoinApi implements PriceSourceInterface {

  // Return price as int (with given decimals)
  public async fetchPrice(symbol: string, decimals: number): Promise<number> {
    const price = await this.fetchPriceHelper(symbol, decimals);
    return Math.round(price * decimals);
  }

  // Return price as double
  async fetchPriceHelper(symbol: string, decimals: number): Promise<number> {
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
    const url = `https://rest.coinapi.io/v1/quotes/current?apiKey=${process.env.COINAPI_KEY!}&filter_symbol_id=${id}`;
    const response = await fetch(url, { credentials: 'omit' });
    const data = await response.json();
    return data[0].last_trade.price;
  }
}
