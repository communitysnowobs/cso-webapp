import {Component} from 'react';
import Input from './Input'
import Dropdown from './Dropdown'
import Button from './Button'
import css from 'styled-jsx/css'
import download from 'downloadjs'
import axios from 'axios'

const options = [
  { value: 'MountainHub', label: 'MountainHub' },
  { value: 'SnowPilot', label: 'SnowPilot' },
]

class DownloadForm extends Component {
  constructor(props) {
    super(props)
    this.renderChildren = this.renderChildren.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onSelectChange = this.onSelectChange.bind(this)
    this.onChange = this.onChange.bind(this)
    this.state = {
      startDate: "",
      endDate: "",
      bbox: "",
      providers: [],
    }
  }

  async onSubmit(item) {
    // window.location.replace("https://api.communitysnowobs.org/obs?limit=10000&format=geojson");
    let providers = this.state.providers.map(x => x.value)
    let params = {
      min_timestamp: this.state.startDate != "" ? new Date(this.state.startDate).getTime() : null,
      max_timestamp: this.state.endDate != "" ? new Date(this.state.endDate).getTime() : null,
      src: providers != [] ? providers.join(",") : null,
      bbox: this.state.bbox != "" ? this.state.bbox : null,
      limit: 10000
    }


    let response = await axios.get('https://api.communitysnowobs.org/obs', { transformResponse: undefined, params: params})
    download(response.data, 'cso.geojson', 'application/vnd.geo+json')

    this.setState({
      startDate: "",
      endDate: "",
      bbox: "",
      providers: []
    })
  }

  onChange(e, key) {
    console.log(key)
    this.setState({[key]: e.target.value})
  }

  onSelectChange(x) {
    this.setState({providers: x})
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
              subtitle="DD/MM/YYYY"
              placeholder="01/01/2016"
              value = {this.state.startDate}
              onChange= {(e) => this.onChange(e, "startDate")}
            />
          </div>
          <div className = "right">
            <Input
              title="End Date"
              subtitle="DD/MM/YYYY"
              placeholder="10/30/2018"
              value = {this.state.endDate}
              onChange= {(e) => this.onChange(e, "endDate")}
            />
          </div>
          <Input
            title="Bounding Box"
            subtitle="  Longitude in (-180°, 180°)"
            placeholder="min_long,max_lat,max_long,min_lat"
            value = {this.state.region}
            onChange = {(e) => this.onChange(e, "bbox")}
          />
            <Dropdown
              title="Providers"
              subtitle="Select one or more"
              instanceId="providers"
              placeholder="Select Providers"
              options={options}
              onChange={this.onSelectChange}
              value={this.state.providers}
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
.map-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -100;
}
.map {
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
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
