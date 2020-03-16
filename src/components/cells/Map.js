import React, { Component } from 'react';
import DeckGL from '@deck.gl/react';
import { MapView, MapController } from '@deck.gl/core';
import { StaticMap, NavigationControl } from 'react-map-gl';
import axios from 'axios';
import { connect } from 'react-redux';
import { setMapViewState } from '../../actions/map';
import {
  setObservations,
  setHoveredObservation
} from '../../actions/observations';
import {
  setFeatureCollectionGeoFilter,
  setSelectedRangeFilter,
  setFilters,
  setDrawModeGeoFilter
} from '../../actions/filters';
import { featureUnion, injectProperties } from '../../utils/geojson';
import {
  getFilteredObservationsLayer,
  getObservationsLayer,
  getEditableGeoJsonLayer
} from '../../layers';
import filterConfig from '../../config/filters';
import FilterPanel from './FilterPanel';
import AnalyticsPanel from './AnalyticsPanel';
import Tooltip from './Tooltip';
import Attribution from '../molecules/Attribution';
import { ViewMode } from '@nebula.gl/edit-modes/dist/lib/view-mode';
import { map } from '../../utils/objects';
import { uniq, countUniq, bounds } from '../../utils/aggregations';
import { range, round, restrictBounds, stringHash } from '../../utils/math';

const styles = {
  mapContainer: {
    alignItems: 'stretch',
    display: 'flex',
    height: '100vh'
  }
};

const initialDiscreteFiltersState = (discreteFiltersConfig, observations) =>
  map(discreteFiltersConfig, (filter, idx) => ({
    values: uniq(observations.features, obs => obs.properties[filter.field]),
    selected: range(
      0,
      countUniq(observations.features, obs => obs.properties[filter.field])
    ),
    id: stringHash(`${filter.name}-${idx}`),
    ...filter
  }));

const initialRangeFiltersState = (rangeFiltersConfig, observations) =>
  map(rangeFiltersConfig, (filter, idx) => {
    let filterBounds = bounds(
      observations.features,
      obs => obs.properties[filter.field]
    );
    let maxFilterBounds = filter.maxBounds || filterBounds;
    let roundedFilterBounds = map(filterBounds, b =>
      round(b, filter.step || 1)
    );
    let roundedMaxFilterBounds = map(maxFilterBounds, b =>
      round(b, filter.step || 1)
    );
    let restrictedBounds = restrictBounds(
      roundedFilterBounds,
      roundedMaxFilterBounds
    );

    return {
      bounds: restrictedBounds,
      selected: restrictedBounds,
      id: stringHash(`${filter.name}-${idx}`),
      ...filter
    };
  });

class Map extends Component {
  componentDidMount() {
    window.addEventListener('resize', this._resize);

    axios.get('/data.geojson').then(res => {
      let { discrete: discreteFilters, range: rangeFilters } = filterConfig;

      let data = injectProperties(({ timestamp }) => ({
        _ms: new Date(timestamp).getTime()
      }))(res.data);

      discreteFilters = initialDiscreteFiltersState(discreteFilters, data);
      rangeFilters = initialRangeFiltersState(rangeFilters, data);

      console.log(discreteFilters, rangeFilters);

      filterConfig.discrete = discreteFilters;
      filterConfig.range = rangeFilters;

      this.props.setObservations(data);
      this.props.setFilters(filterConfig);
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
    clearInterval(this.interval);
  }

  _resize = () => {
    this.forceUpdate();
  };

  renderStaticMap(viewport) {
    return (
      <StaticMap
        {...viewport}
        mapStyle={process.env.MAPBOX_STYLE}
        mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
        attributionControl={false}
      >
        <div
          style={{
            position: 'absolute',
            margin: '10px',
            top: 12,
            left: 12,
            zIndex: 1,
            borderRadius: '6px',
            border: 'none !important',
            boxShadow: '0px 0px 20px #A0A0A0'
          }}
        >
          <NavigationControl
            onViewportChange={viewState =>
              this.props.setViewState({ viewState })
            }
          />
        </div>
      </StaticMap>
    );
  }

  onEdit = ({ updatedData }) => {
    if (updatedData.features.length > 1) {
      updatedData.features = [featureUnion(updatedData.features)];
    }
    this.props.setFeatureCollectionGeoFilter(updatedData);
    this.props.setDrawModeGeoFilter(ViewMode);
  };

  render() {
    const editableGeoJsonLayer = getEditableGeoJsonLayer(
      this.props.geoFilterFeatureCollection,
      this.onEdit,
      this.props.filters.geo
    );
    const filteredObservationsLayer = getFilteredObservationsLayer(
      this.props.cpuFilteredObservations,
      this.props.filters.range,
      this.props.setHoveredObservation
    );

    const observationsLayer = getObservationsLayer(this.props.allObservations);
    const layers = [
      observationsLayer,
      editableGeoJsonLayer,
      filteredObservationsLayer
    ];

    return (
      <div style={styles.mapContainer}>
        <link
          href='https://api.mapbox.com/mapbox-gl-js/v0.44.0/mapbox-gl.css'
          rel='stylesheet'
        />
        <DeckGL
          viewState={this.props.viewState}
          getCursor={editableGeoJsonLayer.getCursor.bind(editableGeoJsonLayer)}
          layers={layers}
          views={
            new MapView({
              id: 'basemap',
              controller: {
                type: MapController
              }
            })
          }
          onViewStateChange={this.props.setViewState}
        >
          {this.renderStaticMap(this.props.viewState)}
          <Tooltip target={this.props.hoveredObservation}></Tooltip>
        </DeckGL>
        <FilterPanel />
        <AnalyticsPanel />
        <Attribution
          css={{
            position: 'absolute !important',
            top: '100px !important',
            right: '0px !important'
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ map, observations, filters }) => {
  return {
    viewState: map,
    allObservations: observations.all,
    hoveredObservation: observations.hovered,
    cpuFilteredObservations: observations.cpuFiltered,
    geoFilterFeatureCollection: filters.geo.featureCollection,
    filters
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setViewState: ({ viewState }) => dispatch(setMapViewState(viewState)),
    setObservations: observations => dispatch(setObservations(observations)),
    setFeatureCollectionGeoFilter: featureCollection =>
      dispatch(setFeatureCollectionGeoFilter(featureCollection)),
    setSelectedRangeFilter: (idx, selected) =>
      dispatch(setSelectedRangeFilter(idx, selected)),
    setFilters: filters => dispatch(setFilters(filters)),
    setHoveredObservation: observation =>
      dispatch(setHoveredObservation(observation)),
    setDrawModeGeoFilter: drawMode => dispatch(setDrawModeGeoFilter(drawMode))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Map);
