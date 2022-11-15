import type { NextApiRequest, NextApiResponse } from 'next'
import { config } from '@common/config';
import { getMinimumSigners, getPriceInfo, getTokenId, pushPriceInfo } from '@common/oracle';
import { getCurrentBlockHeight, getMempoolTransactions } from '@common/stacks';

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
      console.log("\n[CHECK] Should update " + symbol + " (ID #" + tokenId + ") price");
      console.log("[CHECK] Current price info:", priceInfo);
      await updatePrice(symbol, tokenId, priceInfo.decimals.value, blockHeight);
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
  // TODO: check if transaction in mempool to update price for given tokenId

  return true
}

async function updatePrice(symbol: string, tokenId: number, decimals: number, blockHeight: number) {

  // Fetch price from source
  const price = await config.source.fetchPrice(symbol) as number;

  // Create price object
  const priceObject = {
    block: blockHeight,
    tokenId: tokenId,
    price: price,
    decimals: decimals
  }
  console.log("[CHECK] Price info:", priceObject);

  // Get all signatures
  var signatures: string[] = [];
  const params = `?block=${blockHeight}&tokenId=${tokenId}&price=${price}&decimals=${decimals}`
  for (const node of config.nodes) {
    const url = node + params;
    const response = await fetch(url, { credentials: 'omit' });
    if (response.status == 200) {
      const data = await response.json();
      signatures.push(data.signature);
    }
  }
  console.log("[CHECK] Signatures:", signatures);

  // Push on chain
  const minimumSigners = await getMinimumSigners();
  const uniqueSignatures = new Set(signatures).size
  if (uniqueSignatures >= minimumSigners) {
    console.log("[CHECK] Push price info for " + symbol);
    await pushPriceInfo(priceObject, signatures);
  }
}
