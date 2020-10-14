import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { ReactNode } from 'react';

import styles from '../styles/Home.module.css';

let Skylab;
if (typeof window === 'undefined') {
  Skylab = require('@amplitude-private/skylab-js-server').Skylab;
  Skylab.init('client-IAxMYws9vVQESrrK88aTcToyqMxiiJoR');
}

type HomeProps = {
  showFeature: boolean;
};

// This gets called on every request
export const getServerSideProps: GetServerSideProps = async () => {
  // Fetch data from external API
  const showFeature =
    (await Skylab.getInstance().getVariant('js-ssr-demo')) === 'true';

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
