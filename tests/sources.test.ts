import { SourceCoinApi } from '../pages/sources/coinapi';
import { SourceCoinCap } from '../pages/sources/coincap';
import { SourceCoinGecko } from '../pages/sources/coingecko';
import { SourceCoinMarketCap } from '../pages/sources/coinmarketcap';
import { SourceCryptoCompare } from '../pages/sources/cryptocompare';
import { SourceRedstone } from '../pages/sources/redstone';

describe('/api/sources', () => {
  test('can get price from CoinApi', async () => {
    const source = new SourceCoinApi();
    const price = await source.fetchPrice("STX", 1000000);
    console.log("price:", price);
    expect(price).toBeGreaterThan(0);
  });

  test('can get price from CoinCap', async () => {
    const source = new SourceCoinCap();
    const price = await source.fetchPrice("STX", 1000000);
    console.log("price:", price);
    expect(price).toBeGreaterThan(0);
  });

  test('can get price from CoinGecko', async () => {
    const source = new SourceCoinGecko();
    const price = await source.fetchPrice("STX", 1000000);
    console.log("price:", price);
    expect(price).toBeGreaterThan(0);
  });

  test('can get price from CoinMarketCap', async () => {
    const source = new SourceCoinMarketCap();
    const price = await source.fetchPrice("STX", 1000000);
    console.log("price:", price);
    expect(price).toBeGreaterThan(0);
  });

  test('can get price from CryptoCompare', async () => {
    const source = new SourceCryptoCompare();
    const price = await source.fetchPrice("STX", 1000000);
    console.log("price:", price);
    expect(price).toBeGreaterThan(0);
  });

  test('can get price from Redstone', async () => {
    const source = new SourceRedstone();
    const price = await source.fetchPrice("STX", 1000000);
    console.log("price:", price);
    expect(price).toBeGreaterThan(0);
  });
});
