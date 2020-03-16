/**
 * @fileOverview Defines main application page
 * @author Jonah Joughin
 */

import Map from '../components/cells/Map';
import NoSSR from 'react-no-ssr';
import Meta from '../components/cells/Meta';

export default () => (
  <>
    <Meta />
    <NoSSR>
      <Map />
    </NoSSR>
  </>
);
