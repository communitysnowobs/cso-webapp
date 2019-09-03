/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import * as R from 'ramda'
import * as turf from "@turf/turf"
import * as React from 'react'
import { Observation } from '../types/Observation'

interface Props {
    providers: Array<string>,
    className: string
}

interface State {
  minDate?: string,
  maxDate?: string,
  selectedRegions?: Array<any>,
  selectedPoints?: Array<any>
  selectedProviders?: Array<string>
  open: boolean
}

// [ 'Area', 'Radius', 'Individual', '']

class FilterControl extends React.Component<Props, State> {
  state = {
    open: false
  }
  
  _renderOpenControl = () => (
    <OpenControl>abc</OpenControl>
  )

  _renderFilters = () => (
    <OpenControl>def</OpenControl> 
  )

  render() {
    return (
      <div className={this.props.className}>
        {this._renderOpenControl()}
        {this.state.open && this._renderFilters()}
       </div>
    )
  }
}

const OpenControl = styled.div({
  fontSize: '14px',
  color: "#2A2A2A",
  margin: '0rem 2rem',
})

export default FilterControl;