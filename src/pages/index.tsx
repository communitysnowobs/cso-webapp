/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import NoSSR from 'react-no-ssr';
import { NextFC } from 'next'

import Meta from '../components/Meta'
import Nav from '../components/Nav'
import ReactMap from '../components/ReactMap'
import { AppContext, AppContextProvider } from '../components/AppContext';
import ContextProvider from '../context/ContextProvider'

const index : NextFC  = () =>
  <>
    <Meta />
    <Nav css={{zIndex: 100}}/>
    <NoSSR>
      <ContextProvider>
        <ReactMap apiToken={process.env.MAPBOX_TOKEN} style={process.env.MAPBOX_STYLE}/>
      </ContextProvider>
    </NoSSR>
  </>

export default index
