/** @jsx jsx */
import React, { Component } from "react";
import { jsx, css, keyframes } from '@emotion/core'
import styled from '@emotion/styled'


const LoadingIndicator = ({className}) => (
  <Wrapper>
    <Dot className = {className} delay="0s" />
    <Dot className = {className} delay=".1s" />
    <Dot className = {className} delay=".2s" />
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

const Dot = styled.div`
  background-color: white;
  border-radius: 50%;
  width: 8px;
  height: 8px;
  margin: 0px 5px;
  animation: ${animation} 1s linear infinite;
  animation-delay: ${props => props.delay};
`;


export default LoadingIndicator
