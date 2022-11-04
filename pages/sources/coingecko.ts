import { PriceSourceInterface } from "./interface";

export class SourceCoinGecko implements PriceSourceInterface {

  public async fetchPrice(symbol: string, decimals: number): Promise<number> {

    // TODO
    return 1234;
  }
}
