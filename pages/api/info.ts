import type { NextApiRequest, NextApiResponse } from 'next'
import { isTrustedOracle } from '@common/oracle';
import { getPublicKey } from '@common/helpers';
import { config } from '@common/config';

type Data = {
  publicKey: string,
  trusted: boolean,
  network: string,
  source: string,
  maxBlockDiff: number,
  maxPriceDiff: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Get the public key in a compressed format
  const publicKey = getPublicKey();
  const trusted = await isTrustedOracle(publicKey);

  res.status(200).json({ 
    publicKey: publicKey,
    trusted: trusted,
    network: config.network.isMainnet() ? "mainnet" : "testnet",
    source: config.sourceName,
    maxBlockDiff: config.inputMaxBlockDiff,
    maxPriceDiff: config.inputMaxPriceDiff
  })
}
