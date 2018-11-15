import {Component} from 'react';
import Input from './Input'
import Dropdown from './Dropdown'
import Button from './Button'
import css from 'styled-jsx/css'
import download from 'downloadjs'
import axios from 'axios'

const providerOptions = [
  { value: 'MountainHub', label: 'MountainHub' },
  { value: 'SnowPilot', label: 'SnowPilot' },
]

const formatOptions = [
  { value: 'geojson', label: 'GeoJSON' },
  { value: 'csv', label: 'CSV' },
]

class DownloadForm extends Component {
  constructor(props) {
    super(props)
    this.renderChildren = this.renderChildren.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onProviderChange = this.onProviderChange.bind(this)
    this.onFormatChange = this.onFormatChange.bind(this)
    this.onChange = this.onChange.bind(this)
    this.state = {
      startDate: "",
      endDate: "",
      bbox: "",
      providers: [],
      format: "",
    }
  }

  async onSubmit(item) {
    // window.location.replace("https://api.communitysnowobs.org/obs?limit=10000&format=geojson");
    let providers = this.state.providers.map(x => x.value)
    let format = this.state.format.value
    let params = {
      start_date: this.state.startDate || null,
      end_date: this.state.endDate || null,
      src: providers != [] ? providers.join(",") : null,
      bbox: this.state.bbox || null,
      format: format || null,
      limit: 10000
    }


    let response = await axios.get('https://api.communitysnowobs.org/obs', { transformResponse: undefined, params: params})
    if (format == 'csv') {
      download(response.data, 'cso.csv', 'text/csv')
    }
    else {
      download(response.data, 'cso.geojson', 'application/vnd.geo+json')
    }


    this.setState({
      startDate: "",
      endDate: "",
      bbox: "",
      format: "",
      providers: []
    })
  }

  onChange(e, key) {
    console.log(key)
    this.setState({[key]: e.target.value})
  }

  onProviderChange(x) {
    this.setState({providers: x})
  }

  onFormatChange(x) {
    this.setState({format: x})
  }

  renderChildren() {
    return React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        onClick: this.onItemClick,
        selected: (child.props.title == this.state.selected)
      })
    })
  }

  render() {
    return (
      <div className = "center-block">
          <div className = "left">
            <Input
              title="Start Date"
              subtitle="YYYY-MM-DD"
              placeholder="2016-01-01"
              value = {this.state.startDate}
              onChange= {(e) => this.onChange(e, "startDate")}
            />
          </div>
          <div className = "right">
            <Input
              title="End Date"
              subtitle="YYYY-MM-DD"
              placeholder="2018-10-30"
              value = {this.state.endDate}
              onChange= {(e) => this.onChange(e, "endDate")}
            />
          </div>
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
              instanceId="providers"
              placeholder="Select Providers"
              options={providerOptions}
              isMulti
              onChange={this.onProviderChange}
              value={this.state.providers}
            />
            <Dropdown
              title="Format"
              instanceId="format"
              placeholder="Select Format"
              options={formatOptions}
              onChange={this.onFormatChange}
              value={this.state.format}
            />
          <Button title="Download Data" onClick = {this.onSubmit}/>
          <style jsx>{style}</style>
      </div>
    )
  }
}

const style = css`
.center-block {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  padding: 1rem;
  max-width: 100%;
}
.left, .right {
  width: 50%;
  display: inline-block;
  box-sizing: border-box;
}
.left {
  padding-right: 1rem;
}
.right {
  padding-left: 1rem;
}
`

export default DownloadForm;
