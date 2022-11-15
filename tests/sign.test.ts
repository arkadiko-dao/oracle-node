import { createMocks } from 'node-mocks-http';
import handler from '../pages/api/sign';
import * as stacks from '@common/stacks';
import * as oracle from '@common/oracle';
import { config } from '@common/config';

jest.setTimeout(50000);

describe('/api/sign', () => {
  test('error if wrong block', async () => {

    // Get info
    const currentBlock = await stacks.getCurrentBlockHeight();

    // Call API
    const { req, res } = createMocks({
      method: 'GET',
      query: { block: currentBlock-20, tokenId: 1, price: 0.33, decimals: 1000000 }
    });
    await handler(req, res);

    // Check result
    expect(res._getStatusCode()).toBe(404);
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({
        error: 'wrong input - block',
      }),
    );
  });

  test('error if wrong decimals', async () => {

    // Mocks
    jest.spyOn(stacks, 'getCurrentBlockHeight').mockReturnValue(69420);
    jest.spyOn(oracle, 'getTokenNames').mockReturnValue([{value: "STX"},{value: "xSTX"}]);

    // Call API
    const { req, res } = createMocks({
      method: 'GET',
      query: { block: 69415, tokenId: 1, price: 0.33, decimals: 100000000 }
    });
    await handler(req, res);

    // Check result
    expect(res._getStatusCode()).toBe(404);
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({
        error: 'wrong input - decimals',
      }),
    );
  });

  test('error if wrong price', async () => {

    // Mocks
    jest.spyOn(stacks, 'getCurrentBlockHeight').mockReturnValue(69420);
    jest.spyOn(oracle, 'getTokenNames').mockReturnValue([{value: "STX"},{value: "xSTX"}]);

    // Call API
    const { req, res } = createMocks({
      method: 'GET',
      query: { block: 69415, tokenId: 1, price: 31200, decimals: 1000000 }
    });
    await handler(req, res);

    // Check result
    expect(res._getStatusCode()).toBe(404);
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({
        error: 'wrong input - price',
      }),
    );
  });

  test('sign if input good', async () => {

    // Mocks
    jest.spyOn(stacks, 'getCurrentBlockHeight').mockReturnValue(69420);
    jest.spyOn(oracle, 'getTokenNames').mockReturnValue([{value: "STX"},{value: "xSTX"}]);
    jest.spyOn(oracle, 'getSignableMessage').mockReturnValue("0x792bba1971eec90128a2db0847aa260c495390ee351821ce5e8d2fe7509ae388");

    // Get info
    const price = await config.source.fetchPrice("STX");

    // Call API
    const { req, res } = createMocks({
      method: 'GET',
      query: { block: 69420, tokenId: 1, price: price, decimals: 1000000 }
    });
    await handler(req, res);

    // Check result
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({
        signature: '929cf1a775801908d420260dff4ad3f958cdf3ece270223be308f76e8a7cc7147a512e0dd61cbf69997b1f7e3aa1166dc5d33f3b31d265c2f816b4d12c1fc54401',
        publicKey: '0338c6c30f619819ae9f95e0a506207f95ff22927dee0e2303050a7a1cce6056d8'
      }),
    );
  });
});
