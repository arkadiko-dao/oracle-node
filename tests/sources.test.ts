import { SourceCoinbase } from '@sources/coinbase';
import { SourceCoinCap } from '@sources/coincap';
import { SourceCoinGecko } from '@sources/coingecko';
import { SourceCoinMarketCap } from '@sources/coinmarketcap';
import { SourceCryptoCompare } from '@sources/cryptocompare';
import { SourceKucoin } from '@sources/kucoin';

jest.setTimeout(50000);

describe('/api/sources', () => {
  test('can get price from Coinbase', async () => {
    const source = new SourceCoinbase();
    const price = await source.fetchPrice("STX");
    console.log("price:", price);
    expect(price).toBeGreaterThan(0);
  });

  test('can get price from Cryptocompare', async () => {
    const source = new SourceCryptoCompare();
    const price = await source.fetchPrice("STX");
    console.log("price:", price); 
    expect(price).toBeGreaterThan(0);
  });

  test('can get price from Kucoin', async () => {
    const source = new SourceKucoin();
    const price = await source.fetchPrice("STX");
    console.log("price:", price);
    expect(price).toBeGreaterThan(0);
  });

  test('can get price from CoinCap', async () => {
    const source = new SourceCoinCap();
    const price = await source.fetchPrice("STX");
    console.log("price:", price);
    expect(price).toBeGreaterThan(0);
  });

  test('can get price from CoinGecko', async () => {
    const source = new SourceCoinGecko();
    const price = await source.fetchPrice("STX");
    console.log("price:", price);
    expect(price).toBeGreaterThan(0);
  });

  test('can get price from CoinMarketCap', async () => {
    const source = new SourceCoinMarketCap();
    const price = await source.fetchPrice("STX");
    console.log("price:", price);
    expect(price).toBeGreaterThan(0);
  });

  test('can get price from Coinbase', async () => {
    const source = new SourceCoinbase();
    const price = await source.fetchPrice("STX");
    console.log("price:", price);
    expect(price).toBeGreaterThan(0);
  });

  test('can get AMM prices', async () => {
    const source = new SourceCoinbase();
    var price = await source.fetchPrice("DIKO");
    console.log("DIKO price:", price);
    expect(price).toBeGreaterThan(0);

    price = await source.fetchPrice("USDA");
    console.log("USDA price:", price);
    expect(price).toBeGreaterThan(0);

    price = await source.fetchPrice("auto-alex");
    console.log("atALEX price:", price);
    expect(price).toBeGreaterThan(0);
  });
});
