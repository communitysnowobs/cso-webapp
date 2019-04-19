/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'

export default ({title, subtitle, placeholder, value, onChange}) => (
  <Wrapper>
      <Title className = "title">{title}</Title>
      <Subtitle className = "subtitle">{subtitle} </Subtitle>
      <Input value={value} placeholder={placeholder} onChange={onChange}/>
  </Wrapper>
)

const Wrapper = styled.div`
  margin-bottom: 24px;
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
const Input = styled.input`
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
`
