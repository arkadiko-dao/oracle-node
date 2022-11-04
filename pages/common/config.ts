import dotenv from 'dotenv';
dotenv.config();

import { StacksMainnet, StacksMocknet, StacksTestnet } from "@stacks/network";

const network = process.env.NEXT_PUBLIC_NETWORK as 'mocknet' | 'testnet' | 'mainnet';

const mocknet = {
  network: new StacksMocknet(),
  arkadikoAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
};

const testnet = {
  network: new StacksTestnet(),
  arkadikoAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
}

const mainnet = {
  network: new StacksMainnet(),
  arkadikoAddress: "SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR",
}

const networks = {
  mocknet,
  testnet,
  mainnet
}

export const config = networks[network];
