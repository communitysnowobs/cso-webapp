import Select from 'react-select'
import css from 'styled-jsx/css'

export default ({title, subtitle, placeholder, value, onChange}) => (
  <div className = "root">
      <div className = "title">{title}</div>
      <div className = "subtitle">{subtitle} </div>
      <input value={value} placeholder={placeholder} onChange={onChange}/>
      <style jsx>{style}</style>
  </div>
)

const style = css`
  .title {
    color: #fff;
    width: 100%;
    font-weight: 500;
    font-size: 1rem;
  }
  .subtitle {
    color: #aaa;
    width: 100%;
    font-weight: 500;
    font-size: 0.75rem;
    margin-bottom: 0.5rem;
  }
  .root {
    margin-bottom: 24px;
  }
  input {
    width: 100%;
    height: 44px;
    background-color: rgb(12,12,12);
    border-radius: 8px;
    border-color: #08f;
    border-width: 2px;
    font-size: 16px;
    padding-left: 8px;
    border-style: solid;
    color: white;
    box-sizing: border-box;
  }
`
