/**
 * @fileOverview Sets up redux, redux saga, and styletron
 * @author Jonah Joughin
 */

import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import App from 'next/app';
import withRedux from 'next-redux-wrapper';
import withReduxSaga from 'next-redux-saga';
import { makeStore } from '../reducers';
import { Provider as StyletronProvider } from 'styletron-react';
import { styletron, debug } from '../styletron';
import { BaseProvider } from 'baseui';
import { theme } from '../config/theme';

class CSOApp extends App {
  static async getInitialProps({ Component, ctx }) {
    // we can dispatch from here too
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};
    return { pageProps };
  }

  render() {
    const { Component, pageProps, store } = this.props;
    return (
      <StyletronProvider value={styletron} debug={debug} debugAfterHydration>
        <BaseProvider theme={theme}>
          <ReduxProvider store={store}>
            <Component {...pageProps} />
          </ReduxProvider>
        </BaseProvider>
      </StyletronProvider>
    );
  }
}

// Wraps application with redux and redux saga
export default withRedux(makeStore)(withReduxSaga(CSOApp));
