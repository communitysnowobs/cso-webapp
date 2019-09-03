/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import ReactMapGL from 'react-map-gl';
import DeckGL, { GeoJsonLayer, GridLayer, ArcLayer, PolygonLayer, PathLayer } from 'deck.gl';
import FilterControl from './FilterControl'
import DrawController from './DrawController'
import DrawControl from './DrawControl'
import Attribution from './Attribution'
import InfoPanel from './InfoPanel'
import RadioGroup from './RadioGroup'
import RadioItem from './RadioItem'
import axios from 'axios'
import * as R from 'ramda'
import * as turf from "@turf/turf"
import * as React from 'react'
import { layers, clusterParams } from '../data/map'
import { Observation } from '../types/Observation'
import { Toggle, ToggleItem } from './Toggle'
import { NextFC } from 'next';
import { ViewportContext } from '../context/Viewport'
import { ObservationsContext } from '../context/Observations';
import { ChecksContext } from '../context/Checks';
import { FunctionalContext } from '../context/Functional';
import { ClusteringContext } from '../context/Clustering';
import { MapContext } from '../context/Map';

interface Props {
  apiToken: string
  style: string
}

const ReactMap: NextFC<Props> = ({ apiToken, style }) => {

  const map = React.useContext(MapContext)
  const viewport = React.useContext(ViewportContext)
  const observations = React.useContext(ObservationsContext)
  const clustering = React.useContext(ClusteringContext)
  const checks = React.useContext(ChecksContext)
  const fn = React.useContext(FunctionalContext)

  // Window resize listener 
  React.useEffect(() => {
    const handleResize = () => {
      fn.setViewport({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize) };
  }, []);

  // Fetching data listener
  React.useEffect(() => {
    axios.get<Array<Observation>>('/static/data.geojson').then(res => {
      fn.setObservations({ all: res.data })
      fn.setChecks({ observations: true })
    })
  }, [])

  // Loading data listener
  React.useEffect(() => {
    if (checks.map && checks.observations && !checks.layers) {
      const base = { type: "geojson", data: observations.all }
      const sources = {
        obs_clustered: { ...base, ...clusterParams },
        obs_unclustered: { ...base }
      }
      fn.map.addSources(sources)
      fn.map.addLayers(layers)
      fn.setChecks({ layers: true })
    }
  }, [checks.map, checks.observations, checks.layers])

  // if (R.all(R.identity, [ !oldState.controller.polygon, this.state.controller.polygon, this.state.checks.map ])) {
  //   const points = turf.featureCollection(this.state.observations.all.features)
  //   const polygon = this.state.controller.polygon
  //   let sel = turf.pointsWithinPolygon(points, polygon)

  //   R.pipe(
  //     x => x.features,
  //     R.map(this.parseObservation),
  //     R.sortBy(R.prop('timestamp')),
  //     (selected => this.setObservations({selected: selected}))
  //   )(sel)
  // }

  const onMapLoad = () => {
    fn.setChecks({ map: true })
  }

  return (
    <>
      {
        React.useMemo(() => (
          observations.selected.length > 0 && <InfoPanel />
        ), [observations])
      }
      {
        React.useMemo(() => (
          <Toggle
            value={clustering.clustered}
            onToggle={fn.setClustered}
            css={{ position: "absolute", left: "1rem", bottom: "1rem" }}>
            <ToggleItem value={true} title={"Cluster Data"} icon={"static/images/clustered.png"} />
            <ToggleItem value={false} title={"Uncluster Data"} icon={"static/images/unclustered.png"} />
          </Toggle>), [clustering])
      }

      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={apiToken}
        mapStyle={style}
        onLoad={onMapLoad}
        onClick={fn.map.onClick}
        onViewportChange={fn.setViewport}
        ref={map}
        doubleClickZoom={false}
        attributionControl={false}
        css={{ width: "100vw", height: "100vh" }}
      >
        {/* <DeckGL id={this.state.controller.mode == "polygon" ? "deckgl-draw" : "deckgl"}{...this.state.viewport} layers={[ this.controller.drawLayer ]}/>
        <DrawControl onPolygon={this.onPolygon} onTrash={this.onTrash} css={{position: 'absolute', left: '1rem', top: '5rem'}}/>
        <Attribution css={{position: 'absolute !important', bottom: 0, right: 0}}/>
        <FilterControl css={{position: 'absolute', bottom: "5rem", left: "1rem"}}/> */}
      </ReactMapGL>
    </>
  );
}

export default ReactMap;
