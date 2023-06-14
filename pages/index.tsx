import Head from 'next/head'
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css'
import { getMinimumSigners, getPriceInfo, getTokenId, getTokenNames } from '@common/oracle';
import { config, tokenDecimals } from '@common/config';
import { getCurrentBlockHeight } from '@common/stacks';
import { getPublicKey } from '@common/helpers';
import { PriceRow } from 'components/price-row';
import { NodeRow } from 'components/node-row';
import { SourceRow } from 'components/source-row';

export default function Home() {

  // ----------------------------------------------
  // State
  // ----------------------------------------------

  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [isLoadingNodes, setIsLoadingNodes] = useState(true);

  const [blockHeight, setBlockHeight] = useState(true);
  const [minimumSigners, setMinimumSigners] = useState(0);

  const [priceRows, setPriceRows] = useState([]);
  const [nodeRows, setNodeRows] = useState([]);
  const [sourceRows, setSourceRows] = useState([]);

  // ----------------------------------------------
  // Fetch info
  // ----------------------------------------------

  // Get on-chain oracle info for all symbols
  async function getOracleInfo(currentBlock: number) {
    var requests = [];
    for (const symbol of config.symbols) {
      requests.push(getSymbolInfo(symbol, currentBlock));
    }
    const result = await Promise.all(requests);
    return result;
  }

  // Get on-chain oracle info for given symbol
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

  // Get info for all nodes
  async function getNodesInfo() {
    var requests = [];
    for (const node of config.nodes) {
      requests.push(getNodeInfo(node));
    }
    const result = await Promise.all(requests);
    return result;
  }

  // Get info for given node
  async function getNodeInfo(nodeUrl: string) {
    const url = nodeUrl + "/api/info";
    const response = await fetch(url, { credentials: 'omit' });
    const json = await response.json();
    json["url"] = nodeUrl;
    return json;
  }

  // ----------------------------------------------
  // Main
  // ----------------------------------------------

  useEffect(() => {

    const fetchInfo = async () => {

      // Get some general info
      const [
        minSigners,
        pubKey,
        currentBlock
      ] = await Promise.all([
        getMinimumSigners(),
        getPublicKey(),
        getCurrentBlockHeight()
      ]);

      setBlockHeight(currentBlock);
      setMinimumSigners(minSigners);

      // Fetch on-chain oracle info
      const oracleInfo = await getOracleInfo(currentBlock);
      const newPriceRows:any = [];
      for (const info of oracleInfo) {
        newPriceRows.push(
          <PriceRow 
            key={info.tokenId}
            tokenId={info.tokenId}
            symbols={info.symbols.join(", ")} 
            decimals={info.oracleDecimals} 
            lastUpdated={info.blocksAgo + " blocks ago (#" + info.lastBlock + ")"} 
            price={"$" + info.lastDollarPrice + " (" + info.lastOraclePrice + ")"}
          />
        )
      }
      setPriceRows(newPriceRows)
      setIsLoadingPrices(false)

      // Fetch node info
      const infoNodes = await getNodesInfo();

      // Create node rows
      const newNodeRows:any = [];
      for (const infoNode of infoNodes) {
        newNodeRows.push(
          <NodeRow 
            key={infoNode.publicKey}
            publicKey={infoNode.publicKey}
            url={infoNode.url}
            currentNode={infoNode.publicKey == pubKey}
            trusted={infoNode.trusted} 
            network={infoNode.network} 
            source={infoNode.source} 
            maxBlockDiff={infoNode.maxBlockDiff}
            maxPriceDiff={infoNode.maxPriceDiff}
          />
        )
      }
      setNodeRows(newNodeRows)

      // Create sources and prices rows 
      const newSourceRows:any = [];
      for (const infoNode of infoNodes) {
        newSourceRows.push(
          <SourceRow 
            key={infoNode.source}
            source={infoNode.source}
            currentNode={infoNode.publicKey == pubKey}
            stx={infoNode.prices['STX']}
            btc={infoNode.prices['BTC']}
            usda={infoNode.prices['USDA']}
            diko={infoNode.prices['DIKO']}
            atAlex={infoNode.prices['auto-alex']}
            atAlexV2={infoNode.prices['auto-alex-v2']}
          />
        )
      }
      setSourceRows(newSourceRows);
      setIsLoadingNodes(false);
    };

    fetchInfo();
  }, []);

  // ----------------------------------------------
  // HTML
  // ----------------------------------------------

  return (
    <div className={styles.container}>
      <Head>
        <title>Arkadiko Oracle Node</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Multisig oracle solution on Stacks."
          key="desc"
        />
      </Head>

      <main className="mt-10 text-center">
        
        {/* 
          HEADER
        */}
        <h1 className={styles.title}>
          <a href="https://arkadiko.finance/" target="_blank" rel="noreferrer">Arkadiko</a> Oracle Node
        </h1>
        <p className="mt-2 text-2xl text-gray-400">
          Multisig oracle solution on Stacks.
        </p>

        {/* 
          ON-CHAIN ORACLE INFO
        */}
        <h2 className="mt-10 text-xl text-gray-600">
          On-chain oracle info
        </h2>
        {isLoadingPrices ? (
          <p className="mb-3 text-sm text-gray-400">
            Loading..
          </p>
        ) : (
          <>
            <p className="mb-3 text-sm text-gray-400">
              current block #{blockHeight}{' | '}
              <a 
                className="text-blue-500" 
                target="_blank" 
                rel="noreferrer" 
                href={`https://explorer.stacks.co/txid/${config.oracleAddress}.${config.oracleContractName}?chain=${config.networkName}`}
              >
                show contract
              </a>
            </p>

            <div className="overflow-x-auto border border-gray-200 rounded-lg text-left">
              <table className="table-auto overflow-scroll w-full divide-y divide-gray-200">
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
          </>
        )}

        {/* 
          ACTIVE ORACLE NODES
        */}
        <h2 className="mt-10 text-xl text-gray-600">
          Active oracle nodes
        </h2>
        {isLoadingNodes ? (
          <p className="mb-3 text-sm text-gray-400">
            Loading..
          </p>
        ) : (
          <>
            <p className="mb-3 text-sm text-gray-400">
              {config.nodes.length} nodes | {minimumSigners} valid signatures needed
            </p>

            <div className="overflow-x-auto border border-gray-200 rounded-lg text-left">
              <table className="table-auto overflow-scroll w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Trusted
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Public key
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
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Link
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {nodeRows}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* 
          SOURCES AND PRICES
        */}
        <h2 className="mt-10 text-xl text-gray-600">
          Sources and prices
        </h2>
        {isLoadingNodes ? (
          <p className="mb-3 text-sm text-gray-400">
            Loading..
          </p>
        ) : (
          <>
            <p className="mb-3 text-sm text-gray-400">
              {config.sourceName} | Arkadiko DEX | Alex DEX
            </p>

            <div className="overflow-x-auto border border-gray-200 rounded-lg text-left">
              <table className="table-auto overflow-scroll w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Source
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      STX
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      BTC
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      USDA
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      DIKO
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      atALEX
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      atALEXv2
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sourceRows}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* 
          FOOTER
        */}
        <p className="mt-10 mb-10 text-sm text-gray-400">
          Find the latest version on {' '}
          <a href="https://github.com/arkadiko-dao/oracle-node" target="_blank" rel="noreferrer" className="text-blue-500">Github</a>
        </p>

      </main>
    </div>
  )
}
