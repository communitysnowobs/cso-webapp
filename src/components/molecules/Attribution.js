import { withWrapper } from 'styletron-react';
import Link from '../atoms/Link';
import { observationProviders, mapDataProviders } from '../../config/providers'
import { map, intersperse } from '../../utils/objects';
import { stringHash } from '../../utils/math'

const AttributionLink = withWrapper(Link, Styled => props => <Styled {...props} color={'black'} />)

const Attribution = ({ className }) => (
  <div
    className={[
      'mapboxgl-map mapboxgl-ctrl mapboxgl-ctrl-attrib mapboxgl-compact',
      className
    ].join(' ')}
  >
    <span css={{ padding: '0 0.25rem' }}>
      {'Snow Data © '}
      {intersperse(map(observationProviders, ({name, url}) => <AttributionLink href={url} key={stringHash(name)}>{name}</AttributionLink>), ' © ')}
      {' | Map Data © '}
      {intersperse(map(mapDataProviders, ({name, url}) => <AttributionLink href={url} key={stringHash(name)}>{name}</AttributionLink>), ' © ')}
      {' | '}
      <AttributionLink
        className='mapbox-improve-map'
        href='https://www.mapbox.com/feedback/?owner=mapbox&amp;id=outdoors-v9&amp;access_token=pk.eyJ1IjoibHNldGlhd2FuIiwiYSI6ImNpbjI3M2UzNzBiZzh2OWtrZGlzZ2FhaG8ifQ.tkoR6uJikfFpOq4jfsk02w'
        target='_blank'
      >
        {'Improve this map'}
      </AttributionLink>
    </span>
  </div>
);

export default Attribution;
