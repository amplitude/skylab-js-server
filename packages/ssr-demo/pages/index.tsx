import { Skylab } from '@amplitude-private/skylab-js-server';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { ReactNode } from 'react';

import styles from '../styles/Home.module.css';

type HomeProps = {
  showFeature: boolean;
};

// This gets called on every request
export const getServerSideProps: GetServerSideProps = async () => {
  // Fetch data from external API
  const showFeature =
    (await Skylab.getInstance().getAllVariants({ id: 'userId' }))[
      'js-ssr-demo'
    ] || false;

  // Pass data to the page via props
  return { props: { showFeature } };
};

const Home = (props: HomeProps): ReactNode => {
  const { showFeature } = props;
  return (
    <div className={styles.container}>
      <Head>
        <title>SSR Demo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>SSR demo for Skylab</h1>

        <Link href="/client-link">Client side navigation demo</Link>
        <p className={styles.description}>
          If you see an image below, the feature flag is enabled
        </p>

        {showFeature ? (
          <footer className={styles.footer}>
            <img
              src="/amplitude-logo.svg"
              alt="Flag enabled!"
              className={styles.logo}
            />
          </footer>
        ) : null}
      </main>
    </div>
  );
};

export default Home;
