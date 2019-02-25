// Contains app metadata, global css, mapbox css overrides

import Head from 'next/head'

export default () => (
  <div>
    <Head>
      <title>Community Snow Observations</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v0.46.0/mapbox-gl.css' rel='stylesheet' />
      <link rel="apple-touch-icon" sizes="180x180" href="/static/icon/apple-touch-icon.png"/>
      <link rel="icon" type="image/png" sizes="32x32" href="/static/icon/favicon-32x32.png"/>
      <link rel="icon" type="image/png" sizes="16x16" href="/static/icon/favicon-16x16.png"/>
      <link rel="manifest" href="/static/icon/site.webmanifest"/>
      <link rel="mask-icon" href="/static/icon/safari-pinned-tab.svg" color="#0088ff"/>
      <meta name="msapplication-TileColor" content="#0088ff"/>
      <meta name="msapplication-TileImage" content="/static/icon/mstile-144x144.png"/>
      <meta name="theme-color" content="#222222"/>
    </Head>
    <style jsx global>{`
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'avenir next', avenir,
               'helvetica neue', helvetica,
               ubuntu,
               roboto, noto,
               'segoe ui', arial,
               sans-serif;
      }
      body {
        background-color: rgb(12,12,12);
      }
      input, select {
        outline: none;
      }
      .mapboxgl-ctrl-scale {
        display: none;
      }
      .mapboxgl-ctrl-logo {
        position: fixed;
        bottom: 1.25rem;
        left: 50%;
        transform: translateX(-50%) scale(0.85);
      }
      .mapboxgl-ctrl-attrib.mapboxgl-compact {
        margin: 0 13.5px 10px 10px !important;
      }
      .mapboxgl-ctrl-bottom-right .mapboxgl-ctrl-group {
        position: fixed;
        bottom: 30px;
        right: 2px;
      }
      .mapboxgl-popup {
        padding: 0px !important;
      }
      .mapboxgl-popup-content {
        padding: 10px 0px !important;
      }

      .mapboxgl-popup-anchor-top .mapboxgl-popup-tip,
      .mapboxgl-popup-anchor-top-left .mapboxgl-popup-tip,
      .mapboxgl-popup-anchor-top-right .mapboxgl-popup-tip {
        border-bottom-color: #1e1e1e !important;
      }
      .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip,
      .mapboxgl-popup-anchor-bottom-left .mapboxgl-popup-tip,
      .mapboxgl-popup-anchor-bottom-right .mapboxgl-popup-tip {
        border-top-color: #1e1e1e !important;
      }
      .mapboxgl-popup-anchor-left .mapboxgl-popup-tip {
        border-right-color: #1e1e1e !important;
      }
      .mapboxgl-popup-anchor-right .mapboxgl-popup-tip {
        border-left-color: #1e1e1e !important;
      }
      .mapboxgl-popup-content {
        background-color: #1e1e1e !important;
        border-radius: 8px !important;
      }
      .mapboxgl-ctrl-attrib.mapboxgl-compact:hover {
        z-index: 101;
      }
      .mapboxgl-popup-anchor-top-left .mapboxgl-popup-content {
        border-top-left-radius: 0px !important;
      }
      .mapboxgl-popup-anchor-top-right .mapboxgl-popup-content {
        border-top-right-radius: 0px !important;
      }
      .mapboxgl-popup-anchor-bottom-left .mapboxgl-popup-content {
        border-bottom-left-radius: 0px !important;
      }
      .mapboxgl-popup-anchor-bottom-right .mapboxgl-popup-content {
        border-bottom-right-radius: 0px !important;
      }
      div .react_select__control {
        box-shadow: none;
        background-color: rgb(12,12,12);
        outline: none;
        border-color: #08f;
        border-width: 2px;
        border-radius: 8px;
        padding-left: 2px;
        padding-top: 3px;
        padding-bottom: 0px;
      }
      div .react_select__control:hover {
        border-color: #08f;
      }
      div .react_select__menu {
        border-radius: 8px;
        overflow: none;
      }
      div .react_select__value-container {
        padding: 3px;
      }
      div .react_select__indicator-separator {
        display: none;
      }
      div .react_select__single-value {
        color: white;
      }
      div .react_select__multi-value {
        color: #fff;
        background-color: #08f;
        margin-right: 6px;
        margin-bottom: 5px;
      }
      div .react_select__multi-value__label {
        color: #fff;
        font-family: 'avenir next', avenir, 'helvetica neue', helvetica, ubuntu, roboto, noto, 'segoe ui', arial, sans-serif;
        font-weight: 500;
        font-size: 16px;
        padding: 2px 5px;
      }
      div .react_select__multi-value__remove:hover {
        background-color: #08f;
        color: white;
      }
    `}</style>
  </div>
)
