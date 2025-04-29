import Head from 'next/head'
import { useEffect, useState } from 'react';
import { getMinimumSigners, getPriceInfo, getTokenId, getTokenNames } from '@common/oracle';
import { config, tokenInfo } from '@common/config';
import { getCurrentBlockHeight } from '@common/stacks';
import PriceRow from 'components/price-row';
import NodeRow from 'components/node-row';
import SourceRow from 'components/source-row';
import ToolTip from 'components/tooltip';

interface PriceData {
  prices: Record<string, any>;
}

export default function Home() {
  const [prices, setPrices] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  // ----------------------------------------------
  // Main
  // ----------------------------------------------

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('/api/oracle-v2-4');
        const data: PriceData = await response.json();
        console.log("GOT PRICES", data.prices);
        setPrices(data.prices);
      } catch (error) {
        console.error('Error fetching prices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  // ----------------------------------------------
  // HTML
  // ----------------------------------------------

  return (
    <div className='p-8'>
      <Head>
        <title>Arkadiko Oracle Node</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Multisig oracle solution on Stacks."
          key="desc"
        />
      </Head>

      <main className="mt-10">
        {/* 
          HEADER
        */}
        <h1 className="font-medium text-6xl text-center">
          <a className="text-blue-600" href="https://arkadiko.finance/" target="_blank" rel="noreferrer">Arkadiko</a> Oracle V2.4
        </h1>
        <p className="mt-2 text-2xl text-gray-400 text-center">
          Prices from Pyth, DIA and StackingDAO.
        </p>

        {/* 
          PRICES TABLE
        */}
        <div className="mt-8">
          {loading ? (
            <p className="text-center">Loading prices...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raw Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Decimals</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Object.entries(prices).map(([symbol, data]) => (
                    <tr key={symbol} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{symbol}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data["last-price"]}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data["decimals"]}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(symbol === 'BTC' || symbol === 'xBTC' || symbol === 'sBTC') 
                          ? (data["last-price"]/data["decimals"]) * 100 
                          : data["last-price"]/data["decimals"]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 
          FOOTER
        */}
        <p className="mt-10 mb-10 text-sm text-gray-400 text-center">
          Find the latest version on {' '}
          <a href="https://github.com/arkadiko-dao/oracle-node" target="_blank" rel="noreferrer" className="text-blue-500">Github</a>
        </p>
      </main>
    </div>
  )
}
