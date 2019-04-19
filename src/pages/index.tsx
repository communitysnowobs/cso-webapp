/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import NoSSR from 'react-no-ssr';
import { NextFC } from 'next'

import Meta from '../components/Meta'
import Nav from '../components/Nav'
import ReactMap from '../components/ReactMap'

const index : NextFC  = () =>
  <>
    <Meta />
    <Nav css={{zIndex: 100}}/>
    <NoSSR>
      <ReactMap/>
    </NoSSR>
  </>

export default index
