export interface PriceSourceInterface {
  fetchPrice: (symbol: string, decimals: number) => Promise<number>
}
