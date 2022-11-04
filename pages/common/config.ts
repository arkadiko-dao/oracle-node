import dotenv from 'dotenv';
dotenv.config();

import { StacksMainnet, StacksMocknet, StacksTestnet } from "@stacks/network";

const network = process.env.NETWORK as 'mocknet' | 'testnet' | 'mainnet';

const mocknet = {
  signKey: process.env.SIGN_KEY as string,
  network: new StacksMocknet(),
  stacksApiBase: "http://localhost:3999",
  arkadikoAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
};

const testnet = {
  signKey: process.env.SIGN_KEY as string,
  network: new StacksTestnet(),
  stacksApiBase: "https://stacks-node-api.testnet.stacks.co",
  arkadikoAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
}

const mainnet = {
  signKey: process.env.SIGN_KEY as string,
  network: new StacksMainnet(),
  stacksApiBase: "https://stacks-node-api.stacks.co", 
  arkadikoAddress: "SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR",
}

const networks = {
  mocknet,
  testnet,
  mainnet
}

export const config = networks[network];
