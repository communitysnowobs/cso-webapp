import {Popup} from 'react-map-gl';
import {LineChart, BarChart, XAxis, YAxis, CartesianGrid, Line, Bar } from 'recharts'
import css from 'styled-jsx/css'
import moment from 'moment'

const formatXAxis= (tickItem) => moment(tickItem).format('MM-DD-YYYY');

const getMonthlyAverages = (features)  => {
  let minDate = moment(features.reduce((min, f) => (f.timestamp < min) ? f.timestamp : min, features[0].timestamp))
  let maxDate = moment(features.reduce((max, f) => (f.timestamp > max) ? f.timestamp : max, features[0].timestamp))
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
  const meanLatitude = features.reduce((acc, f) => acc + f.latitude, 0)/features.length
  const meanLongitude = features.reduce((acc, f) => acc + f.longitude, 0)/features.length
  const meanDepth = features.reduce((acc, f) => acc + f.depth, 0)/features.length
  const sources = Array.from(new Set(features.map(f => f.source)))
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
