import Select from 'react-select'
import css from 'styled-jsx/css'

export default ({options, instanceId, placeholder, title, subtitle, onChange, value, isMulti}) => (
  <div className = "root">
      <div className = "title">{title}</div>
      <div className = "subtitle">{subtitle} </div>
        <div className = "container">
        <Select styles={customStyles} placeholder={placeholder} options={options} isMulti={isMulti} isClearable={false} onChange={onChange} value={value}/>
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

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    boxShadow: 'none',
    backgroundColor: 'rgb(12,12,12)',
    outline: 'none',
    borderColor: '#08f',
    borderWidth: '2px',
    borderRadius: '8px',
    paddingLeft: '2px',
    paddingTop: '3px',
    paddingBottom: '0px',
    '&:hover': {
      borderColor: "#08f"
    }
  }),
  menu: (provided, state) => ({
    ...provided,
    borderRadius: '8px',
    overflow: 'none'
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    padding: '3px'
  }),
  indicatorSeparator: (provided, state) => ({
    ...provided,
    display: 'none'
  }),
  singleValue: (provided, state) => ({
    ...provided,
    color: 'white'
  }),
  multiValue: (provided, state) => ({
    ...provided,
    color: 'white',
    backgroundColor: '#08f',
    marginRight: '6px',
    marginBottom: '5px'
  }),
  multiValueLabel: (provided, state) => ({
    ...provided,
    color: 'white',
    fontFamily: `'avenir next', avenir, 'helvetica neue', helvetica, ubuntu, roboto, noto, 'segoe ui', arial, sans-serif`,
    fontWeight: 400,
    fontSize: '1rem',
    padding: '2px 5px'
  }),
  multiValueRemove: (provided, state) => ({
    ...provided,
    '&:hover': {
      backgroundColor: "#08f",
      color: 'white'
    }
  }),
}
