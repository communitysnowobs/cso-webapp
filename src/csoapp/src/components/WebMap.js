import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';
import GeoJSON from 'geojson';
import moment from 'moment';

import NoticeBox from './NoticeBox';
import FilterBox from './FilterBox';


mapboxgl.accessToken = 'pk.eyJ1IjoibHNldGlhd2FuIiwiYSI6ImNpbjI3M2UzNzBiZzh2OWtrZGlzZ2FhaG8ifQ.tkoR6uJikfFpOq4jfsk02w';




class WebMap extends Component {
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
            end_date: end
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
            url: '/cso/observations',
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
            .catch((err) => console.log(err))
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

    componentDidMount() {
        const { lng, lat, zoom } = this.state;

        const map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/streets-v9',
            center: [lng, lat],
            zoom
        });

        const nav = new mapboxgl.NavigationControl();
        map.addControl(nav, 'bottom-right');

        map.addControl(new mapboxgl.ScaleControl({
            maxWidth: 80,
            unit: 'imperial'
        }));

        map.on('load', () => {
            // this.getObservations();
            this.getGeoJSON();
        }).on('click', 'snow_obs', (e) => {
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
        }).on('mouseenter', 'snow_obs', function () {
            map.getCanvas().style.cursor = 'pointer';
        }).on('mouseleave', 'snow_obs', function () {
            map.getCanvas().style.cursor = '';
        });



        this.setState({webmap: map});
    }

    render() {
        const style = {
            top: 0,
            bottom: 0,
            width: '100%',
            height: '100%'
        };

        // if (this.state.data !== null){
        //     this.state.data.forEach((obs) => {
        //         new mapboxgl.Marker().setLngLat([obs.coords[1], obs.coords[0]]).addTo(this.state.webmap);
        //     });
        // }

        if (this.state.geojson !== null) {
            this.state.webmap.addSource("snow_observations", {
                type: "geojson",
                // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
                // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
                data: this.state.geojson,
                cluster: true,
                clusterMaxZoom: 14, // Max zoom to cluster points on
                clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
            });
            this.state.webmap.addLayer({
                id: "clusters",
                type: "circle",
                source: "snow_observations",
                filter: ["has", "point_count"],
                paint: {
                    // Use step expressions (https://www.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
                    // with three steps to implement three types of circles:
                    //   * Blue, 20px circles when point count is less than 100
                    //   * Yellow, 30px circles when point count is between 100 and 750
                    //   * Pink, 40px circles when point count is greater than or equal to 750
                    "circle-color": [
                        "step",
                        ["get", "point_count"],
                        "#51bbd6",
                        100,
                        "#f1f075",
                        750,
                        "#f28cb1"
                    ],
                    "circle-radius": [
                        "step",
                        ["get", "point_count"],
                        20,
                        100,
                        30,
                        750,
                        40
                    ]
                }
            });

            this.state.webmap.addLayer({
                id: "cluster-count",
                type: "symbol",
                source: "snow_observations",
                filter: ["has", "point_count"],
                layout: {
                    "text-field": "{point_count_abbreviated}",
                    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                    "text-size": 12
                }
            });

            this.state.webmap.addLayer({
                id: "snow_obs",
                type: "circle",
                source: "snow_observations",
                filter: ["!has", "point_count"],
                paint: {
                    "circle-color": "#ff0000",
                    "circle-radius": 10,
                    "circle-stroke-width": 1,
                    "circle-stroke-color": "#fff"
                }
            });
        }

        return (
            <div style={{width: '100%', height: '100%'}}>
                <div ref={el => this.mapContainer = el} style={style}/>
                <NoticeBox/>
                <FilterBox start_date={this.state.start_date} end_date={this.state.end_date}/>
            </div>
        );
    }
}

export default WebMap;