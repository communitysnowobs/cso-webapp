/** @jsx jsx */
import { jsx, css, keyframes } from '@emotion/core'
import { NextFC } from "next";
import styled from '@emotion/styled'

const LoadingIndicator: NextFC<{}> = () => (
  <Wrapper>
    <Dot delay="0s" />
    <Dot delay=".1s" />
    <Dot delay=".2s" />
  </Wrapper>
)

const animation = keyframes`
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
`
const Wrapper = styled.div`
  width: fit-content;
  margin: auto;
  display: flex;
  align-items: center;
  height: 100%;
`;

const Dot = styled.div<{delay: string}>`
  background-color: white;
  border-radius: 50%;
  width: 8px;
  height: 8px;
  margin: 0px 5px;
  animation: ${animation} 1s linear infinite;
  animation-delay: ${props => props.delay};
`;


export default LoadingIndicator
