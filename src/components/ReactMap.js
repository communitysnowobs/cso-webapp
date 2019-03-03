/** @jsx jsx */
import { jsx, css, keyframes } from '@emotion/core'
import styled from '@emotion/styled'
import {Component} from 'react';
import ReactMapGL, {NavigationControl} from 'react-map-gl';
import Attribution from './Attribution.js'
import ObservationPopup from './ObservationPopup.js'
import RadioGroup from './RadioGroup.js'
import RadioItem from './RadioItem.js'
import axios from 'axios'
import * as R from 'ramda'

import { layers, clusterParams } from '../data/map'

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
      selectedObservations: null,
      clustering: "clustered",
      mapReady: false,
      layersReady: false,

    };
  }

  componentDidMount = () => {
    // Resize map on window resize
    window.addEventListener('resize', () =>
      this.setState({
         viewport: {
           ...this.state.viewport,
           width: window.innerWidth,
           height: window.innerHeight
         }
       })
     )
    // Retrieve observations
    axios.get('/static/data.geojson').then(res => {
      this.setState({observations: res.data})
    })
  }

  componentDidUpdate = R.pipe(
    R.nthArg(1), // state
    R.when(
      x => R.all(R.identity,
        [(!x.observations || !x.mapReady),
          this.state.observations,
          this.state.mapReady
        ]),
      _ => { // add sources and layers when map and observations are ready
        this.addSources()
        this.addLayers()
        this.setState({layersReady: true})
      }
    )
  )

  onClick = R.pipe(
    R.prop('features'),
    R.filter(R.pipe(R.prop('layer'), R.prop('id'), R.includes('snow_obs'))),
    R.map(x => ({
      longitude: x.geometry.coordinates[0],
      latitude: x.geometry.coordinates[1],
      author: x.properties.author,
      source: x.properties.source,
      depth: x.properties.depth,
      timestamp: new Date(x.properties.timestamp).getTime()
    })),
    R.sortBy(R.prop('timestamp')),
    R.ifElse(
      R.isEmpty,
      selectedObservations => this.setState({selectedObservations: null}),
      selectedObservations => this.setState({selectedObservations})
    )
  )

  onMapLoad = (_) => this.setState({mapReady:true})

  addSources = () => {
    let map = this.mapRef.current.getMap()
    const base = { type: "geojson", data: this.state.observations }
    const sources = {
      obs_clustered : { ...base, ...clusterParams },
      obs_unclustered : { ...base }
    }
    R.forEachObjIndexed((v,k) => map.addSource(k,v), sources)
  }

  addLayers = () => {
    let map = this.mapRef.current.getMap()
    R.forEachObjIndexed((v,k) => map.addLayer({...v, id: k}), layers)
  }

  setLayerVisibility = (visible, layer) => {
    let map = this.mapRef.current.getMap()
    map.setLayoutProperty(layer, 'visibility', visible ? 'visible' : 'none');
  }

  setClustered = R.when(
    x => this.state.layersReady && this.state.clustering != x,
    R.pipe(
      R.tap(
        (x => { console.log(x);this.setState({clustering: x})})
      ),
      R.equals(R.__, "clustered"),
      R.tap(R.pipe(
        R.curry(this.setLayerVisibility), //setLayerVisibility(isClustered, __)
        R.forEach(R.__, ['clusters', 'cluster_count', 'snow_obs'])
      )),
      R.not(),
      R.tap(R.pipe(
        R.curry(this.setLayerVisibility), //setLayerVisibility(!isClustered, __)
        R.forEach(R.__, ['snow_obs_unclustered'])
      ))
    )
  )

  render() {
    return (
      <Wrapper>
        <StyledMap
          {...this.state.viewport}
          ref={this.mapRef}
          mapStyle={process.env.MAPBOX_STYLE}
          attributionControl={false}
          onViewportChange={(viewport) => this.setState({viewport})}
          onClick={this.onClick}
          onLoad={this.onMapLoad}
        >
          {this.state.selectedObservations &&
            <ObservationPopup features={this.state.selectedObservations}/>
          }
          <NavigationControlWrapper >
            <NavigationControl onViewportChange={(viewport) => this.setState({viewport})} />
          </NavigationControlWrapper>
          <AttributionWrapper>
            <Attribution/>
          </AttributionWrapper>
          <Clustering>
            <RadioGroup selected = {this.state.clustering} onClick = {this.setClustered}>
              <RadioItem title={"Clustered"} icon={"static/images/clustered.png"} />
              <RadioItem title={"Unclustered"} icon={"static/images/unclustered.png"}/>
            </RadioGroup>
          </Clustering>
        </StyledMap>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  position: relative;
`
const StyledMap = styled(ReactMapGL)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`
const Clustering = styled.div`
  position: absolute;
  left: 0.75rem;
  bottom: 0.75rem;
  z-index: 100;
`
const AttributionWrapper = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
`
const NavigationControlWrapper = styled.div`
  position: absolute;
  right: 12px;
  top: 60px;
`

export default ReactMap;
