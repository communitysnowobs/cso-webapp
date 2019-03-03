/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import {Component} from 'react';
import Input from './Input'
import Dropdown from './Dropdown'
import Button from './Button'
import LoadingIndicator from './LoadingIndicator'
import download from 'downloadjs'
import axios from 'axios'

// Adds server generated styles to emotion cache.
// '__NEXT_DATA__.ids' is set in '_document.js'

const providerOptions = [
  { value: 'MountainHub', label: 'MountainHub' },
  { value: 'SnowPilot', label: 'SnowPilot' },
  { value: 'regObs', label: "RegObs"},
  { value: 'MountainHub,SnowPilot,regObs', label:  "All"}
]

const formatOptions = [
  { value: 'geojson', label: 'GeoJSON' },
  { value: 'csv', label: 'CSV' },
]

const initialState = {
  startDate: "",
  endDate: "",
  bbox: "",
  providers: [],
  format: "",
  loading: false,
}

class DownloadForm extends Component {
  constructor(props) {
    super(props)
    this.state = initialState
  }

  onSubmit = (item) => {
    this.setState({loading: true})
    let providers = this.state.providers.map(x => x.value)
    let format = this.state.format.value
    let params = {
      startDate: this.state.startDate || null,
      endDate: this.state.endDate || null,
      providers: providers != [] ? providers.join(",") : null,
      bbox: this.state.bbox || null,
      format: format || null,
      limit: 100000
    }

    axios.get('https://api.communitysnowobs.org/observations', { transformResponse: undefined, params: params}).then(res => {
      if (format == 'csv') {
        download(res.data, 'cso.csv', 'text/csv')
      }
      else {
        download(res.data, 'cso.geojson', 'application/vnd.geo+json')
      }
      this.setState(initialState)
    })

  }

  onChange = (e, key) => {
    this.setState({[key]: e.target.value})
  }

  onProviderChange = (x) => {
    this.setState({providers: x})
  }

  onFormatChange = (x) => {
    this.setState({format: x})
  }

  render = () => (
    <Wrapper>
        <SplitWidth left>
          <Input
            title="Start Date"
            subtitle="YYYY-MM-DD"
            placeholder="2016-01-01"
            value = {this.state.startDate}
            onChange= {(e) => this.onChange(e, "startDate")}
          />
        </SplitWidth>
        <SplitWidth right>
          <Input
            title="End Date"
            subtitle="YYYY-MM-DD"
            placeholder="2019-12-31"
            value = {this.state.endDate}
            onChange= {(e) => this.onChange(e, "endDate")}
          />
        </SplitWidth>
        <Input
          title="Bounding Box"
          subtitle="West, North, East, South. Longitude in (-180°, 180°)"
          placeholder="min_long,max_lat,max_long,min_lat"
          value = {this.state.region}
          onChange = {(e) => this.onChange(e, "bbox")}
        />
          <Dropdown
            title="Providers"
            subtitle="Select one or more"
            id="providers"
            placeholder="Select Providers"
            options={providerOptions}
            isMulti
            onChange={this.onProviderChange}
            value={this.state.providers}
          />
          <Dropdown
            title="Format"
            id="format"
            placeholder="Select Format"
            options={formatOptions}
            onChange={this.onFormatChange}
            value={this.state.format}
          />
        <Button title="Download Data" onClick = {this.onSubmit} loading = {this.state.loading}/>
    </Wrapper>
  )
}

const SplitWidth = styled.div`
  width: 50%;
  display: inline-block;
  box-sizing: border-box;
  padding-right: ${props => props.left && "1rem"};
  padding-left = ${props => props.right && "1rem"};
`
const Wrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  max-width: 100%;
  transform: translate(-50%, -50%);
  width: 400px;
  padding: 1rem;
`

export default DownloadForm;
