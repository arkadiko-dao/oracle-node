import { createMocks } from 'node-mocks-http';
import handler from '../pages/api/sign';
import * as stacks from '../pages/common/stacks';
import * as oracle from '../pages/common/oracle';

describe('/api/sign', () => {
  test('error if wrong block', async () => {

    // Mocks
    jest.spyOn(stacks, 'getCurrentBlockHeight').mockReturnValue(69420);

    // Call API
    const { req, res } = createMocks({
      method: 'GET',
      query: { block: 69320, tokenId: 1, price: 0.33, decimals: 1000000 }
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
});

describe('/api/sign', () => {
  test('error if wrong decimals', async () => {

    // Mocks
    jest.spyOn(stacks, 'getCurrentBlockHeight').mockReturnValue(69420);
    jest.spyOn(oracle, 'getTokenNames').mockReturnValue(["STX"]);

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
});

describe('/api/sign', () => {
  test('error if wrong price', async () => {

    // Mocks
    jest.spyOn(stacks, 'getCurrentBlockHeight').mockReturnValue(69420);
    jest.spyOn(oracle, 'getTokenNames').mockReturnValue(["STX"]);

    const priceInfo = await oracle.getPriceInfo('STX');
    console.log("priceinfo:", priceInfo);

    // Call API
    const { req, res } = createMocks({
      method: 'GET',
      query: { block: 69415, tokenId: 1, price: 0.33, decimals: 1000000 }
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
});
