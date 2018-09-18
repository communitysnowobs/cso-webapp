import {Popup} from 'react-map-gl';
import css from 'styled-jsx/css'

export default ({geometry, properties}) => (<Popup className = "root" latitude={geometry.coordinates[1]} longitude={geometry.coordinates[0]} closeButton={false} closeOnClick={false}>
    <div className="depth">{Number.parseFloat(properties.depth).toPrecision(3)} cm</div>
    <div className="details">Reported by {properties.author} at {geometry.coordinates[0].toPrecision(4)}, {geometry.coordinates[1].toPrecision(4)} on {new Date(properties.timestamp).toString().slice(0,15)}</div>
    <div className="source">Data from {properties.source}</div>
    <style jsx>{style}</style>
  </Popup>)

const style = css`
  .root {
    width: 100px;
    min-width: 100px;
    max-width: 100px;
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
