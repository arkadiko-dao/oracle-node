import Head from 'next/head'
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css'
import { getMinimumSigners, getPriceInfo, getTokenId, getTokenNames } from '@common/oracle';
import { config, tokenDecimals } from '@common/config';
import { getCurrentBlockHeight } from '@common/stacks';
import { getPublicKey } from '@common/helpers';
import { PriceRow } from 'components/price-row';

export default function Home() {

  const [isLoading, setIsLoading] = useState(true);
  const [blockHeight, setBlockHeight] = useState(true);
  const [minimumSigners, setMinimumSigners] = useState(0);

  const [priceRows, setPriceRows] = useState([]);

  async function getSymbolInfo(symbol: string, currentBlock: number) {
    const priceInfo = await getPriceInfo(symbol);
    const tokenId = await getTokenId(symbol);
    const tokenNamesResult = await getTokenNames(tokenId);

    var tokenNames = []
    for (const nameInfo of tokenNamesResult) {
      tokenNames.push(nameInfo.value);
    }

    return {
      tokenId: tokenId,
      symbols: tokenNames,
      lastBlock: priceInfo['last-block'].value,
      blocksAgo: currentBlock - priceInfo['last-block'].value,
      lastOraclePrice: priceInfo['last-price'].value,
      lastDollarPrice: priceInfo['last-price'].value / Math.pow(10, tokenDecimals[symbol]),
      oracleDecimals: priceInfo['decimals'].value,
      priceDecimals: tokenDecimals[symbol]
    }
  }

  useEffect(() => {

    const fetchInfo = async () => {
      const currentBlock = await getCurrentBlockHeight();
      const [
        minSigners,
        pubKey,
        infoStx,
        infoBtc,
        infoUsda,
        infoDiko,
        infoAtAlex
      ] = await Promise.all([
        getMinimumSigners(),
        getPublicKey(),
        getSymbolInfo("STX", currentBlock),
        getSymbolInfo("BTC", currentBlock),
        getSymbolInfo("USDA", currentBlock),
        getSymbolInfo("DIKO", currentBlock),
        getSymbolInfo("auto-alex", currentBlock),
      ]);

      setBlockHeight(currentBlock);
      setMinimumSigners(minSigners);

      const newPriceRows:any = [];
      newPriceRows.push(
        <PriceRow 
          tokenId={infoStx.tokenId}
          symbols={infoStx.symbols.join(", ")} 
          decimals={infoStx.oracleDecimals} 
          lastUpdated={infoStx.blocksAgo + " blocks ago (#" + infoStx.lastBlock + ")"} 
          price={"$" + infoStx.lastDollarPrice + " (" + infoStx.lastOraclePrice + ")"}
        />
      )
      newPriceRows.push(
        <PriceRow 
          tokenId={infoBtc.tokenId}
          symbols={infoBtc.symbols.join(", ")} 
          decimals={infoBtc.oracleDecimals} 
          lastUpdated={infoBtc.blocksAgo + " blocks ago (#" + infoBtc.lastBlock + ")"} 
          price={"$" + infoBtc.lastDollarPrice + " (" + infoBtc.lastOraclePrice + ")"}
        />
      )
      newPriceRows.push(
        <PriceRow 
          tokenId={infoUsda.tokenId}
          symbols={infoUsda.symbols.join(", ")} 
          decimals={infoUsda.oracleDecimals} 
          lastUpdated={infoUsda.blocksAgo + " blocks ago (#" + infoUsda.lastBlock + ")"} 
          price={"$" + infoUsda.lastDollarPrice + " (" + infoUsda.lastOraclePrice + ")"}
        />
      )
      newPriceRows.push(
        <PriceRow 
          tokenId={infoDiko.tokenId}
          symbols={infoDiko.symbols.join(", ")} 
          decimals={infoDiko.oracleDecimals} 
          lastUpdated={infoDiko.blocksAgo + " blocks ago (#" + infoDiko.lastBlock + ")"} 
          price={"$" + infoDiko.lastDollarPrice + " (" + infoDiko.lastOraclePrice + ")"}
        />
      )
      newPriceRows.push(
        <PriceRow 
          tokenId={infoAtAlex.tokenId}
          symbols={infoAtAlex.symbols.join(", ")} 
          decimals={infoAtAlex.oracleDecimals} 
          lastUpdated={infoAtAlex.blocksAgo + " blocks ago (#" + infoAtAlex.lastBlock + ")"} 
          price={"$" + infoAtAlex.lastDollarPrice + " (" + infoAtAlex.lastOraclePrice + ")"}
        />
      )
      setPriceRows(newPriceRows)

      setIsLoading(false);
    };

    fetchInfo();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Arkadiko Oracle Node</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mt-10 text-center">
        <h1 className={styles.title}>
          <a href="https://arkadiko.finance/" target="_blank">Arkadiko</a> Oracle Node
        </h1>

        <p className="mt-2 text-2xl text-gray-400">
          Multisig oracle solution on Stacks.
        </p>

        {isLoading ? (
          <p className="mt-10 text-xl text-gray-400">
            Loading oracle info..
          </p>
        ) : (
          <>
            <h2 className="mt-10 text-xl text-gray-600">
              On chain oracle info
            </h2>
            <p className="mb-3 text-sm text-gray-400">
              current block #{blockHeight}
            </p>

            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 text-left">
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Symbols
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Decimals
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Last updated
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {priceRows}
                  </tbody>
                </table>
              </div>
            </div>

            <h2 className="mt-10 text-xl text-gray-600">
              Active oracle nodes
            </h2>
            <p className="mb-3 text-sm text-gray-400">
              {config.nodes.length} nodes, {minimumSigners} valid signatures needed
            </p>

            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 text-left">
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Public key
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Trusted
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Network
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Source
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Max block diff
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Max price diff
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        0338c6c30f619819ae9f95e0a506207f95ff22927dee0e2303050a7a1cce6056d8
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        yes
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        mainnet
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        coingecko
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        5
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        0.025
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

      </main>
    </div>
  )
}
