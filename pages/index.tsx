import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
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
      </main>
    </div>
  )
}
