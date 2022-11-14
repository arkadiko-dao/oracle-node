import type { NextApiRequest, NextApiResponse } from 'next'
import { getPriceInfo, getSignableMessage, getTokenNames } from '../common/oracle';
import secp256k1 from 'secp256k1';
import { setup } from '../common/setup';
import { getCurrentBlockHeight } from '../common/stacks';

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

  // Check input
  const inputError = await checkInput(Number(block), Number(tokenId), Number(price), Number(decimals));
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
  const privateKey = Buffer.from(setup.signKey, "hex");

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

  res.status(200).json({ signature: fullSignature, publicKey: publicKeyString })
}

async function checkInput(block: number, tokenId: number, price: number, decimals: number): Promise<DataError | undefined> {
  try {
    // Check if block correct
    const currentBlock = await getCurrentBlockHeight();
    if (Math.abs(currentBlock - block) > setup.inputMaxBlockDiff) {
      return { error: "wrong input - block" };
    }

    // Get token names
    const tokenNames = await getTokenNames(Number(tokenId));

    // Get supported symbol
    var symbol = tokenNames[0];
    for (const tokenName of tokenNames) {
      if (setup.symbols.includes(tokenName)) {
        symbol = tokenName;
      }
    }

    // Get on chain price info
    const priceInfo = await getPriceInfo(symbol);

    // Check if decimals correct
    if (priceInfo.decimals.value != decimals) {
      return { error: "wrong input - decimals" };
    }

    // Check if price within range
    const sourcePrice = await setup.source?.fetchPrice(symbol, decimals) as number;
    if (Math.abs(price / sourcePrice - 1) > setup.inputMaxPriceDiff) {
      return { error: "wrong input - price" };
    }

    return undefined;
  } catch (e) {
    return undefined;
  }
}
