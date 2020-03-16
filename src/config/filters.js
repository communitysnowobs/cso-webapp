import { ViewMode } from 'nebula.gl';
import moment from 'moment';

export default {
  discrete: [
    {
      name: 'Source',
      field: 'source',
    }
  ],
  range: [
    {
      name: 'Date',
      field: '_ms',
      display: d => moment(d).format('YYYY-MM-DD'),
      step: 1000 * 60 * 60 * 24,
      maxBounds: [1481624400000, Date.now()],
      gpu: {
        softMargin: 1000 * 60 * 60 * 24 * 30
      }
    },
    {
      name: 'Depth',
      field: 'depth',
      display: d => `${d} cm`,
      maxBounds: [0, 500],
      gpu: {
        softMargin: 50
      }
    },
    {
      name: 'Elevation',
      field: 'elevation',
      display: d => `${d} m`,
      gpu: {
        softMargin: 400
      }
    }
  ],
  geo: {
    enabled: true,
    drawMode: ViewMode
  }
};