import {Popup} from 'react-map-gl';
import css from 'styled-jsx/css'

export default ({title, selected, onClick}) => (
  <div className = {["root", selected ? "selected" : "unselected"].join(" ")} onClick={() => onClick(title)}>
    {title}
    <style jsx>{style}</style>
  </div>
)

const style = css`
  .root {
    color: #fff;
    display: inline-block;
    padding: 0.5rem 1rem;
    width: 90px;
    cursor: pointer;
    font-weight: 500;
  }
  .selected {
    background-color: #08f;
  }
  .unselected {
    background-color: #1e1e1e;
  }
`
