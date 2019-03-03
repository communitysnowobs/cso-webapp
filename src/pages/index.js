/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import NoSSR from 'react-no-ssr';

import Meta from '../components/Meta.js'
import Nav from '../components/Nav.js'
import ReactMap from '../components/ReactMap.js'

export default () => (
  <Wrapper>
    <Meta />
    <Nav showDownloadButton/>
    <MapWrapper>
      <NoSSR>
        <ReactMap/>
      </NoSSR>
    </MapWrapper>
  </Wrapper>
)

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`
const MapWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -100;
`
