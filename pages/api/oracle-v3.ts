import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchPrice } from '@common/oracle-v3';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const symbols = ["STX", "xSTX", "BTC", "sBTC", "xBTC", "stSTX", "ststx-token", "DIKO", "WELSH"];
  
  const results = await Promise.all(
    symbols.map(symbol => fetchPrice(symbol))
  );

  const prices = symbols.reduce((acc, symbol, index) => {
    acc[symbol] = results[index];
    return acc;
  }, {} as Record<string, any>);

  res.setHeader("Access-Control-Allow-Origin", "*")
  res.status(200).json({ 
    prices
  })
}
