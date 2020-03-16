import Head from 'next/head';
import { theme } from '../../config/theme';
import 'react-vis/dist/style.css';
import '../../styles/overrides.css';

export default () => (
  <div>
    <Head>
      {/* Standard metadata */}
      <title>Community Snow Observations</title>
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta charSet='utf-8' />
      {/* Favicon config */}
      <link
        href='https://api.tiles.mapbox.com/mapbox-gl-js/v0.46.0/mapbox-gl.css'
        rel='stylesheet'
      />
      <link
        href='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.0.9/mapbox-gl-draw.css'
        rel='stylesheet'
      />
      <link
        rel='apple-touch-icon'
        sizes='180x180'
        href='favicon/apple-touch-icon.png'
      />
      <link
        rel='icon'
        type='image/png'
        sizes='32x32'
        href='favicon/favicon-32x32.png'
      />
      <link
        rel='icon'
        type='image/png'
        sizes='16x16'
        href='/favicon/favicon-16x16.png'
      />
      <link rel='manifest' href='favicon/site.webmanifest' />
      <link
        rel='mask-icon'
        href='/favicon/safari-pinned-tab.svg'
        color='#0088ff'
      />
      <meta name='msapplication-TileColor' content='#0088ff' />
      <meta
        name='msapplication-TileImage'
        content='favicon/mstile-144x144.png'
      />
      <meta name='theme-color' content='#222222' />
      <meta name='msapplication-config' content='/favicon/browserconfig.xml' />
    </Head>
    {/* Global css */}
    <style jsx global>{`
      * {
        font-family: ${theme.typography.font100.fontFamily};
      }

      body {
        margin: 0;
        padding: 0;
      }
    `}</style>
  </div>
);
