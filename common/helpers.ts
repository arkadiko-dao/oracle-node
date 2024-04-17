import secp256k1 from 'secp256k1';
import { config } from "./config";
import { isTrustedOracle } from "./oracle";

export function getPublicKey(): string {

  // Private key to sign
  const privateKey = Buffer.from(config.signKey, "hex");

  // Get the public key in a compressed format
  const publicKey = secp256k1.publicKeyCreate(privateKey);
  const publicKeyString = Buffer.from(publicKey).toString("hex");
  console.log('wtf', publicKeyString);
  return publicKeyString;
}

export async function isOracleTrusted(): Promise<boolean> {

  // Get public key
  const publicKey = getPublicKey();

  // Check if trusted by oracle
  const trusted = await isTrustedOracle(publicKey);
  return trusted
}
