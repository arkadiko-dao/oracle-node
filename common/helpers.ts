import { config } from "./config";
import secp256k1 from 'secp256k1';
import { isTrustedOracle } from "./oracle";

export function getPublicKey() {

  // Private key to sign
  const privateKey = Buffer.from(config.signKey, "hex");

  // Get the public key in a compressed format
  const publicKey = secp256k1.publicKeyCreate(privateKey);
  const publicKeyString = Buffer.from(publicKey).toString("hex");
  return publicKeyString;
}

export async function isOracleTrusted() {

  // Get public key
  const publicKey = getPublicKey();

  // Check if trusted by oracle
  const trusted = await isTrustedOracle(publicKey);
  return trusted
}
