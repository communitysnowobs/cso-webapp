import Link from '../atoms/Link';
import { styled } from 'baseui';
import { theme } from '../../config/theme';
import moment from 'moment';

const providerURLs = {
  SnowPilot: 'https://snowpilot.org',
  MountainHub: 'https://about.mountainhub.com/about/',
  regObs: 'https://www.regobs.no'
};

const Container = styled('div', {
  fontWeight: 400,
  fontFamily: theme.typography.font200.fontFamily,
  padding: theme.sizing.scale400,
  boxShadow: '0px 0px 40px #A0A0A0',
  fontSize: '1rem',
  color: '#2a2a2a',
  backgroundColor: '#fff',
  borderRadius: '5px',
  position: 'absolute',
  zIndex: 1000,
  pointerEvents: 'none'
});

const Tooltip = ({ target }) => {
  const { object, x, y } = target || {};
  if (object) {
    return (
      <Container
        style={{
          left: x,
          top: y
        }}
      >
        <div
          style={{
            paddingBottom: '0.25rem'
          }}
        >
          {`${object.properties.depth.toFixed(1)} cm`}
        </div>
        <div
          style={{
            fontSize: '0.75rem',
            color: theme.colors.primary600
          }}
        >
          {moment(object.properties.timestamp).format('MMM Do YYYY')}
        </div>
        <div
          style={{
            fontSize: '0.75rem',
            color: theme.colors.primary600
          }}
        >
          {`${object.properties.author} via `}
          <Link href={providerURLs[object.properties.source]} target={'_blank'}>
            {object.properties.source}
          </Link>
        </div>
      </Container>
    );
  }
  return null;
};

export default Tooltip;
