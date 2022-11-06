import { fetchPriceAMM } from "./amm";
import { PriceSourceInterface } from "./interface";

export class SourceCoinApi implements PriceSourceInterface {

  // Return price as int (with given decimals)
  public async fetchPrice(symbol: string, decimals: number): Promise<number> {
    const price = await this.fetchPriceHelper(symbol, decimals);
    return Math.round(Math.pow(price, decimals));
  }

  // Return price as double
  async fetchPriceHelper(symbol: string, decimals: number): Promise<number> {
    // API
    if (symbol == "STX") {
      return await this.fetchPriceAPI("KRAKEN_SPOT_STX_USD", decimals);
    } else if (symbol == "BTC") {
      return await this.fetchPriceAPI("KRAKEN_SPOT_BTC_USDC", decimals);
    }

    // AMM
    const stxPrice = await this.fetchPriceAPI("KRAKEN_SPOT_STX_USD", decimals);
    return await fetchPriceAMM(symbol, stxPrice);
  }

  async fetchPriceAPI(id: string, decimals: number): Promise<number> {
    const url = `rest.coinapi.io/v1/quotes/current?apiKey=${process.env.COINAPI_KEY!}&filter_symbol_id=KRAKEN_SPOT_STX_USD`;
    const response = await fetch(url, { credentials: 'omit' });
    const data = await response.json();
    return data[0].last_trade.price;
  }
}
