import React, {Component} from 'react';
import DeckGL, {HexagonLayer, ScreenGridLayer, GridLayer} from 'deck.gl';
import MapGL from 'react-map-gl';
import axios from 'axios';

import css from 'styled-jsx/css'

import SanFrancisco from "../data/samples/SanFrancisco.js"
import SNODAS from '../data/samples/SNODAS.js'

import { hexStyle_1, hexStyle_2, squareStyle_2 } from '../styles/deck.js'

// Data to be used by the LineLayer
const data = SNODAS

class Deck extends Component {

  state = {
    viewport: {
      longitude: -122.41669,
      latitude: 37.7853,
      zoom: 8,
      pitch: 0,
      bearing: 0
    },
    size: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    geojson: {
      features: null
    }
  }

  constructor(props) {
    super(props)
    this.setViewport = this.setViewport.bind(this)
  }

  setViewport(viewport) {
    this.setState({
      viewport: {
        longitude: viewport.longitude,
        latitude: viewport.latitude,
        zoom: viewport.zoom,
        pitch: viewport.pitch,
        bearing: viewport.bearing
      }
    })
  }

  getGeoJSON(geom) {
      const baseurl = '';

      let payload = {
          url: 'http://127.0.0.1:8000/cso/observations',
          data: {
              source: "mtnhub",
              start_date: "2017-10-01",
              end_date: "2018-04-30",
              export: "GeoJSON"
          }
      };

      if (geom !== null) {
          payload.data = {...payload.data, geom: geom}
      }

      const cso = axios.create({
          baseURL: baseurl,
          headers: {
              'Content-Type': 'application/json'
          }
      });

      cso.post(payload.url, payload.data)
          .then((response) => {
              this.setState({
                  geojson: response.data
              })
              console.log("Data!")
              console.log(response.data)
          })
          .catch((err) => {
            console.log("Problem here")
            console.log(err)
          })
  }
  componentDidMount() {
      this.getGeoJSON()
  }

  render() {
    const layer = new GridLayer({
      id: 'hexagon-layer',
      data: data,
      getPosition: d => d.coordinates,
      getColorValue: points => {
        const average = points.reduce(((sum, next) => sum + next.snow_depth), 0) / points.length
        return average
      },
      getElevationValue: points => {
        const average = points.reduce(((sum, next) => sum + next.snow_depth), 0) / points.length
        return average
      },
      onHover: ({object}) => setTooltip(`${object.centroid.join(', ')}\nCount: ${object.points.length}`),
      ...squareStyle_2
    });
    console.log("Layer", layer)
    const gridlayer = new ScreenGridLayer({
    id: 'screen-grid-layer',
    data: data,
    pickable: false,
    opacity: 0.8,
    cellSizePixels: 5,
    minColor: [1,152,189,0],
    maxColor: [1,152,189,255],
    getPosition: d => d.coordinates,
    getWeight: d => Math.log(parseInt(d.snow_depth)),
    onHover: ({object}) => setTooltip('aggregated cell')
  });

    return (
      <div className = 'root'>
          <MapGL mapStyle="mapbox://styles/mapbox/dark-v9" {...this.state.viewport} {...this.state.size} mapboxApiAccessToken={process.env.MapboxAccessToken} onViewportChange={this.setViewport}>
            <DeckGL {...this.state.viewport} {...this.state.size} layers={[layer]} />
          </MapGL>
          <style jsx>{style}</style>
      </div>
    )
  }
}

const style = css`
  .root {
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
  #attribution {
    position: fixed;
    bottom: 0;
    right: 0;
  }
`

export default Deck
