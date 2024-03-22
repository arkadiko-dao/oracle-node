import { cheetah } from '@nieldeckx/stacks-cheetah'

export async function getNonce(address: string) {
  const data = await cheetah.callApi(`/v2/accounts/${address}?proof=0`)
  return data.nonce;
}

export async function getCurrentBlockHeight(): Promise<any> {
  const data = await cheetah.callApi(`/extended/v1/block?limit=1`)
  return data.results[0].burn_block_height;
}

export async function getMempoolTransactions(address: string): Promise<any> {
  // Start with first page
  const data = await cheetah.callApi(`/extended/v1/tx/mempool?limit=50&sender_address=${address}`)

  // Calculate number of pages
  const total = data.total;
  
  // Max 20 pages to avoid API limit
  // const pages = Math.floor(total / 50) + 1;
  const pages = Math.min(Math.floor(total / 50) + 1, 10);


  // Results
  var result = data.results;

  // Loop over every page
  for (let page = 1; page < pages; page++) {
    const data = await cheetah.callApi(`/extended/v1/tx/mempool?limit=50&offset=${page * 50}&sender_address=${address}`)
    result = result.concat(data.results);
  }

  return result;
}

export async function getUnanchoredMicroblockTransactions(): Promise<any> {
  const data = await cheetah.callApi(`/extended/v1/microblock/unanchored/txs`)
  return data.results;
}
