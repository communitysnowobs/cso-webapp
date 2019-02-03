import css from 'styled-jsx/css'
import dynamic from 'next/dynamic'
import NoSSR from 'react-no-ssr';

import Meta from '../components/Meta.js'
import Nav from '../components/Nav.js'
import ReactMap from '../components/ReactMap.js'

export default () => (
  <div className = "root">
    <Meta />
    <Nav downloadButton/>
    <div className = "map-container">
      <NoSSR>
        <ReactMap/>
      </NoSSR>
    </div>
    <style jsx>{style}</style>
  </div>
)

const style = css`
  .root {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .map-container {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -100;
  }
  .map {
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
  }
`
