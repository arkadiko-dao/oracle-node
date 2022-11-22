import type { NextApiRequest, NextApiResponse } from 'next'
import { isTrustedOracle } from '@common/oracle';
import { getPublicKey } from '@common/helpers';
import { config, tokenDecimals } from '@common/config';

type Data = {
  publicKey: string,
  trusted: boolean,
  network: string,
  source: string,
  maxBlockDiff: number,
  maxPriceDiff: number,
  prices: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Get the public key in a compressed format
  const publicKey = getPublicKey();
  const trusted = await isTrustedOracle(publicKey);

  // Get all prices
  var prices: { [key: string]: number } = {};
  for (const symbol of config.symbols) {
    const price = await config.source.fetchPrice(symbol);
    prices[symbol] = price / Math.pow(10, tokenDecimals[symbol]);
  }

  res.setHeader("Access-Control-Allow-Origin", "*")
  res.status(200).json({ 
    publicKey: publicKey,
    trusted: trusted,
    network: config.network.isMainnet() ? "mainnet" : "testnet",
    source: config.sourceName,
    maxBlockDiff: config.inputMaxBlockDiff,
    maxPriceDiff: config.inputMaxPriceDiff,
    prices: prices
  })
}
