import { config } from './config';

export async function getNonce(address: string) {
  const url = `${config.stacksApiBase}/v2/accounts/${address}?proof=0`;
  const response = await fetch(url, { credentials: 'omit' });
  const data = await response.json();
  return data.nonce;
}

export async function getCurrentBlockHeight(): Promise<any> {
  const url = `${config.stacksApiBase}/extended/v1/block?limit=1`;
  const response = await fetch(url, { credentials: 'omit' });
  const data = await response.json();
  return data.results[0].burn_block_height;
}

export async function getMempoolTransactions(): Promise<any> {
  // Start with first page
  const url = `${config.stacksApiBase}/extended/v1/tx/mempool?limit=50`;
  const response = await fetch(url, { credentials: 'omit' });
  const data = await response.json();

  // Calculate number of pages
  const total = data.total;
  
  // Max 20 pages to avoid API limit
  // const pages = Math.floor(total / 50) + 1;
  const pages = Math.min(Math.floor(total / 50) + 1, 10);


  // Results
  var result = data.results;

  // Loop over every page
  for (let page = 1; page < pages; page++) {
    const url = `${config.stacksApiBase}/extended/v1/tx/mempool?limit=50&offset=${page * 50}`;
    const response = await fetch(url, { credentials: 'omit' });
    const data = await response.json();
    result = result.concat(data.results);
  }

  return result;
}

export async function getUnanchoredMicroblockTransactions(): Promise<any> {
  const url = `${config.stacksApiBase}/extended/v1/microblock/unanchored/txs`;
  const response = await fetch(url, { credentials: 'omit' });
  const data = await response.json();
  return data.results;
}
