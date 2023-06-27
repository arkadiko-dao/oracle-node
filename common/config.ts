import dotenv from 'dotenv';
dotenv.config();

import { StacksMainnet, StacksMocknet, StacksTestnet } from "@stacks/network";
import { SourceCoinMarketCap } from '@sources/coinmarketcap';
import { SourceCoinGecko } from '@sources/coingecko';
import { SourceRedstone } from '@sources/redstone';
import { SourceCoinCap } from '@sources/coincap';
import { SourceCoinbase } from '@sources/coinbase';
import { SourceKucoin } from '@sources/kucoin';
import { SourceCryptoCompare } from '@sources/cryptocompare';

const network = process.env.NEXT_PUBLIC_NETWORK as 'mocknet' | 'testnet' | 'mainnet';
const source = process.env.NEXT_PUBLIC_SOURCE as 'coinmarketcap' | 'coingecko' | 'coinbase' | 'kucoin' | 'coincap' | 'cryptocompare' | 'redstone';

// Map source names to objects
function getSource() {
  if (source == "coinmarketcap") {
    return new SourceCoinMarketCap();
  } else if (source == "coingecko") {
    return new SourceCoinGecko();
  } else if (source == "coinbase") {
    return new SourceCoinbase();
  } else if (source == "kucoin") {
    return new SourceKucoin();
  } else if (source == "coincap") {
    return new SourceCoinCap();
  } else if (source == "cryptocompare") {
    return new SourceCryptoCompare();
  }
  return new SourceRedstone();
}

// Token info
export const tokenInfo: { [key: string]: { decimals: number, arkadikoDecimals: number, tooltip?: string } } = {
  "STX": { decimals: 6, arkadikoDecimals: 1000000 },
  "BTC": { decimals: 6, arkadikoDecimals: 100000000 },
  "DIKO": { decimals: 6, arkadikoDecimals: 1000000 },
  "USDA": { decimals: 6, arkadikoDecimals: 1000000, tooltip: "Using ALEX xUSD/USDA stable pool" },
  "STX/USDA": { decimals: 6, arkadikoDecimals: 1000000, tooltip: "Using STX/USDA Arkadiko swap pool" },
  "auto-alex": { decimals: 8, arkadikoDecimals: 10000000000 },
  "auto-alex-v2": { decimals: 8, arkadikoDecimals: 10000000000 }
} 

// Mocknet config
const mocknet = {
  symbols: ["STX", "BTC", "USDA", "STX/USDA", "DIKO", "auto-alex", "auto-alex-v2"],
  nodes: [
    "http://localhost:3000/api/sign",
    "http://localhost:3000/api/sign",
    "http://localhost:3000/api/sign"
  ],
  signKey: process.env.SIGN_KEY as string,
  networkName: network,
  network: new StacksMocknet(),
  stacksApiBase: "http://localhost:3999",
  oracleAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  oracleContractName: "arkadiko-oracle-v2-2",
  arkadikoAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  alexAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  managerAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  managerKey: "753b7cc01a1a2e86221266a154af739463fce51219d97e4f856cd7200c3bd2a601",
  source: getSource(),
  sourceName: source,
  inputMaxBlockDiff: 3,
  inputMaxPriceDiff: 0.025,
  updateBlockDiff: 6,
  updatePriceDiff: 0.1
};

// Testnet config
const testnet = {
  symbols: ["STX", "BTC", "USDA", "STX/USDA", "DIKO", "auto-alex", "auto-alex-v2"],
  nodes: [
    "http://localhost:3000/api/sign",
    "http://localhost:3000/api/sign",
    "http://localhost:3000/api/sign"
  ],
  signKey: process.env.SIGN_KEY as string,
  networkName: network,
  network: new StacksTestnet(),
  stacksApiBase: "https://stacks-node-api.testnet.stacks.co",
  oracleAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  oracleContractName: "arkadiko-oracle-v2-2",
  arkadikoAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  alexAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  managerAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  managerKey: process.env.STACKS_KEY as string,
  source: getSource(),
  sourceName: source,
  inputMaxBlockDiff: 3,
  inputMaxPriceDiff: 0.025,
  updateBlockDiff: 6,
  updatePriceDiff: 0.1
}

// Mainnet config
const mainnet = {
  symbols: ["STX", "BTC", "USDA", "STX/USDA", "DIKO", "auto-alex", "auto-alex-v2"],
  nodes: [
    "https://arkadiko-oracle-node-redstone.herokuapp.com",
    "https://arkadiko-oracle-node-coingecko.herokuapp.com",
    "https://arkadiko-oracle-node-cmc.herokuapp.com",
    "https://arkadiko-oracle-node-coincap.herokuapp.com",
    "https://arkadiko-oracle-node-ccompare.herokuapp.com"
  ],
  signKey: process.env.SIGN_KEY as string,
  networkName: network,
  network: new StacksMainnet(),
  stacksApiBase: "https://stacks-node-api.stacks.co", 
  oracleAddress: "SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR",
  oracleContractName: "arkadiko-oracle-v2-2",
  arkadikoAddress: "SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR",
  alexAddress: "SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9",
  managerAddress: "SP2YYZRZ210D7CPG5M8TDJE8V694B6AVGAKM99MH9",
  managerKey: process.env.STACKS_KEY as string,
  source: getSource(),
  sourceName: source,
  inputMaxBlockDiff: 3,
  inputMaxPriceDiff: 0.025,
  updateBlockDiff: 6,
  updatePriceDiff: 0.1
}

const networks = {
  mocknet,
  testnet,
  mainnet
}

export const config = networks[network];
