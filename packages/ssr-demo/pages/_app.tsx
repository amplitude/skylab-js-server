import { Skylab } from '@amplitude-private/skylab-js-client';
import { AppProps } from 'next/app';
import { ReactNode } from 'react';

import { SkylabServer } from '../lib/skylab';
import '../styles/globals.css';

function MyApp(appProps: AppProps): ReactNode {
  const { Component, pageProps } = appProps;
  console.debug('Rendering');
  if (appProps['features']) {
    console.debug('Initializing Client Skylab');
    Skylab.init('client-IAxMYws9vVQESrrK88aTcToyqMxiiJoR', {
      initialFlags: appProps['features'],
      isServerSide: typeof window === 'undefined',
    });
  }
  // add Skylab to the global object for debugging
  globalThis.Skylab = Skylab;
  return <Component {...pageProps} />;
}

MyApp.getInitialProps = async ({ ctx }) => {
  // Fetch data from external APIs
  if (ctx.req) {
    // called on server
    console.debug('Fetching Skylab variants');
    const allFeatures = await SkylabServer.getInstance().getAllVariants({
      id: 'userId',
    });
    return { features: allFeatures };
  } else {
    console.debug('Client side re-render');
    return {};
  }
};

export default MyApp;
