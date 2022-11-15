import { config } from './config';

export async function getCurrentBlockHeight(): Promise<any> {
  const url = `${config.stacksApiBase}/extended/v1/block?limit=1`;
  const response = await fetch(url, { credentials: 'omit' });
  const data = await response.json();
  return data.results[0].height;
}

export async function getMempoolTransactions(): Promise<any> {
  // Start with first page
  const url = `${config.stacksApiBase}/extended/v1/tx/mempool?limit=200`;
  const response = await fetch(url, { credentials: 'omit' });
  const data = await response.json();

  // Calculate number of pages
  const total = data.total;
  const pages = Math.floor(total / 200) + 1;

  // Results
  var result = data.results;

  // Loop over every page
  for (let page = 1; page < pages; page++) {
    const url = `${config.stacksApiBase}/extended/v1/tx/mempool?limit=200&offset=${page*200}`;
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
