import dotenv from 'dotenv';
dotenv.config();

import { StacksMainnet, StacksMocknet, StacksTestnet } from "@stacks/network";
import { SourceCoinMarketCap } from '../sources/coinmarketcap';
import { SourceCoinGecko } from '../sources/coingecko';

const network = process.env.NETWORK as 'mocknet' | 'testnet' | 'mainnet';
const source = process.env.SOURCE as 'coinmarketcap' | 'coingecko';

function getSource() {
  if (source == "coinmarketcap") {
    return new SourceCoinMarketCap();
  } else if (source == "coingecko") {
    return new SourceCoinGecko();
  }
}

const mocknet = {
  symbols: ["STX", "BTC", "DIKO", "USDA", "auto-alex"],
  // TODO: actual nodes
  nodes: [
    "http://localhost:3000/api/sign",
    "http://localhost:3000/api/sign",
    "http://localhost:3000/api/sign"
  ],
  signKey: process.env.SIGN_KEY as string,
  network: new StacksMocknet(),
  stacksApiBase: "http://localhost:3999",
  arkadikoAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  alexAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  managerAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  managerKey: "753b7cc01a1a2e86221266a154af739463fce51219d97e4f856cd7200c3bd2a601",
  source: getSource(),
};

const testnet = {
  symbols: ["STX", "BTC", "DIKO", "USDA", "auto-alex"],
  // TODO: actual nodes
  nodes: [
    "http://localhost:3000/api/sign",
    "http://localhost:3000/api/sign",
    "http://localhost:3000/api/sign"
  ],
  signKey: process.env.SIGN_KEY as string,
  network: new StacksTestnet(),
  stacksApiBase: "https://stacks-node-api.testnet.stacks.co",
  arkadikoAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  alexAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  managerAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  managerKey: process.env.STACKS_KEY as string,
  source: getSource(),
}

const mainnet = {
  symbols: ["STX", "BTC", "DIKO", "USDA", "auto-alex"],
  // TODO: actual nodes
  nodes: [
    "http://localhost:3000/api/sign",
    "http://localhost:3000/api/sign",
    "http://localhost:3000/api/sign"
  ],
  signKey: process.env.SIGN_KEY as string,
  network: new StacksMainnet(),
  stacksApiBase: "https://stacks-node-api.stacks.co", 
  arkadikoAddress: "SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR",
  alexAddress: "SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9",
  managerAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  managerKey: process.env.STACKS_KEY as string,
  source: getSource(),
}

const networks = {
  mocknet,
  testnet,
  mainnet
}

export const config = networks[network];
