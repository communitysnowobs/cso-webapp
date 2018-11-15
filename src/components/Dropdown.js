import Select from 'react-select'
import css from 'styled-jsx/css'
import NoSSR from 'react-no-ssr';

export default ({options, instanceId, placeholder, title, subtitle, onChange, value, isMulti}) => (
  <div className = "root">
      <div className = "title">{title}</div>
      <div className = "subtitle">{subtitle} </div>
        <div className = "container">
        <Select classNamePrefix = {"react_select"} instanceId='unique' placeholder={placeholder} options={options} isMulti={isMulti} isClearable={false} onChange={onChange} value={value}/>
        </div>
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
  .container {
    height: 40px;
  }
  .root {
    margin-bottom: 24px;
  }
`
