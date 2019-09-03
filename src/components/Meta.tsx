import Head from 'next/head'
import { Global, css } from '@emotion/core'

export default () => (
  <div>
    <Head>
      <title>Community Snow Observations</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v0.46.0/mapbox-gl.css' rel='stylesheet' />
      <link href='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.0.9/mapbox-gl-draw.css' rel='stylesheet' />
      <link rel="apple-touch-icon" sizes="180x180" href="/static/icon/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/static/icon/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/static/icon/favicon-16x16.png" />
      <link rel="manifest" href="/static/icon/site.webmanifest" />
      <link rel="mask-icon" href="/static/icon/safari-pinned-tab.svg" color="#0088ff" />
      <meta name="msapplication-TileColor" content="#0088ff" />
      <meta name="msapplication-TileImage" content="/static/icon/mstile-144x144.png" />
      <meta name="theme-color" content="#222222" />
    </Head>
    <Global styles={{
      '*': {
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        fontFamily: `-apple-system, BlinkMacSystemFont, 'avenir next', avenir, 'helvetica neue',
                     helvetica, ubuntu, roboto, noto, 'segoe ui', arial, sans-serif`,
      },
      'body': {
        backgroundColor: "rgb(245,245,243)"
      },
      // Mapbox / Deck.gl overrides
      '.mapboxgl-ctrl-scale': {
        display: 'none'
      },
      '.mapboxgl-ctrl-logo': {
        position: 'fixed',
        bottom: '1.25rem',
        left: '50%',
        transform: 'translateX(-50%) scale(0.85)'
      },
      '.mapboxgl-ctrl-attrib.mapboxgl-compact': {
        margin: '0 13.5px 10px 10px !important',
      },
      '.mapboxgl-ctrl-bottom-right .mapboxgl-ctrl-group': {
        position: 'fixed',
        bottom: '30px',
        right: '2px'
      },
      '.mapboxgl-ctrl-top-left': {
        position: 'fixed',
        left: '12px',
        top: '60px'
      },
      '.mapboxgl-ctrl-top-left .mapboxgl-ctrl': {
        margin: '0px'
      },
      '.mapboxgl-ctrl-attrib.mapboxgl-compact:hover': {
        zIndex: 101
      },
      '#deckgl-draw': {
        cursor: 'crosshair !important'
      }
    }} />
  </div>
)
