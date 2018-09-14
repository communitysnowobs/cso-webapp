import {Popup} from 'react-map-gl';
import css from 'styled-jsx/css'

export default ({title, icon, selected, onClick}) => (
  <div className = {["root", selected ? "selected" : "unselected"].join(" ")} onClick={() => onClick(title)}>
    <img className = "icon" src={icon}/>
    <div className = "title">{title}</div>
    <style jsx>{style}</style>
  </div>
)

const style = css`
  .root {
    color: #fff;
    display: inline-block;
    cursor: pointer;
    height: 100%;
  }
  @media (max-width: 480px) {
      .title {
        display: none;
      }
      .icon {
        display: inline !important;
      }
    }
  .title {
    padding: 0.5rem 1rem;
    font-weight: 500;
  }
  .icon {
    display: none;
    object-fit: contain;
    height: 100%;
  }
  .selected {
    background-color: #08f;
  }
  .unselected {
    background-color: #1e1e1e;
  }

`
