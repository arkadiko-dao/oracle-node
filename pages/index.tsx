import Head from 'next/head'
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css'
import { getPriceInfo } from './common/oracle';
import { getCurrentBlockHeight } from './common/stacks';

export default function Home() {

  const [isLoading, setIsLoading] = useState(true);
  const [blockHeight, setBlockHeight] = useState(true);

  const [stxPrice, setStxPrice] = useState({});
  const [xstxPrice, setXstxPrice] = useState({});
  const [btcPrice, setBtcPrice] = useState({});
  const [dikoPrice, setDikoPrice] = useState({});
  const [usdaPrice, setUsdaPrice] = useState({});
  const [atAlexPrice, setAtAlexPrice] = useState({});


  useEffect(() => {
    const fetchInfo = async () => {
      const [
        currentBlock,
        priceStx,
        priceXstx,
        priceBtc,
        priceDiko,
        priceUsda,
        priceAtAlex
      ] = await Promise.all([
        getCurrentBlockHeight(),
        getPriceInfo("STX"),
        getPriceInfo("xSTX"),
        getPriceInfo("xBTC"),
        getPriceInfo("DIKO"),
        getPriceInfo("USDA"),
        getPriceInfo("auto-alex"),
      ]);
      setBlockHeight(currentBlock);

      setStxPrice(priceStx);
      setXstxPrice(priceXstx);
      setBtcPrice(priceBtc);
      setDikoPrice(priceDiko);
      setUsdaPrice(priceUsda);
      setAtAlexPrice(priceAtAlex);

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

      <main className={styles.main}>
        <h1 className={styles.title}>
          <a href="https://arkadiko.finance/">Arkadiko</a> Oracle Node
        </h1>

        <p className={styles.description}>
          Multisig oracle solution on Stacks.
        </p>

        {isLoading ? (
          <p>
            Loading oracle prices..
          </p>
        ) : (
          <table style={{textAlign: "center"}}>
            <tbody>
              <tr>
                <td style={{width: "100px"}}><b>Symbol</b></td>
                <td style={{width: "150px"}}><b>Decimals</b></td>
                <td style={{width: "200px"}}><b>Last Updated</b></td>
                <td style={{width: "200px"}}><b>Price</b></td>
              </tr>
              <tr>
                <td>STX</td>
                <td>{stxPrice['decimals'].value}</td>
                <td>{stxPrice['last-block'].value} ({blockHeight - stxPrice['last-block'].value} blocks ago)</td>
                <td>{stxPrice['last-price'].value} (${stxPrice['last-price'].value / stxPrice['decimals'].value})</td>
              </tr>
              <tr>
                <td>xSTX</td>
                <td>{xstxPrice['decimals'].value}</td>
                <td>{xstxPrice['last-block'].value} ({blockHeight - xstxPrice['last-block'].value} blocks ago)</td>
                <td>{xstxPrice['last-price'].value} (${xstxPrice['last-price'].value / xstxPrice['decimals'].value})</td>
              </tr>
              <tr>
                <td>xBTC</td>
                <td>{btcPrice['decimals'].value}</td>
                <td>{btcPrice['last-block'].value} ({blockHeight - btcPrice['last-block'].value} blocks ago)</td>
                <td>{btcPrice['last-price'].value} (${btcPrice['last-price'].value / btcPrice['decimals'].value})</td>
              </tr>
              <tr>
                <td>DIKO</td>
                <td>{dikoPrice['decimals'].value}</td>
                <td>{dikoPrice['last-block'].value} ({blockHeight - dikoPrice['last-block'].value} blocks ago)</td> 
                <td>{dikoPrice['last-price'].value} (${dikoPrice['last-price'].value / dikoPrice['decimals'].value})</td>
              </tr>
              <tr>
                <td>USDA</td>
                <td>{usdaPrice['decimals'].value}</td>
                <td>{usdaPrice['last-block'].value} ({blockHeight - usdaPrice['last-block'].value} blocks ago)</td>
                <td>{usdaPrice['last-price'].value} (${usdaPrice['last-price'].value / usdaPrice['decimals'].value})</td>
              </tr>
              <tr>
                <td>atALEX</td>
                <td>{atAlexPrice['decimals'].value}</td>
                <td>{atAlexPrice['last-block'].value} ({blockHeight - atAlexPrice['last-block'].value} blocks ago)</td>
                <td>{atAlexPrice['last-price'].value} (${atAlexPrice['last-price'].value / atAlexPrice['decimals'].value})</td>
              </tr>
            </tbody>
          </table>
        )}

      </main>
    </div>
  )
}
