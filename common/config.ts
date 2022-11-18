import dotenv from 'dotenv';
dotenv.config();

import { StacksMainnet, StacksMocknet, StacksTestnet } from "@stacks/network";
import { SourceCoinMarketCap } from '@sources/coinmarketcap';
import { SourceCoinGecko } from '@sources/coingecko';
import { SourceCoinApi } from '@sources/coinapi';
import { SourceCryptoCompare } from '@sources/cryptocompare';
import { SourceRedstone } from '@sources/redstone';
import { SourceCoinCap } from '@sources/coincap';

const network = process.env.NEXT_PUBLIC_NETWORK as 'mocknet' | 'testnet' | 'mainnet';
const source = process.env.NEXT_PUBLIC_SOURCE as 'coinmarketcap' | 'coingecko' | 'coinapi' | 'cryptocompare' | 'coincap' | 'redstone';

// Map source names to objects
function getSource() {
  if (source == "coinmarketcap") {
    return new SourceCoinMarketCap();
  } else if (source == "coingecko") {
    return new SourceCoinGecko();
  } else if (source == "coinapi") {
    return new SourceCoinApi();
  } else if (source == "cryptocompare") {
    return new SourceCryptoCompare();
  } else if (source == "coincap") {
    return new SourceCoinCap();
  }
  return new SourceRedstone();
}

// Number of decimals to use for price representation on chain
export const tokenDecimals: { [key: string]: number } = {
  "STX": 6,
  "BTC": 6,
  "DIKO": 6,
  "USDA": 6,
  "auto-alex": 8
} 

// Mocknet config
const mocknet = {
  symbols: ["STX", "BTC", "USDA", "DIKO", "auto-alex"],
  nodes: [
    "http://localhost:3000/api/sign",
    "http://localhost:3000/api/sign",
    "http://localhost:3000/api/sign"
  ],
  signKey: process.env.NEXT_PUBLIC_SIGN_KEY as string,
  network: new StacksMocknet(),
  stacksApiBase: "http://localhost:3999",
  arkadikoAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  alexAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  managerAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  managerKey: "753b7cc01a1a2e86221266a154af739463fce51219d97e4f856cd7200c3bd2a601",
  source: getSource(),
  sourceName: source,
  inputMaxBlockDiff: 5,
  inputMaxPriceDiff: 0.025
};

// Testnet config
const testnet = {
  symbols: ["STX", "BTC", "USDA", "DIKO", "auto-alex"],
  nodes: [
    "http://localhost:3000/api/sign",
    "http://localhost:3000/api/sign",
    "http://localhost:3000/api/sign"
  ],
  signKey: process.env.NEXT_PUBLIC_SIGN_KEY as string,
  network: new StacksTestnet(),
  stacksApiBase: "https://stacks-node-api.testnet.stacks.co",
  arkadikoAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  alexAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  managerAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  managerKey: process.env.NEXT_PUBLIC_STACKS_KEY as string,
  source: getSource(),
  sourceName: source,
  inputMaxBlockDiff: 5,
  inputMaxPriceDiff: 0.025
}

// Mainnet config
const mainnet = {
  symbols: ["STX", "BTC", "USDA", "DIKO", "auto-alex"],
  nodes: [
    "https://arkadiko-oracle-node-redstone.herokuapp.com",
    "https://akradiko-oracle-node-coingecko.herokuapp.com",
    "https://akradiko-oracle-node-cmc.herokuapp.com",
    "https://arkadiko-oracle-node-coincap.herokuapp.com",
    "https://arkadiko-oracle-node-coinapi.herokuapp.com"
  ],
  signKey: process.env.NEXT_PUBLIC_SIGN_KEY as string,
  network: new StacksMainnet(),
  stacksApiBase: "https://stacks-node-api.stacks.co", 
  arkadikoAddress: "SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR",
  alexAddress: "SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9",
  managerAddress: "SP2YYZRZ210D7CPG5M8TDJE8V694B6AVGAKM99MH9",
  managerKey: process.env.NEXT_PUBLIC_STACKS_KEY as string,
  source: getSource(),
  sourceName: source,
  inputMaxBlockDiff: 5,
  inputMaxPriceDiff: 0.025
}

const networks = {
  mocknet,
  testnet,
  mainnet
}

export const config = networks[network];
