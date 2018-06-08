import React, { Component } from 'react';
import css from 'styled-jsx/css'
import mapboxgl from 'mapbox-gl';
import ReactMapGL from 'react-map-gl'
import axios from 'axios';
import GeoJSON from 'geojson';
import moment from 'moment';

import { drawStyle, clusterStyle, clusterCountStyle, snowObsStyle } from '../styles/map.js'

mapboxgl.accessToken = process.env.MapboxAccessToken;

class Map extends Component {

    constructor(props) {
        super(props);
        let time = moment();
        const end = time.format('YYYY-MM-DD');
        time.subtract(30, 'days');
        const start = time.format('YYYY-MM-DD');

        this.state = {
            lng: -145.729690,
            lat: 61.128601,
            zoom: 6,
            data: null,
            webmap: null,
            geojson: null,
            source: "mtnhub",
            start_date: start,
            end_date: end,
            viewport: {
              width: 1000,
              height: 800,
              latitude: 61.128601,
              longitude: -145.729690,
              zoom: 6
            }
        };
    }

    static getBBOXGeom(map) {
        // Get at mapBBOX
        let bounds = map.getBounds();
        let x_min  = bounds.getSouthWest().toArray();
        let x_max  = bounds.getNorthWest().toArray();
        let y_min  = bounds.getNorthEast().toArray();
        let y_max  = bounds.getSouthEast().toArray();
        let mapBBOX = [x_min, x_max, y_min, y_max];
        let bboxGeoJSON = GeoJSON.parse({polygon: [mapBBOX]}, {Polygon: 'polygon'});
        console.log(bboxGeoJSON.geometry);
        return bboxGeoJSON.geometry

    }

    getGeoJSON(geom) {
        const baseurl = '';

        let payload = {
            url: 'http://127.0.0.1:8000/cso/observations',
            data: {
                source: this.state.source,
                start_date: this.state.start_date,
                end_date: this.state.end_date,
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
            })
            .catch((err) => {
              console.log("Problem here")
              console.log(err)
            })
    }

    getObservations(geom) {
        const baseurl = '';

        let payload = {
            url: '/cso/observations',
            data: {
                source: "mtnhub",
                start_date: "2017-10-01",
                end_date: "2018-04-30"
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
                    data: response.data.results
                })
            })
            .catch((err) => console.log(err))

    }

    createMap() {

      const { lng, lat, zoom } = this.state;
      const map = new mapboxgl.Map({
          container: this.mapContainer,
          style: 'mapbox://styles/mapbox/light-v9',
          center: [lng, lat],
          attributionControl: false,
          zoom
      });

      const nav = new mapboxgl.NavigationControl();
      map.addControl(nav, 'bottom-right');

      const scale = new mapboxgl.ScaleControl({ maxWidth: 80, unit: 'imperial' })
      map.addControl(scale, 'top-left');

      const draw = new MapboxDraw({
          displayControlsDefault: false,
          controls: {
              polygon: true,
              trash: true
          },
          ...drawStyle
      })
      map.addControl(draw, 'bottom-left')

      map.scrollZoom.disable()
      map.dragRotate.disable();
      map.touchZoomRotate.disableRotation();

      return map
    }

    addLayers(map) {
      map.addSource("snow_observations", {
          type: "geojson",
          data: this.state.geojson,
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50
      });
      map.addLayer({
          id: "clusters",
          type: "circle",
          source: "snow_observations",
          filter: ["has", "point_count"],
          ...clusterStyle
      });
      map.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "snow_observations",
          filter: ["has", "point_count"],
          ...clusterCountStyle
      });
      map.addLayer({
          id: "snow_obs",
          type: "circle",
          source: "snow_observations",
          filter: ["!has", "point_count"],
          ...snowObsStyle
      });
    }

    registerEvents(map) {

      map.on('load', () => { this.getGeoJSON() })

      map.on('click', 'snow_obs', (e) => {
          let coordinates = e.features[0].geometry.coordinates.slice();
          let properties = e.features[0].properties;

          let obs_coords = JSON.parse(properties.coords);
          let template = `<h2>${properties.name}</h2>
                          <table class="table table-bordered table-hover">
                          <tbody>
                              <tr>
                                  <td class="title">Coordinates</td>
                                  <td>${Number.parseFloat(obs_coords[0]).toPrecision(4)}, ${Number.parseFloat(obs_coords[1]).toPrecision(4)}</td>
                              </tr>
                              <tr>
                                  <td class="title">Time Collected</td>
                                  <td>${properties.reported_at}</td>
                              </tr>
                              <tr>
                                  <td class="title">Avg. Snow Depth Measured</td>
                                  <td>${Number.parseFloat(properties.snow_depth).toPrecision(3)} cm</td>
                              </tr>
                          </tbody>
                          </table>`;

          // Ensure that if the map is zoomed out such that multiple
          // copies of the feature are visible, the popup appears
          // over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          new mapboxgl.Popup()
              .setLngLat(coordinates)
              .setHTML(template)
              .addTo(map);

          map.flyTo({center: e.features[0].geometry.coordinates})
      })

      map.on('mouseenter', 'snow_obs', () => {
          map.getCanvas().style.cursor = 'pointer';
      })
      map.on('mouseleave', 'snow_obs', () => {
          map.getCanvas().style.cursor = '';
      })
      map.on('mouseenter', 'clusters', () => {
          map.getCanvas().style.cursor = 'pointer';
      })
      map.on('mouseleave', 'clusters', () => {
          map.getCanvas().style.cursor = '';
      })
      map.on('click', 'clusters', (e) => {
        console.log("Clicked")
        map.flyTo({center: e.features[0].geometry.coordinates, zoom: map.getZoom() + 2})
      })
      map.on('click', 'cluster-count', (e) => {
        console.log("Clicked")
        map.flyTo({center: e.features[0].geometry.coordinates, zoom: map.getZoom() + 2})
      })
    }

    componentDidMount() {

        //const map = this.createMap()
        //this.registerEvents(map)
        //this.setState({webmap: map});
    }

    render() {

        if (this.state.geojson !== null) {
          this.addLayers(this.state.webmap)
        }

        return (
            <div className = 'root'>
                <ReactMapGL {...this.state.viewport} onViewportChange={(viewport) => this.setState({viewport})} />
                <div id="attribution" className="mapboxgl-map mapboxgl-ctrl mapboxgl-ctrl-attrib mapboxgl-compact">
                  <span>
                    {"Snow Observation Data © "}
                    <a href="https://about.mountainhub.com/about/" target="_blank">MountainHub</a>
                    {" | Map Data © "}
                    <a href="https://www.mapbox.com/about/maps/" target="_blank">Mapbox</a> © <a href="http://www.openstreetmap.org/about/" target="_blank">OpenStreetMap</a>
                    {" | "}
                    <a className="mapbox-improve-map" href="https://www.mapbox.com/feedback/?owner=mapbox&amp;id=outdoors-v9&amp;access_token=pk.eyJ1IjoibHNldGlhd2FuIiwiYSI6ImNpbjI3M2UzNzBiZzh2OWtrZGlzZ2FhaG8ifQ.tkoR6uJikfFpOq4jfsk02w" target="_blank">Improve this map</a>
                  </span>
                </div>
                <style jsx>{style}</style>
            </div>
        );
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

export default Map;
