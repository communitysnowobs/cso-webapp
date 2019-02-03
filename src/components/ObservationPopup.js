import {Popup} from 'react-map-gl';
import {LineChart, XAxis, YAxis, CartesianGrid, Line } from 'recharts'
import css from 'styled-jsx/css'

export default ({selected}) => (<Popup className = "root" latitude={selected[0].geometry.coordinates[1]} longitude={selected[0].geometry.coordinates[0]} closeButton={false} closeOnClick={false}>
    {
      selected.map(entry => (
        <div className="entry" key = {entry.properties.depth}>
        <div className="depth">{Number.parseFloat(entry.properties.depth).toPrecision(3)} cm</div>
        <div className="details">Reported by {entry.properties.author} at {entry.geometry.coordinates[0].toPrecision(4)}, {entry.geometry.coordinates[1].toPrecision(4)} on {new Date(entry.properties.timestamp).toString().slice(0,15)}</div>
        <div className="source">Data from {entry.properties.source}</div>
        </div>
      ))
    }
    <style jsx>{style}</style>
  </Popup>)

  //   <LineChart width={190} margin={{ top: 10, right: 10, bottom: -10, left: -30 }} height={100} data={[{name:'1', value: 1},{name:'3', value: 3},{name:'2', value: 2}]}>
  //   <XAxis dataKey="name" tick={{fontSize: 8}}/>
  //   <YAxis tick={{fontSize: 8}}/>
  //   <Line type="monotone" dataKey="value" stroke="#08f" />
  // </LineChart>

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
