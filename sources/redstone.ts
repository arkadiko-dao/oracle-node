import { fetchPriceAMM } from "./amm";
import { PriceSourceInterface } from "./interface";
import redstone from 'redstone-api-extended';

export class SourceRedstone implements PriceSourceInterface {

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
    const data = await redstone.oracle.getFromDataFeed("redstone", id);
    return data.priceData.values[0] / 100000000;
  }
}
