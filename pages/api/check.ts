import type { NextApiRequest, NextApiResponse } from 'next'
import { config } from '../common/config';
import { getPriceInfo, getTokenId, pushPriceInfo } from '../common/oracle';
import { getCurrentBlockHeight, getMempoolTransactions } from '../common/stacks';

type Data = {
  result: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  // Get current block
  const blockHeight = await getCurrentBlockHeight();

  // Loop over all symbols
  for (const symbol of config.symbols) {

    // Get on chain price info
    const priceInfo = await getPriceInfo(symbol);

    // Get token ID for symbol
    const tokenId = await getTokenId(symbol)

    // Check if price needs to be updated
    const shouldUpdate = await shouldUpdatePrice(tokenId, priceInfo["last-block"], blockHeight);

    // Update if needed
    if (shouldUpdate) {
      await updatePrice(tokenId, priceInfo.decimals, blockHeight);
    }
  }

  res.status(200).json({ result: "done" })
}

async function shouldUpdatePrice(tokenId: number, lastBlock: number, blockHeight: number): Promise<boolean> {

  // Check if it's time to update
  if (blockHeight < lastBlock + 6) {
    return false
  }

  // Check mempool
  const mempoolTxs = await getMempoolTransactions();
  const oracleTransactions = mempoolTxs.filter(tx => tx.sender_address == config.managerAddress)
  // TODO: check if transaction for given tokenId

  return true
}

async function updatePrice(tokenId: number, decimals: number, blockHeight: number) {

  // Fetch price from source
  // TODO
  const price = 123;

  // Create price object
  const priceObject = {
    block: blockHeight,
    tokenId: tokenId,
    price: price,
    decimals: decimals
  }

  // Get all signatures
  var signatures: string[] = [];
  const params = `?block=${blockHeight}&tokenId=${tokenId}&price=${price}&decimals=${decimals}`
  for (const node of config.nodes) {
    const url = node + params;
    const response = await fetch(url, { credentials: 'omit' });
    const data = await response.json();
    signatures.push(data.signature);
  }

  // Push on chain
  await pushPriceInfo(priceObject, signatures);
}