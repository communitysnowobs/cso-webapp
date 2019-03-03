/** @jsx jsx */
import { jsx, css, keyframes } from '@emotion/core'
import styled from '@emotion/styled'
import {Popup} from 'react-map-gl';

export default ({title, icon, selected, onClick}) => (
  <Wrapper selected={selected} onClick={onClick}>
    <Icon src={icon}/>
    <Title>{title}</Title>
  </Wrapper>
)

const Wrapper = styled.div`
  color: white;
  display: inline-block;
  cursor: pointer;
  height: 100%;
  background-color: ${props => props.selected ? "#08f" : "#1e1e1e"}
`

const Title = styled.div`
  padding: 0.5rem 1rem;
  font-weight: 500;
  @media (max-width: 600px) {
    display: none;
  }
`
const Icon = styled.img`
  display: none;
  @media (max-width: 600px) {
    object-fit: contain;
    height: 100%;
    display: inline !important;
  }
`
