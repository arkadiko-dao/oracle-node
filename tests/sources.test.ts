import { SourceCoinApi } from '@sources/coinapi';
import { SourceCoinCap } from '@sources/coincap';
import { SourceCoinGecko } from '@sources/coingecko';
import { SourceCoinMarketCap } from '@sources/coinmarketcap';
import { SourceCryptoCompare } from '@sources/cryptocompare';
import { SourceRedstone } from '@sources/redstone';

jest.setTimeout(50000);

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

  test('can get AMM prices', async () => {
    const source = new SourceRedstone();
    var price = await source.fetchPrice("DIKO", 1000000);
    console.log("DIKO price:", price);
    expect(price).toBeGreaterThan(0);

    price = await source.fetchPrice("USDA", 1000000);
    console.log("USDA price:", price);
    expect(price).toBeGreaterThan(0);

    price = await source.fetchPrice("auto-alex", 100000000);
    console.log("atALEX price:", price);
    expect(price).toBeGreaterThan(0);
  });
});
