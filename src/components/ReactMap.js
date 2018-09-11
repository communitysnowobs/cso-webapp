import {Component} from 'react';
import ReactMapGL from 'react-map-gl';
import Attribution from './Attribution.js'
import Popup from './Popup.js'
import RadioGroup from './RadioGroup.js'
import RadioItem from './RadioItem.js'
import axios from 'axios'
import css from 'styled-jsx/css'

import { drawStyle, clusterStyle, clusterCountStyle, snowObsStyle } from '../styles/map.js'

class ReactMap extends Component {

  constructor(props) {
    super(props);
    this.map = React.createRef();
    this.state = {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        latitude: 30,
        longitude: -35,
        zoom: 2,
        mapboxApiAccessToken: process.env.MAPBOX_TOKEN,
      },
      observations: null,
      loaded: false,
      selected: null,
    };

    this.toggleClustered = this.toggleClustered.bind(this)
    this.onClick = this.onClick.bind(this)
    this.onResize = this.onResize.bind(this)
    this.getData = this.getData.bind(this)
    this.setLoaded = this.setLoaded.bind(this)
  }

  componentDidMount() {
    this.map.current.getMap().on('style.load', this.setLoaded)
    window.addEventListener('resize', this.onResize)
    this.getData()
  }

  onClick(e) {
    if (e.features[0].layer.id == "snow_obs" || e.features[0].layer.id == "snow_obs_unclustered") {
      this.setState({selected: e.features[0]})
    }
    else {
      this.setState({selected: null})
    }
  }

  onResize() {
    this.setState({
       viewport: {
         ...this.state.viewport,
         width: window.innerWidth,
         height: window.innerHeight
       }
     })
  }

  componentDidUpdate(prevProps, prevState) {
    if ((!prevState.observations || !prevState.loaded)&& this.state.observations && this.state.loaded) {
      this.registerLayers()
      this.setClustered()
    }
    if (!prevState.clustered != this.state.clustered) {

    }
  }
  async getData() {
    let res = await axios.get('/static/data.geojson')
    this.setState({observations: res.data})
  }

  registerLayers() {
    let map = this.map.current.getMap()
    map.addSource("obs_clustered", {
        type: "geojson",
        data: this.state.observations,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 75
    });
    map.addSource("obs_unclustered", {
        type: "geojson",
        data: this.state.observations,
    });
    map.addLayer({
        id: "clusters",
        type: "circle",
        source: "obs_clustered",
        filter: ["has", "point_count"],
        ...clusterStyle
    });
    map.addLayer({
        id: "cluster_count",
        type: "symbol",
        source: "obs_clustered",
        filter: ["has", "point_count"],
        ...clusterCountStyle
    });
    map.addLayer({
        id: "snow_obs",
        type: "circle",
        source: "obs_clustered",
        filter: ["!has", "point_count"],
        ...snowObsStyle
    });
    map.addLayer({
      id: "snow_obs_unclustered",
      type: "circle",
      source: "obs_unclustered",
      visibility: "none",
      ...snowObsStyle
    })
  }
  setLoaded() {
    this.setState({loaded:true})
  }
  setLayerVisibility(layer, visibility) {
    let map = this.map.current.getMap()
    map.setLayoutProperty(layer, 'visibility', visibility);
  }
  setClustered() {
    this.setLayerVisibility("snow_obs_unclustered", "none")
    this.setLayerVisibility("clusters", "visible")
    this.setLayerVisibility("cluster_count", "visible")
    this.setLayerVisibility("snow_obs", "visible")
  }
  setUnclustered() {
    this.setLayerVisibility("snow_obs_unclustered", "visible")
    this.setLayerVisibility("clusters", "none")
    this.setLayerVisibility("cluster_count", "none")
    this.setLayerVisibility("snow_obs", "none")
  }

  toggleClustered(value) {
    if (value == "Clustered") this.setClustered();
    else if (value == "Unclustered") this.setUnclustered()
  }

  render() {
    return (
      <div className = "root">

        <ReactMapGL
          ref={this.map}
          {...this.state.viewport}
          className = {'map'}
          mapStyle={'mapbox://styles/mapbox/dark-v9'}
          attributionControl={false}
          onViewportChange={(viewport) => this.setState({viewport})}
          onClick={this.onClick}
        >
          {this.state.selected &&
            <Popup geometry={this.state.selected.geometry} properties={this.state.selected.properties}/>
          }
        </ReactMapGL>
        <RadioGroup initiallySelected = "Clustered" onItemChanged = {this.toggleClustered}>
          <RadioItem title={"Clustered"} />
          <RadioItem title={"Unclustered"} />
        </RadioGroup>
        <Attribution/>
        <style jsx>{style}</style>
      </div>
    );
  }
}

const style = css`
  .root {
    position: relative;
  }
  .root > :global(div) {
    background-color: #191a1a;
  }
  .map, .loading-overlay {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .loading-overlay {
    background-color: #191a1a;
  }
`

export default ReactMap;
