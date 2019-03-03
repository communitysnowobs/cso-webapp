/** @jsx jsx */
import Select from 'react-select'
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'

export default ({options, id, placeholder, title, subtitle, onChange, value, isMulti}) => (
  <Wrapper>
    <Title>{title}</Title>
    <Subtitle>{subtitle} </Subtitle>
    <SelectWrapper>
      <Select instanceId={id} styles={customStyles} placeholder={placeholder} options={options} isMulti={isMulti} isClearable={false} onChange={onChange} value={value}/>
    </SelectWrapper>
  </Wrapper>
)

const Wrapper = styled.div`
  margin-bottom: 24px;
`
const SelectWrapper = styled.div`
  height: 40px;
`
const Title = styled.div`
  color: #fff;
  width: 100%;
  font-weight: 500;
  font-size: 1rem;
`
const Subtitle = styled.div`
  color: #aaa;
  width: 100%;
  font-weight: 500;
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
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
