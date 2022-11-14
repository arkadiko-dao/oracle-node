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

  test('sign if input good', async () => {

    // Mocks
    jest.spyOn(stacks, 'getCurrentBlockHeight').mockReturnValue(69420);
    jest.spyOn(oracle, 'getTokenNames').mockReturnValue(["STX"]);
    jest.spyOn(oracle, 'getSignableMessage').mockReturnValue("0x792bba1971eec90128a2db0847aa260c495390ee351821ce5e8d2fe7509ae388");

    // Get info
    const price = await config.source?.fetchPrice("STX", 1000000);

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
        signature: '7b08fe12a53b175af72e5a8318bac89a6f72e328e5985887a6c8747ca7aa1e2108719d7c1bae45cef7840ee22ce669753e73f2a7bbddb6ef73cfb0d85577d02a01',
        publicKey: '029f3a1023151193a31eb36575601151df8706c8b3b50c243fee5e03abe2cf3107'
      }),
    );
  });
});
