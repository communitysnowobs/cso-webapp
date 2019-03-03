/** @jsx jsx */
import { jsx, css, keyframes } from '@emotion/core'
import styled from '@emotion/styled'
import { PureComponent} from 'react';
import * as R from 'ramda'

const RadioGroup = ({children, title, selected, onClick}) => (
  <Wrapper> {
    React.Children.map(children, child => {
      return React.cloneElement(child, {
        onClick: R.partial(onClick, [R.toLower(child.props.title)]),
        selected: R.eqBy(R.toLower, child.props.title, selected)
      })
    })}
  </Wrapper>
)

const Wrapper = styled.div`
  border-radius: 0.5rem;
  overflow: hidden;
  border: 2px solid #08f;
  text-align: center;
  height: 36px;
  box-sizing: content-box;
`

export default RadioGroup;
