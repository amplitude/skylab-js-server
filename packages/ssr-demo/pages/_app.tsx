import { AppProps } from 'next/app';
import { ReactNode } from 'react';
import '../styles/globals.css';

if (typeof window === 'undefined') {
  console.log('Initializing Skylab');
  require('@amplitude-private/skylab-js-server').Skylab.init(
    'client-IAxMYws9vVQESrrK88aTcToyqMxiiJoR',
  );
}

function MyApp({ Component, pageProps }: AppProps): ReactNode {
  return <Component {...pageProps} />;
}

export default MyApp;
