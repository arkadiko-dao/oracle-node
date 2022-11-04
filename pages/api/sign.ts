import type { NextApiRequest, NextApiResponse } from 'next'
import { getSignableMessage } from '../common/oracle';
import secp256k1 from 'secp256k1';
import { config } from '../common/config';

type Data = {
  signature: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Get params
  const { block, tokenId, price, decimals } = req.query;

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
  const message = Buffer.from(signableMessage, "hex");

  // Private key to sign
  const privateKey = Buffer.from(config.signKey, "hex");

  // Get the public key in a compressed format
  const publicKey = secp256k1.publicKeyCreate(privateKey)

  // Get signature
  const signatureObject = secp256k1.ecdsaSign(message, privateKey)

  // Append recovery ID to signature
  const recoveryId = new Uint8Array([signatureObject.recid]);
  var mergedArray = new Uint8Array(signatureObject.signature.length + recoveryId.length);
  mergedArray.set(signatureObject.signature);
  mergedArray.set(recoveryId, signatureObject.signature.length);
  const fullSignature = Buffer.from(mergedArray).toString("hex");

  res.status(200).json({ signature: fullSignature })
}
