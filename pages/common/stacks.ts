import { config } from './config';

export async function getCurrentBlockHeight(): Promise<any> {
  const url = `${config.stacksApiBase}/extended/v1/block?limit=1`;
  const response = await fetch(url, { credentials: 'omit' });
  const data = await response.json();
  return data.results[0].height;
}

export async function getMempoolTransactions(): Promise<any> {
  const url = `${config.stacksApiBase}/extended/v1/tx/mempool?limit=200`;
  const response = await fetch(url, { credentials: 'omit' });
  const data = await response.json();
  return data.results;
}
