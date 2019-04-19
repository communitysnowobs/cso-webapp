/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled'
import { NextFC } from 'next'
import { RadioItemType } from './RadioItem'
import * as R from 'ramda'
import * as React from 'react'

interface Props {
  title: string,
  selected: boolean,
  onClick: any,
  children: Array<RadioItemType>,
  className?: string
}

const RadioGroup: NextFC<Props> = ({children, selected, onClick, className}) => (
  <Wrapper className={className}> {
    React.Children.map(children, (child, i) => {
      return React.cloneElement(child, {
        onClick: R.partial(onClick, [R.toLower(child.props.action)]),
        selected: R.eqBy(R.toLower, child.props.action, selected),
        first: (i == 0)
      })
    })}
  </Wrapper>
)

const Wrapper = styled.div`
  border-radius: 5px;
  overflow: hidden;
  box-shadow: #A0A0A0 0px 0px 50px;
  text-align: center;
  height: 40px;
  box-sizing: content-box;
`
export default RadioGroup;
