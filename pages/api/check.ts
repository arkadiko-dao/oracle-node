import type { NextApiRequest, NextApiResponse } from 'next'
import { config, tokenInfo } from '@common/config';
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
    const lastBlock = Number(priceInfo["last-block"])
    const lastPrice = Number(priceInfo["last-price"])

    // Get token ID for symbol
    const tokenId = await getTokenId(symbol);

    // Arkadiko decimals
    const arkadikoDecimals = priceInfo.decimals == 0 ? tokenInfo[symbol].arkadikoDecimals : priceInfo.decimals;

    // Get source price
    const price = await config.source.fetchPrice(symbol) as number;

    // Get TX for token ID already in mempool
    const mempoolTx = await mempoolUpdateTx(tokenId);
    if (mempoolTx) {
      const mempoolFee = Number(mempoolTx.fee_rate);
      const currentTimeStamp = (Date.now() / 1000.0);
      if (20 * 60 < (currentTimeStamp - mempoolTx.receipt_time) && mempoolFee < 1000000) {
        console.log("\n[CHECK] Should RBF mempool TX: " + symbol + " (ID #" + tokenId + ")");  
        await updatePrice(symbol, tokenId, arkadikoDecimals, lastBlock, blockHeight, lastPrice, price, mempoolTx.nonce, mempoolFee * 1.2);
  
      } else {
        console.log("\n[CHECK] Waiting for TX in mempool: " + symbol + " (ID #" + tokenId + ")");
      }
    
    } else {
      const shouldUpdate = await shouldUpdatePrice(lastBlock, blockHeight, lastPrice, price);

      if (shouldUpdate) {
        console.log("\n[CHECK] Should update: " + symbol + " (ID #" + tokenId + ")");
        console.log("[CHECK] Current price info:", priceInfo);
        await updatePrice(symbol, tokenId, arkadikoDecimals, lastBlock, blockHeight, lastPrice, price, undefined, undefined);
      } else {
        console.log("\n[CHECK] Is up to date: " + symbol + " (ID #" + tokenId + ")");
      }
    }
  }

  res.setHeader("Access-Control-Allow-Origin", "*")
  res.status(200).json({ result: "done" })
}

async function shouldUpdatePrice(lastBlock: number, blockHeight: number, lastPrice: number, price: number): Promise<boolean> {

  // Block and price triggers
  let blockTrigger = blockHeight >= lastBlock + config.updateBlockDiff;
  let priceTrigger = Math.abs((lastPrice / price) - 1.0) > config.updatePriceDiff;

  // Do not continue if both triggers are false
  if (!blockTrigger && !priceTrigger) {
    return false
  }

  return true
}


async function mempoolUpdateTx(tokenId: number): Promise<any | undefined> {

  // Get mempool and unanchored transactions
  const unanchoredTxs = await getUnanchoredMicroblockTransactions();
  const mempoolTxs = await getMempoolTransactions(config.managerAddress);
  const allTxs = mempoolTxs.concat(unanchoredTxs);

  // Find oracle transactions
  const oracleContract = config.oracleAddress + '.' + config.oracleContractName;
  const filteredTxs = allTxs.filter((tx: any) => tx.tx_type == 'contract_call' && tx.contract_call.contract_id == oracleContract);

  // Check if given token is currently being updated
  const nonce = await getNonce(config.managerAddress)
  for (const tx of filteredTxs) {
    if (tx.sender_address == config.managerAddress) {
      const txTokenId = tx.contract_call.function_args[1];
      if (txTokenId == tokenId && nonce <= tx.nonce) {
        return tx;
      }
    }
  }

  return undefined
}

async function updatePrice(symbol: string, tokenId: number, decimals: number, lastBlock: number, blockHeight: number, lastPrice: number, price: number, nonce: number | undefined, fee: number | undefined) {

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
    const shouldUpdate = await shouldUpdatePrice(lastBlock, blockHeight, lastPrice, price);
    if (shouldUpdate) {
      console.log("[CHECK] Push price info for " + symbol, ", info:", priceObject);
      const pushResult = pushPriceInfo(priceObject, signatures, nonce, fee);
      console.log("[CHECK] Transaction result:", pushResult);
    }
  }
}
