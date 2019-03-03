/** @jsx jsx */
import { jsx, css, keyframes } from '@emotion/core'
import styled from '@emotion/styled'
import LoadingIndicator from './LoadingIndicator'

export default ({title, onClick, loading}) => (
  <Wrapper onClick = {onClick}>
      {!loading ? title : <LoadingIndicator/>}
  </Wrapper>
)

const Wrapper = styled.div`
    border-radius: 8px;
    color: #fff;
    background-color: #08f;
    text-align: center;
    height: 48px;
    padding: 0.75rem;
    margin-bottom: 24px;
    margin-top: 40px;
    font-weight: 500;
    transition: 0.25s;
    &:hover {
      cursor: pointer;
      box-shadow: none;
      background-color: #0074D9;
    }
`
