import {Component} from 'react';
import ReactMapGL, {NavigationControl} from 'react-map-gl';
import Attribution from './Attribution.js'
import ObservationPopup from './ObservationPopup.js'
import RadioGroup from './RadioGroup.js'
import RadioItem from './RadioItem.js'
import axios from 'axios'
import css from 'styled-jsx/css'

import { drawStyle, clusterStyle, clusterCountStyle, snowObsStyle } from '../styles/map.js'

class ReactMap extends Component {

  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
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
    this.onLoad = this.onLoad.bind(this)
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize)
    this.getData()
  }

  onClick(e) {
    const filteredFeatures = e.features.filter(feature => feature.layer.id == "snow_obs" || feature.layer.id == "snow_obs_unclustered");
    if (filteredFeatures.length > 0) {
      this.setState({selected: filteredFeatures.slice(0,3)})
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
      this.onCluster()
    }
    if (!prevState.clustered != this.state.clustered) {

    }
  }
  async getData() {
    let res = await axios.get('/static/data.geojson')
    this.setState({observations: res.data})
  }

  registerLayers() {
    let map = this.mapRef.current.getMap()
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
  onLoad(e) {
    console.log("Set loaded")
    this.setState({loaded:true})
  }
  setLayerVisibility(layer, visibility) {
    let map = this.mapRef.current.getMap()
    map.setLayoutProperty(layer, 'visibility', visibility);
  }
  onCluster() {
    this.setLayerVisibility("snow_obs_unclustered", "none")
    this.setLayerVisibility("clusters", "visible")
    this.setLayerVisibility("cluster_count", "visible")
    this.setLayerVisibility("snow_obs", "visible")
  }
  onUncluster() {
    this.setLayerVisibility("snow_obs_unclustered", "visible")
    this.setLayerVisibility("clusters", "none")
    this.setLayerVisibility("cluster_count", "none")
    this.setLayerVisibility("snow_obs", "none")
  }

  toggleClustered(value) {
    if (value == "Clustered") this.onCluster();
    else if (value == "Unclustered") this.onUncluster()
  }

  render() {
    return (
      <div className = "root">
        <ReactMapGL
          {...this.state.viewport}
          ref={this.mapRef}
          className = {'map'}
          mapStyle={process.env.MAPBOX_STYLE}
          attributionControl={false}
          onViewportChange={(viewport) => this.setState({viewport})}
          onClick={this.onClick}
          onLoad={this.onLoad}
        >
          {this.state.selected &&
            <ObservationPopup  selected={this.state.selected}/>
          }
          <div style={{position: 'absolute', right: 12, top: 60}}>
            <NavigationControl onViewportChange={(viewport) => this.setState({viewport})} />
          </div>
          <div className = "attribution">
            <Attribution/>
          </div>
          <div className = "clustering">
            <RadioGroup initiallySelected = "Clustered" onItemChanged = {this.toggleClustered}>
              <RadioItem title={"Clustered"} icon={"static/images/clustered.png"} />
              <RadioItem title={"Unclustered"} icon={"static/images/unclustered.png"}/>
            </RadioGroup>
          </div>
        </ReactMapGL>
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
  .clustering {
    position: absolute;
    left: 0.75rem;
    bottom: 0.75rem;
    z-index: 100;
  }
  .attribution {
    position: absolute;
    bottom: 0;
    right: 0;
  }
`

export default ReactMap;
