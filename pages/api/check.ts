import type { NextApiRequest, NextApiResponse } from 'next'
import { config } from '@common/config';
import { getMinimumSigners, getPriceInfo, getTokenId, pushPriceInfo } from '@common/oracle';
import { getCurrentBlockHeight, getMempoolTransactions, getNonce, getUnanchoredMicroblockTransactions } from '@common/stacks';

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
    const lastBlock = Number(priceInfo["last-block"].value)

    // Get token ID for symbol
    const tokenId = await getTokenId(symbol)

    // Check if price needs to be updated
    const shouldUpdate = await shouldUpdatePrice(tokenId, lastBlock, blockHeight);

    // Update if needed
    if (shouldUpdate) {
      console.log("\n[CHECK] Should update: " + symbol + " (ID #" + tokenId + ")");
      console.log("[CHECK] Current price info:", priceInfo);
      await updatePrice(symbol, tokenId, priceInfo.decimals.value, lastBlock, blockHeight);
    } else {
      console.log("\n[CHECK] Is up to date: " + symbol + " (ID #" + tokenId + ")");
    }
  }

  res.setHeader("Access-Control-Allow-Origin", "*")
  res.status(200).json({ result: "done" })
}

async function shouldUpdatePrice(tokenId: number, lastBlock: number, blockHeight: number): Promise<boolean> {

  // Check if it's time to update
  if (blockHeight < lastBlock + 6) {
    return false
  }

  // Get mempool and unanchored transactions
  const unanchoredTxs = await getUnanchoredMicroblockTransactions();
  const mempoolTxs = await getMempoolTransactions();
  const allTxs = mempoolTxs.concat(unanchoredTxs);

  // Find oracle transactions
  const oracleContract = config.oracleAddress + '.' + config.oracleContractName;
  const filteredTxs = allTxs.filter(tx => tx.tx_type == 'contract_call' && tx.contract_call.contract_id == oracleContract);

  // Check if given token is currently being updated
  const nonce = await getNonce(config.managerAddress)
  for (const tx of filteredTxs) {
    for (const arg of tx.contract_call.function_args) {
      if (arg.name == 'token-id' && arg.repr == 'u' + tokenId) {
        // Check if it's an actual TX, or stuck TX
        if (nonce <= tx.nonce) {
          return false
        }
      }
    }
  }

  return true
}

async function updatePrice(symbol: string, tokenId: number, decimals: number, lastBlock: number, blockHeight: number) {

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
  const params = `/api/sign?block=${blockHeight}&tokenId=${tokenId}&price=${price}&decimals=${decimals}`
  for (const node of config.nodes) {
    const url = node + params;
    const response = await fetch(url, { credentials: 'omit' });
    const data = await response.json();
    if (response.status == 200) {
      signatures.push(data.signature);
    } else {
      console.log("[CHECK] Could not get signature, error:", data);
    }
  }
  console.log("[CHECK] Signatures:", signatures);

  // Push on chain
  const minimumSigners = await getMinimumSigners();
  const uniqueSignatures = new Set(signatures).size
  if (uniqueSignatures >= minimumSigners) {

    // Check again if price still needs update
    const shouldUpdate = await shouldUpdatePrice(tokenId, lastBlock, blockHeight);
    if (shouldUpdate) {
      console.log("[CHECK] Push price info for " + symbol);
      const pushResult = await pushPriceInfo(priceObject, signatures);
      console.log("[CHECK] Transaction result:", pushResult);
    }
  }
}
