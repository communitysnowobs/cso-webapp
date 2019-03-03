/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import {Popup} from 'react-map-gl';
import {LineChart, BarChart, XAxis, YAxis, CartesianGrid, Line, Bar } from 'recharts'
import moment from 'moment'
import * as R from 'ramda'

const getMonthlyAverages = (features)  => {
  let minDate = moment(R.reduce(R.min, Infinity, R.map(R.prop('timestamp'), features)))
  let maxDate = moment(R.reduce(R.max, -Infinity, R.map(R.prop('timestamp'), features)))
  let months = {};
  R.until(R.gt(R.__, maxDate), (x => {months[x.format('YYYY-MM')] = []; return x.add(1, 'month')}), minDate)

  return R.pipe(
      R.reduceBy( // List of depths grouped by months
        (acc, {depth}) => R.append(depth, acc),
        [],
        ({timestamp}) => moment(timestamp).format('YYYY-MM')
      ),
      R.mergeWith(R.concat, months), // Add empty months
      R.mapObjIndexed(R.mean), // Take mean of depths
      R.toPairs, // Convert to list
      R.map(([x,y] = [0,1]) => ({value: y, date: x})) // Map to objects
    )(features)
}

export default ({features}) => {
  // Compute aggregate information
  const meanLatitude = R.mean(R.map(x => x.latitude, features))
  const meanLongitude = R.mean(R.map(x => x.longitude, features))
  const meanDepth = R.mean(R.map(x => x.depth, features))
  const sources = R.uniq(R.map(x => x.source, features))
  const monthlyAverages = getMonthlyAverages(features)

  return (
    <Popup
      latitude={meanLatitude}
      longitude={meanLongitude}
      closeButton={false}
      closeOnClick={false}
    >
    {features.length <= 3 ?
      (features.map(f => (
        <Entry key = {f.depth}>
          <Depth>{Number.parseFloat(f.depth).toPrecision(3)} cm</Depth>
          <Details>Reported by {f.author} at {f.longitude.toPrecision(4)}, {f.latitude.toPrecision(4)} on {new Date(f.timestamp).toString().slice(0,15)}</Details>
          <Source>Data from {f.source}</Source>
        </Entry>
      ))) : (
        <div>
          <BarChart
            width={275}
            height={150}
            margin={{ top: 20, right: 25, bottom: -10, left: -20 }}
            data={monthlyAverages}>
            <XAxis
              dataKey="date"
              tick={{fontSize: 9, textAnchor: 'middle'}}
              interval = {'preserveStartEnd'}
            />
            <YAxis tick={{fontSize: 9}}/>
            <Bar type="monotone" dataKey="value" fill="#08f" />
          </BarChart>
          <AggregateEntry>
            <Details>Mean depth of {meanDepth.toPrecision(3)} cm over {features.length} observations near {meanLongitude.toPrecision(4)}, {meanLatitude.toPrecision(4)}</Details>
            <Source>Data from {sources.join(", ")}</Source>
          </AggregateEntry>
        </div>
      )
    }
  </Popup>
)}

const Entry = styled.div`
  padding: 0.5rem 0.5rem;
  width: 225px;
`
const AggregateEntry = styled.div`
  padding: 0.5rem 0.5rem;
  width: 275px;
`
const Depth = styled.div`
  font-weight: 500;
  color: #08f;
  font-size: 1.5rem;
  text-align: center;
`
const Details = styled.div`
  color: #999;
  font-size: 0.75rem;
  text-align: center;
`
const Source = styled.div`
  color: #555;
  padding-top: 0.25rem;
  font-size: 0.6rem;
  text-align: center;
`
