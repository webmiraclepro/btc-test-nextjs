import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { store } from 'app/store';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Web3ReactProvider getLibrary={(provider) => new Web3Provider(provider)}>
        <Component {...pageProps} />
      </Web3ReactProvider>
    </Provider>
  );
}

export default MyApp;
