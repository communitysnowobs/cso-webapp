/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import {Component} from 'react';
import ReactMapGL, {NavigationControl} from 'react-map-gl';
import DeckGL, {GeoJsonLayer, GridLayer, ArcLayer, PolygonLayer, PathLayer} from 'deck.gl';
import DrawController from './DrawController'
import DrawControl from './DrawControl'
import Attribution from './Attribution'
import InfoPanel from './InfoPanel'
import RadioGroup from './RadioGroup'
import RadioItem from './RadioItem'
import axios from 'axios'
import * as R from 'ramda'
import * as turf from "@turf/turf"

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
      observations: {
        all: null,
        selected: null,
        clustering: "clustered",
      },
      checks: {
        map: false,
        layers: false
      },
      controller: {
        drawLayer: null,
        polygon: null,
        mode: "none"
      }
    };

    this.controller = new DrawController({
        setController: this.setController,
    });
  }

  setObservations = (newObservations) => {
    this.setState({observations: {...this.state.observations, ...newObservations}})
  }

  setChecks = (newChecks) => {
    this.setState({checks: {...this.state.checks, ...newChecks}})
  }

  setController = (newController) => {
    this.setState({controller : {...this.state.controller, ...newController}})
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
      this.setObservations({all: res.data})
    })
  }

  parseObservation = (observation) => ({
    longitude: observation.geometry.coordinates[0],
    latitude: observation.geometry.coordinates[1],
    author: observation.properties.author,
    source: observation.properties.source,
    depth: observation.properties.depth,
    elevation: observation.properties.elevation,
    id: observation.properties.id,
    timestamp: new Date(observation.properties.timestamp).getTime()
  })

  componentDidUpdate = (oldProps, oldState) => {
    if (R.all(R.identity, [ (!oldState.observations.all || !oldState.checks.map), this.state.observations.all, this.state.checks.map ])) {
      this.addSources()
      this.addLayers()
      this.setChecks({layers: true})
    }

    if (R.all(R.identity, [ !oldState.controller.polygon, this.state.controller.polygon, this.state.checks.map ])) {
      const points = turf.featureCollection(this.state.observations.all.features)
      const polygon = this.state.controller.polygon
      let sel = turf.pointsWithinPolygon(points, polygon)

      R.pipe(
        x => x.features,
        R.map(this.parseObservation),
        R.sortBy(R.prop('timestamp')),
        (selected => this.setObservations({selected: selected}))
      )(sel)
    }
  }

  onClick = R.when(
    (_ => this.state.controller.mode == "none"),
    R.pipe(
      R.prop('features'),
      R.filter(R.pipe(R.prop('layer'), R.prop('id'), R.includes('snow_obs'))),
      R.map(this.parseObservation),
      R.sortBy(R.prop('timestamp')),
      R.ifElse(
        R.isEmpty,
        selected => this.setObservations({selected: null}),
        selected => this.setObservations({selected})
      )
    )
  )

  onPolygon = () => {
    this.setObservations({selected: null}),
    this.controller.onPolygon()
  }

  onTrash = () => {
    this.setObservations({selected: null}),
    this.controller.onTrash()
  }

  onMapLoad = (_) => this.setChecks({map:true})

  addSources = () => {
    let map = this.mapRef.current.getMap()
    const base = { type: "geojson", data: this.state.observations.all }
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
    x => this.state.checks.layers && this.state.observations.clustering != x,
    R.pipe(
      R.tap(
        (x => this.setObservations({clustering: x}))
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
      <>
        { this.state.observations.selected && <InfoPanel features={this.state.observations.selected}/> }
        <StyledMap
          {...this.state.viewport}
          ref={this.mapRef}
          mapStyle={process.env.MAPBOX_STYLE}
          attributionControl={false}
          onViewportChange={(viewport) => this.setState({viewport})}
          onLoad={this.onMapLoad}
          onClick={this.onClick}
          controller={this.controller}
          doubleClickZoom={false}
        >
          <DeckGL id={this.state.controller.mode == "polygon" ? "deckgl-draw" : "deckgl"}{...this.state.viewport} layers={[ this.controller.drawLayer ]}/>
          <DrawControl onPolygon={this.onPolygon} onTrash={this.onTrash} css={{position: 'absolute', left: '1rem', top: '5rem'}}/>
          <Attribution css={{position: 'absolute !important', bottom: 0, right: 0}}/>
          <RadioGroup
            css={{position: "absolute", left: "1rem", bottom: "1rem"}}
            selected = {this.state.observations.clustering}
            onClick = {this.setClustered}>
            <RadioItem title={"Cluster Data"} action={"clustered"} icon={"static/images/clustered.png"} />
            <RadioItem title={"Uncluster Data"} action={"unclustered"} icon={"static/images/unclustered.png"}/>
          </RadioGroup>
        </StyledMap>
      </>
    );
  }
}

const StyledMap = styled(ReactMapGL)`
  position: absolute;
  cursor: crosshair;
  width: 100%;
  height: 100%;
  z-index: 0;
`

export default ReactMap;
