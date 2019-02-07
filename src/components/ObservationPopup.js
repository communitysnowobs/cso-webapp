import {Popup} from 'react-map-gl';
import {LineChart, XAxis, YAxis, CartesianGrid, Line } from 'recharts'
import css from 'styled-jsx/css'
import moment from 'moment'

const formatXAxis= (tickItem) => moment(tickItem).format('MM-DD-YYYY');


export default ({features}) => {
  const meanLatitude = features.reduce((acc, f) => acc + f.latitude, 0)/features.length
  const meanLongitude = features.reduce((acc, f) => acc + f.longitude, 0)/features.length
  const meanDepth = features.reduce((acc, f) => acc + f.depth, 0)/features.length
  const sources = Array.from(new Set(features.map(f => f.source)))
  return (
    <Popup
      latitude={meanLatitude}
      longitude={meanLongitude}
      closeButton={false}
      closeOnClick={false}
    >
    {features.length <= 3 ? (features.map(f => (
        <div className="entry" key = {f.depth}>
          <div className="depth">{Number.parseFloat(f.depth).toPrecision(3)} cm</div>
          <div className="details">Reported by {f.author} at {f.longitude.toPrecision(4)}, {f.latitude.toPrecision(4)} on {new Date(f.timestamp).toString().slice(0,15)}</div>
          <div className="source">Data from {f.source}</div>
        </div>
      ))) : (
        <div>
          <LineChart
            width={200}
            height={150}
            margin={{ top: 10, right: 10, bottom: -10, left: -25 }}
            data={features.map(f => ({value: f.depth, date: new Date(f.timestamp).getTime()}))}>
            <XAxis
              dataKey="date"
              tick={{fontSize: 8, textAnchor: 'middle'}}
              tickCount={3}
              interval = {'preserveStartEnd'}
              tickFormatter={formatXAxis}
              type="number"
              domain={['dataMin', 'dataMax']}/>
            <YAxis tick={{fontSize: 8}}/>
            <Line type="monotone" dataKey="value" stroke="#08f" dot={false} isAnimationActive = {false} />
          </LineChart>
          <div className="entry">
            <div className="details">Mean depth of {meanDepth.toPrecision(3)} cm across {features.length} observations near {meanLongitude.toPrecision(4)}, {meanLatitude.toPrecision(4)}</div>
            <div className="source">Data from {sources.join(", ")}</div>
          </div>
        </div>
      )
    }
    <style jsx>{style}</style>
  </Popup>
)}

const style = css`
  .root {
    width: 100px;
    min-width: 100px;
    max-width: 100px;
    max-height: 50vh;
  }
  .entry {
    padding: 0.5rem 0rem;
  }
  .depth {
    font-weight: 500;
    color: #08f;
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
