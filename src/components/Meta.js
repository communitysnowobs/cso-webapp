import Head from 'next/head'
export default () => (
  <div>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v0.44.2/mapbox-gl.css' rel='stylesheet' />
      <link rel='stylesheet' href='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.0.4/mapbox-gl-draw.css' type='text/css' />
      <script src='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.0.4/mapbox-gl-draw.js'></script>
    </Head>
    <style jsx global>{`
      * {
        margin: 0;
        padding: 0;
        font-family: 'avenir next', avenir,
               'helvetica neue', helvetica,
               ubuntu,
               roboto, noto,
               'segoe ui', arial,
               sans-serif;
      }
      body {
        background-color: #191a1a;
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
        width: 240px !important;
        padding: 10px 10px !important;
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
    `}</style>
  </div>
)