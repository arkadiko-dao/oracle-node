import type { NextApiRequest, NextApiResponse } from 'next'
import secp256k1 from 'secp256k1';
import { randomBytes } from 'crypto';

type Data = {
  privateKey: string,
  publicKey: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let privateKey
  do {
    privateKey = randomBytes(32)
  } while (!secp256k1.privateKeyVerify(privateKey))
  const privateKeyString = privateKey.toString("hex");

  // get the public key in a compressed format
  const publicKey = secp256k1.publicKeyCreate(privateKey)
  const publicKeyString = Buffer.from(publicKey).toString("hex");

  res.status(200).json({ privateKey: privateKeyString, publicKey: publicKeyString })
}
