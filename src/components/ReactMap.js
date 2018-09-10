import {Component} from 'react';
import ReactMapGL from 'react-map-gl';
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

    this._toggleClustered = this._toggleClustered.bind(this)
    this.onClick = this.onClick.bind(this)
    this.onResize = this.onResize.bind(this)
    this._getData = this._getData.bind(this)
    this._setLoaded = this._setLoaded.bind(this)
  }

  componentDidMount() {
    this.map.current.getMap().on('style.load', this._setLoaded)
    window.addEventListener('resize', this.onResize)
    this._getData()
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
      this._registerLayers()
      this._setClustered()
    }
    if (!prevState.clustered != this.state.clustered) {

    }
  }
  async _getData() {
    let res = await axios.get('/static/data.geojson')
    this.setState({observations: res.data})
  }

  _registerLayers() {
    let map = this.map.current.getMap()
    map.addSource("obs-clustered", {
        type: "geojson",
        data: this.state.observations,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 75
    });
    map.addSource("obs-unclustered", {
        type: "geojson",
        data: this.state.observations,
    });
    map.addLayer({
        id: "clusters",
        type: "circle",
        source: "obs-clustered",
        filter: ["has", "point_count"],
        ...clusterStyle
    });
    map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "obs-clustered",
        filter: ["has", "point_count"],
        ...clusterCountStyle
    });
    map.addLayer({
        id: "snow_obs",
        type: "circle",
        source: "obs-clustered",
        filter: ["!has", "point_count"],
        ...snowObsStyle
    });
    map.addLayer({
      id: "snow_obs_unclustered",
      type: "circle",
      source: "obs-unclustered",
      visibility: "none",
      ...snowObsStyle
    })
  }
  _setLoaded() {
    this.setState({loaded:true})
  }
  _setLayerVisibility(layer, visibility) {
    let map = this.map.current.getMap()
    map.setLayoutProperty(layer, 'visibility', visibility);
  }
  _setClustered() {
    this._setLayerVisibility("snow_obs_unclustered", "none")
    this._setLayerVisibility("clusters", "visible")
    this._setLayerVisibility("cluster-count", "visible")
    this._setLayerVisibility("snow_obs", "visible")
  }
  _setUnclustered() {
    this._setLayerVisibility("snow_obs_unclustered", "visible")
    this._setLayerVisibility("clusters", "none")
    this._setLayerVisibility("cluster-count", "none")
    this._setLayerVisibility("snow_obs", "none")
  }

  _toggleClustered(value) {
    if (value == "Clustered") this._setClustered();
    else if (value == "Unclustered") this._setUnclustered()
  }

  render() {
    return (
      <div className = "root">

        <ReactMapGL
          ref={this.map}
          {...this.state.viewport}
          className = {'map'}
          mapStyle={'mapbox://styles/mapbox/dark-v9'}
          onViewportChange={(viewport) => this.setState({viewport})}
          onClick={this.onClick}
        >
          {this.state.selected &&
            <Popup geometry={this.state.selected.geometry} properties={this.state.selected.properties}/>
          }
        </ReactMapGL>
        <RadioGroup initiallySelected = "Clustered" onItemChanged = {this._toggleClustered}>
          <RadioItem title={"Clustered"} />
          <RadioItem title={"Unclustered"} />
        </RadioGroup>
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
