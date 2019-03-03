/** @jsx jsx */
import { jsx, css, keyframes } from '@emotion/core'
import styled from '@emotion/styled'

export default ({showDownloadButton}) => (
  <Wrapper>
    <Title href = "/" >
      CSO <Highlight>Data</Highlight>
    </Title>
    {showDownloadButton && <Download href = "/download">Download Data</Download>}
  </Wrapper>
)

const Wrapper = styled.div`
  background-color: rgba(12, 12, 12, 0.75);
  color: #fff;
  width: 100%;
  font-weight: 500;
  height: 48px;
  display: flex;
  font-size: 1.25rem;
  justify-content: space-between;
  position: fixed;
`

const Download = styled.a`
  margin-right: 0.5rem;
  padding: 0.25rem 0.5rem;
  display: inline-block;
  align-self: center;
  font-size: 1rem;
  border-radius: 4px;
  background-color: rgba(255,255,255,0.25);
  font-weight: 400;
  transition: 0.25s;
  text-decoration: none;
  color: #fff;
  &:hover {
    background-color: #08f;
    cursor: pointer;
  }
`

const Title = styled.a`
  margin-left: 1rem;
  display: inline-block;
  align-self: center;
  text-decoration: none;
  color: #fff;
`

const Highlight = styled.span`
  color: #08f;
  font-weight: 400;
`
