import { createMocks } from 'node-mocks-http';
import handler from '../pages/api/sign';
import * as stacks from '../pages/common/stacks';
import * as oracle from '../pages/common/oracle';

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

  test('error if wrong price', async () => {

    // Mocks
    jest.spyOn(stacks, 'getCurrentBlockHeight').mockReturnValue(69420);
    jest.spyOn(oracle, 'getTokenNames').mockReturnValue(["STX"]);

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
});

// TODO: check if correct price can be signed
