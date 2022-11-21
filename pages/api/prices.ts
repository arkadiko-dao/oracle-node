import type { NextApiRequest, NextApiResponse } from 'next'
import { config, tokenDecimals } from '@common/config';

type Data = {
  prices: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  // Get all prices
  var result: { [key: string]: number } = {};
  for (const symbol of config.symbols) {
    const price = await config.source.fetchPrice(symbol);
    result[symbol] = price / Math.pow(10, tokenDecimals[symbol]);
  }

  res.setHeader("Access-Control-Allow-Origin", "*")
  res.status(200).json({ 
    prices: result
  })
}
