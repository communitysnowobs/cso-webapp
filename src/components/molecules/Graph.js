import {
  MarkSeries,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  HexbinSeries,
  FlexibleHeightXYPlot
} from 'react-vis';

import Label from '../atoms/Label';
import Frame from '../atoms/Frame';
import { spacingBottom } from '../../utils/css';

const Graph = ({ features, graph }) => (
  <>
    <Label margin={spacingBottom("0.5rem")}>{graph.name}</Label>
    <Frame height={"320px"}>
      <FlexibleHeightXYPlot
        width={300}
        margin={{ top: 20, left: 60, right: 20, bottom: 40 }}
        {...graph.plot}
      >
        <HorizontalGridLines />
        <VerticalGridLines />
        <XAxis {...graph.xAxis} />
        <YAxis {...graph.yAxis} />
        {features.length > 500 ? (
          <HexbinSeries
            colorRange={['#0088ff18', '#08f']}
            className='heatmap-series-example'
            data={graph.data(features)}
            radius={4.5}
          />
        ) : (
          <MarkSeries
            color={'#08f'}
            className='mark-series-example'
            data={graph.data(features)}
            size={2}
          />
        )}
      </FlexibleHeightXYPlot>
    </Frame>
  </>
);

export default Graph;
