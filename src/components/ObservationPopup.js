import {Popup} from 'react-map-gl';
import {LineChart, BarChart, XAxis, YAxis, CartesianGrid, Line, Bar } from 'recharts'
import css from 'styled-jsx/css'
import moment from 'moment'
import * as R from 'ramda'

const getMonthlyAverages = (features)  => {
  let minDate = moment(R.reduce(R.min, Infinity, R.map(R.prop('timestamp'), features)))
  let maxDate = moment(R.reduce(R.max, -Infinity, R.map(R.prop('timestamp'), features)))
  let months = {};

  while (maxDate > minDate || minDate.format('M') === maxDate.format('M')) {
     months[minDate.format('YYYY-MM')] = [];
     minDate.add(1,'month');
  }

  const monthlyFeaturesDict = features.reduce((acc, f) => {
    const month = moment(f.timestamp).format('YYYY-MM')
    return {
      ...acc,
      [month]: (acc[month] || []).concat([f.depth])
    }
  }, months)

  const monthlyFeatures = Object.entries(monthlyFeaturesDict).map(f => ({value: f[1], date: f[0]}))
  const monthlyAverages = monthlyFeatures.map(f => ({
    ...f,
    value: f.value.reduce((sum, x) => sum + x, 0) / f.value.length
  }))

  return monthlyAverages
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
        <div className="entry" key = {f.depth}>
          <div className="depth">{Number.parseFloat(f.depth).toPrecision(3)} cm</div>
          <div className="details">Reported by {f.author} at {f.longitude.toPrecision(4)}, {f.latitude.toPrecision(4)} on {new Date(f.timestamp).toString().slice(0,15)}</div>
          <div className="source">Data from {f.source}</div>
        </div>
      ))) : (
        <div className = "chart">
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
          <div className="aggregateEntry">
            <div className="details">Mean depth of {meanDepth.toPrecision(3)} cm over {features.length} observations near {meanLongitude.toPrecision(4)}, {meanLatitude.toPrecision(4)}</div>
            <div className="source">Data from {sources.join(", ")}</div>
          </div>
        </div>
      )
    }
    <style jsx>{style}</style>
  </Popup>
)}

const style = css`
  .entry {
    padding: 0.5rem 0.5rem;
    width: 225px;
  }
  .aggregateEntry {
    padding: 0.5rem 0.5rem;
    width: 275px;
  }
  .depth, .highlight {
    font-weight: 500;
    color: #08f;
  }
  .depth {
    font-size: 1.5rem;
    text-align: center;
  }
  .details {
    color: #999;
    font-size: 0.75rem;
    text-align: center;
  }
  .source {
    color: #555;
    padding-top: 0.25rem;
    font-size: 0.6rem;
    text-align: center;
  }
`
