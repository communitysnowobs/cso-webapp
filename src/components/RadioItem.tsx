/** @jsx jsx */
import { jsx, css, keyframes } from '@emotion/core'
import styled from '@emotion/styled'
import { NextFC } from 'next'

interface Props {
  title: string,
  icon: string,
  selected: boolean,
  action: string,
  first: boolean,
  onClick: any,
}

export type RadioItemType = typeof RadioItem

const RadioItem: NextFC<Props> = ({title, icon, selected, first, onClick}) => (
  <Wrapper selected={selected} first={first} onClick={onClick}>
    <Icon src={icon}/>
    <Title>{title}</Title>
  </Wrapper>
)

const Wrapper = styled.div<{selected: boolean, first: boolean}>`
  color: ${props => props.selected ? "#08f" : "#a9a9a9"};
  display: inline-block;
  cursor: pointer;
  height: 100%;
  background-color: #fefefe;
  border-right: ${props => props.first ? "1px solid #d8d8d8" : ""}
`

const Title = styled.div`
  padding: 0.75rem 1rem;
  font-weight: 400;
  font-size: 14px;
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
export default RadioItem
