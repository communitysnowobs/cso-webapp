import { map, intersperse } from '../utils/objects';
import {
  mean,
  bounds,
  countUniq,
  uniq,
  count,
} from '../utils/aggregations';
import * as moment from 'moment';
import Link from '../components/atoms/Link';

const providerURLs = {
  SnowPilot: 'https://snowpilot.org',
  MountainHub: 'https://about.mountainhub.com/about/',
  regObs: 'https://www.regobs.no'
};

export const aggregations = [
  {
    name: 'Observations',
    fn: count,
    transform: x => x
  },
  {
    name: 'Mean Depth',
    fn: _ => mean(_, obs => obs.properties.depth),
    transform: mean => mean.toFixed(2) + ' cm'
  },
  {
    name: 'Depth Range',
    fn: _ => bounds(_, obs => obs.properties.depth),
    transform: ([min, max]) => min + ' cm - ' + max + ' cm'
  },
  {
    name: 'Mean Elevation',
    fn: _ => mean(_, obs => obs.properties.elevation),
    transform: mean => mean.toFixed(1) + ' m'
  },
  {
    name: 'Elevation Range',
    fn: _ => bounds(_, obs => obs.properties.elevation),
    transform: ([min, max]) => min.toFixed(1) + ' m - ' + max.toFixed(1) + ' m'
  },
  {
    name: 'Temporal Range',
    fn: _ => bounds(_, obs => obs.properties.timestamp),
    transform: ([min, max]) =>
      moment(min).format('MMM Do YYYY, HH:mm A') +
      ' - ' +
      moment(max).format('MMM Do YYYY, hh:mm A')
  },
  {
    name: 'Contributors',
    fn: _ => countUniq(_, obs => obs.properties.author),
    transform: n => n
  },
  {
    name: 'Sources',
    fn: _ => uniq(_, obs => obs.properties.source),
    transform: sources =>
      intersperse(
        map(sources, s =>
          providerURLs[s] ? (
            <Link href={providerURLs[s]} key={`url_${s}`} target={'_blank'}>
              {s}
            </Link>
          ) : (
            s
          )
        ),
        ', '
      )
  }
];

export const graphs = [
  {
    name: 'Depth vs. Elevation',
    data: features =>
      map(features, f => ({
        x: f.properties.elevation,
        y: f.properties.depth
      })),
    plot: {},
    xAxis: {
      tickFormat: val => val + ' m',
      tickTotal: 3
    },
    yAxis: {
      tickFormat: val => val + ' cm'
    }
  },
  {
    name: 'Depth vs. Time',
    data: features =>
      map(features, f => ({
        x: new Date(f.properties.timestamp),
        y: f.properties.depth
      })),
    plot: {
      xType: 'time'
    },
    xAxis: {
      tickTotal: 3,
    },
    yAxis: {
      tickFormat: val => val + ' cm'
    }
  }
];

export const tableColumns = [
  {
    name: 'Depth',
    transform: f => f.properties.depth.toPrecision(3) + ' cm'
  },
  {
    name: 'Location',
    transform: f => {
      let lat = f.geometry.coordinates[1];
      let latSuffix = lat >= 0 ? '°N' : '°S';
      let long = f.geometry.coordinates[0];
      let longSuffix = long >= 0 ? '°E' : '°W';
      return (
        Math.abs(lat).toPrecision(4) +
        latSuffix +
        ', ' +
        Math.abs(long).toPrecision(4) +
        longSuffix
      );
    }
  },
  {
    name: 'Elevation',
    transform: f => f.properties.elevation.toPrecision(4) + ' m'
  },
  {
    name: 'Date',
    transform: f => f.properties.timestamp.slice(0, 10)
  },
  {
    name: 'Source',
    transform: f => (
      <Link href={providerURLs[f.properties.source]} target='_blank'>
        {f.properties.source}
      </Link>
    )
  }
];