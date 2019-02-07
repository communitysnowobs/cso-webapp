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
      isMapLoaded: false,
      selected: null,
    };

    this.toggleClustered = this.toggleClustered.bind(this)
    this.onClick = this.onClick.bind(this)
    this.onResize = this.onResize.bind(this)
    this.loadObservations = this.loadObservations.bind(this)
    this.onMapLoad = this.onMapLoad.bind(this)
  }

  componentDidMount() {
    // Add listener for window resize events
    window.addEventListener('resize', this.onResize)
    // Fetch observations
    this.loadObservations()
  }

  onClick(e) {
    const selected = e.features
      .filter(f => f.layer.id == "snow_obs" || f.layer.id == "snow_obs_unclustered")
      .map(f => ({
        longitude: f.geometry.coordinates[0],
        latitude: f.geometry.coordinates[1],
        author: f.properties.author,
        source: f.properties.source,
        depth: f.properties.depth,
        timestamp: f.properties.timestamp
      }))
      .sort((x,y) => new Date(x.timestamp).getTime() - new Date(y.timestamp).getTime());
    if (selected.length > 0) {
      this.setState({selected})
    }
    else {
      this.setState({selected: null})
    }
  }

  // Resize map viewport on window resize event
  onResize() {
    this.setState({
       viewport: {
         ...this.state.viewport,
         width: window.innerWidth,
         height: window.innerHeight
       }
     })
  }

  // Add data once map and observations have been loaded
  componentDidUpdate(prevProps, prevState) {
    if ((!prevState.observations || !prevState.isMapLoaded) && (this.state.observations && this.state.isMapLoaded)) {
      this.addSources();
      this.addLayers();
    }
  }

  async loadObservations() {
    let res = await axios.get('/static/data.geojson')
    this.setState({observations: res.data})
  }

  addSources() {
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
  }
  addLayers() {
    let map = this.mapRef.current.getMap()
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
      layout: {
        visibility: "none"
      },
      ...snowObsStyle
    })
  }

  onMapLoad(e) {
    this.setState({isMapLoaded:true})
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
          onLoad={this.onMapLoad}
        >
          {this.state.selected &&
            <ObservationPopup features={this.state.selected}/>
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
