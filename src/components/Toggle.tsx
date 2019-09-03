/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled'
import { NextFC } from 'next'
import * as R from 'ramda'
import * as React from 'react'

interface Props {
  value: boolean,
  onToggle: any,
  children: Array<NextFC<ItemProps>>,
  className?: string
}

interface ItemProps {
  title: string,
  icon: string,
  value: boolean,
  first?: boolean,
  selected?: boolean,
  className?: string,
  onClick?: any
}

export const Toggle: NextFC<Props> = ({ children, value, onToggle, className }) => (
  <Wrapper className={className}> {
    React.Children.map(children, (child: NextFC<ItemProps>, i) => {
      return React.cloneElement(child, {
        onClick: R.partial(onToggle, [child.props.value]),
        selected: child.props.value == value,
        first: (i == 0),
      })
    })}
  </Wrapper>
)

export const ToggleItem: NextFC<ItemProps> = ({ title, icon, first, selected, onClick, className }) => (
  <Item first={first} selected={selected} onClick={onClick} className={className}>
    <Icon src={icon} />
    <Title>{title}</Title>
  </Item>
)


const Wrapper = styled.div`
  border-radius: 5px;
  overflow: hidden;
  box-shadow: #A0A0A0 0px 0px 50px;
  text-align: center;
  height: 40px;
  box-sizing: content-box;
  z-index: 100;
`

const Item = styled.div<{ first: boolean, selected: boolean }>`
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