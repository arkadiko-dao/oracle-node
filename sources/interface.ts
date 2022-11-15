export interface PriceSourceInterface {
  fetchPrice: (symbol: string) => Promise<number>
}
