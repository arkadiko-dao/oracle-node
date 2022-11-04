import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  // Check if price needs to be updated
  const shouldUpdate = shouldUpdatePrice("BTC");

  // Fetch price from source

  // Get all signatures

  // Push on chain

  res.status(200).json({ name: 'John Doe' })
}

async function shouldUpdatePrice(symbol: string): Promise<boolean> {

  // Check last updated block on chain

  // Check mempool

  return false
}