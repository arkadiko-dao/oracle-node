import type { NextApiRequest, NextApiResponse } from 'next'
import { getPriceInfo, getSignableMessage, getTokenNames } from '@common/oracle';
import secp256k1 from 'secp256k1';
import { config, tokenInfo } from '@common/config';
import { getCurrentBlockHeight } from '@common/stacks';

type Data = {
  signature: string,
  publicKey: string
}

type DataError = {
  error: string,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | DataError>
) {
  // Get params
  const { block, tokenId, price, decimals } = req.query;
  console.log("\n[SIGN] Input:", {block: block, tokenId: tokenId, price: price, decimals: decimals});

  // Check input
  const inputError = await checkInput(Number(block), Number(tokenId), Number(price), Number(decimals));
  console.log("[SIGN] Check input:", inputError == undefined ? "success" : "error: " + inputError);
  if (inputError !== undefined) {
    res.status(404).json(inputError);
    return;
  }

  // Create price object
  const priceObject = {
    block: Number(block),
    tokenId: Number(tokenId),
    price: Number(price),
    decimals: Number(decimals)
  }

  // Get signable message from oracle contract
  const signableMessage = await getSignableMessage(priceObject);
  
  // Message to sign
  const message = Buffer.from(signableMessage.replace("0x", ""), "hex");

  // Private key to sign
  const privateKey = Buffer.from(config.signKey, "hex");

  // Get the public key in a compressed format
  const publicKey = secp256k1.publicKeyCreate(privateKey);
  const publicKeyString = Buffer.from(publicKey).toString("hex");

  // Get signature
  const signatureObject = secp256k1.ecdsaSign(message, privateKey);

  // Append recovery ID to signature
  const recoveryId = new Uint8Array([signatureObject.recid]);
  var mergedArray = new Uint8Array(signatureObject.signature.length + recoveryId.length);
  mergedArray.set(signatureObject.signature);
  mergedArray.set(recoveryId, signatureObject.signature.length);
  const fullSignature = Buffer.from(mergedArray).toString("hex");

  console.log("[SIGN] Signature:", fullSignature);

  res.setHeader("Access-Control-Allow-Origin", "*")
  res.status(200).json({ signature: fullSignature, publicKey: publicKeyString })
}

async function checkInput(block: number, tokenId: number, price: number, decimals: number): Promise<DataError | undefined> {
  try {
    // Check if block correct
    const currentBlock = await getCurrentBlockHeight();
    if (Math.abs(currentBlock - block) >= config.inputMaxBlockDiff) {
      console.log("[SIGN] Wrong input - Block: " + block + ", current block: " + currentBlock);
      return { error: "wrong input - block" };
    }

    // Get token names
    const tokenNames = await getTokenNames(Number(tokenId));

    // Get supported symbol
    var symbol = tokenNames[0].value;
    for (const tokenName of tokenNames) {
      if (config.symbols.includes(tokenName.value)) {
        symbol = tokenName.value;
      }
    }

    // Get on chain price info
    const priceInfo = await getPriceInfo(symbol);

    // Check if decimals correct
    const arkadikoDecimals = priceInfo.decimals.value == 0 ? tokenInfo[symbol].arkadikoDecimals : priceInfo.decimals.value;
    if (arkadikoDecimals != decimals) {
      console.log("[SIGN] Wrong input - Decimals: " + decimals + ", on chain decimals: " + arkadikoDecimals);
      return { error: "wrong input - decimals" };
    }

    // Check if price within range
    const sourcePrice = await config.source.fetchPrice(symbol) as number;
    if (Math.abs(price / sourcePrice - 1) > config.inputMaxPriceDiff) {
      console.log("[SIGN] Wrong input - Price: " + price + ", source price: " + sourcePrice);
      return { error: "wrong input - price" };
    }

    return undefined;
  } catch (e) {
    console.log("[SIGN] Check input failed:", e);
    return { error: "check input failed" };
  }
}
