import { AppProps } from 'next/app';
import { ReactNode } from 'react';
import '../styles/globals.css';
import { Skylab } from '@amplitude-private/skylab-js-client';

let SkylabServer;
if (typeof window === 'undefined') {
  console.debug('Initializing Server Skylab');
  SkylabServer = require('@amplitude-private/skylab-js-server').Skylab;
  SkylabServer.init('client-IAxMYws9vVQESrrK88aTcToyqMxiiJoR');
}

function MyApp(appProps: AppProps): ReactNode {
  const { Component, pageProps } = appProps;
  console.debug('Rendering');
  if (appProps['features']) {
    console.log('Initializing Client Skylab');
    Skylab.init('client-IAxMYws9vVQESrrK88aTcToyqMxiiJoR', {
      initialFlags: appProps['features'],
    });
  }
  global.Skylab = Skylab;
  return <Component {...pageProps} />;
}

MyApp.getInitialProps = async (ctx) => {
  // Fetch data from external API
  if (typeof window === 'undefined') {
    console.debug('Fetching Skylab variants');
    const allFeatures = await SkylabServer.getInstance().getAllVariants({
      id: 'userId',
    });
    return { features: allFeatures };
  } else {
    return {};
  }
};

export default MyApp;
