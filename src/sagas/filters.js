/**
 * @fileOverview Defines filters as computational graph
 * @author Jonah Joughin
 */

import ActionTypes from '../actions/actionTypes';
import { map, concatAll } from '../utils/objects';
import { keyProduct } from '../utils/math';
import { featureUnion } from '../utils/geojson';
import PolyBush from 'polybush';
import { actionInputNode, functionNode } from '../utils/graph';

// Watches for changes in observations
export const observations = actionInputNode(
  (_, state) => state.observations.all.features,
  (action, _) => [ActionTypes.SET_OBSERVATIONS].includes(action.type)
);

// Watches for changes in discrete filters
export const discreteFilters = actionInputNode(
  (_, state) => state.filters.discrete,
  (action, _) =>
    [
      ActionTypes.ADD_FILTERS,
      ActionTypes.SET_FILTERS,
      ActionTypes.SET_SELECTED_DISCRETE_FILTER
    ].includes(action.type)
);

// Watches for changes in geo filter
export const geoFilter = actionInputNode(
  (_, state) => state.filters.geo,
  (action, _) =>
    [
      ActionTypes.ADD_FILTERS,
      ActionTypes.SET_FILTERS,
      ActionTypes.SET_FEATURE_COLLECTION_GEO_FILTER
    ].includes(action.type)
)

export const cpuOnlyRangeFilters = actionInputNode(
  (_, state) => state.filters.range.filter(f => f.gpu === undefined),
  (action, state) => {
    if (
      [ActionTypes.ADD_FILTERS, ActionTypes.SET_FILTERS].includes(action.type)
    ) {
      return true;
    } else {
      return (
        action.type === ActionTypes.SET_SELECTED_RANGE_FILTER &&
        state.filters.range[action.idx].gpuEnabled !== true
      );
    }
  }
);

export const gpuEnabledRangeFilters = actionInputNode(
  (_, state) => state.filters.range.filter(f => f.gpu !== undefined),
  (action, state) => {
    if (
      [ActionTypes.ADD_FILTERS, ActionTypes.SET_FILTERS].includes(action.type)
    ) {
      return true;
    } else {
      return (
        action.type === ActionTypes.SET_SELECTED_RANGE_FILTER &&
        state.filters.range[action.idx].gpuEnabled === true
      );
    }
  }
);

export const common = functionNode(
  ([observations, discreteFilters]) => {
    let keys = keyProduct(['all'], ...discreteFilters.map(x => x.values));
    const partition = keys.reduce(function(map, obj) {
      map[obj] = [];
      return map;
    }, {});

    const featureToKey = feature => {
      return [
        'all',
        ...discreteFilters.map(filter => feature.properties[filter.field])
      ].join('/');
    };
    for (let feature of observations) {
      partition[featureToKey(feature)].push(feature);
    }

    return {
      partition,
      polyBush: map(
        partition,
        features =>
          new PolyBush(
            features,
            f => f.geometry.coordinates[0],
            f => f.geometry.coordinates[1],
            64,
            Float32Array
          )
      )
    };
  },
  [observations, discreteFilters]
);

export const discreteFiltered = functionNode(
  ([common, discreteFilters]) => {
    const keys = keyProduct(
      ['all'],
      ...discreteFilters.map(filter =>
        filter.selected.map(idx => filter.values[idx])
      )
    );
    const features = concatAll(keys.map(key => common.partition[key]));
    return {
      keys,
      features
    };
  },
  [common, discreteFilters]
);

export const geoFiltered = functionNode(
  ([common, discreteFiltered, geoFilter]) => {
    let features = [];
    if (geoFilter.enabled && geoFilter.featureCollection.features.length > 0) {
      let filterFeature = featureUnion(geoFilter.featureCollection.features);
      features = concatAll(
        discreteFiltered.keys.map(key =>
          common.polyBush[key]
            .geoJSONFeature(filterFeature)
            .map(idx => common.partition[key][idx])
        )
      );
    } else {
      features = discreteFiltered.features;
    }
    return { features };
  },
  [common, discreteFiltered, geoFilter]
);

export const cpuOnlyRangeFiltered = functionNode(
  ([cpuOnlyRangeFilters, geoFiltered]) => {
    let features = geoFiltered.features.filter(
      byRangeFilters(cpuOnlyRangeFilters)
    );
    return { features };
  },
  [cpuOnlyRangeFilters, geoFiltered]
);

export const rangeFiltered = functionNode(
  ([cpuOnlyRangeFiltered, gpuEnabledRangeFilters]) => {
    let features = cpuOnlyRangeFiltered.features.filter(
      byRangeFilters(gpuEnabledRangeFilters)
    );
    return { features };
  },
  [cpuOnlyRangeFiltered, gpuEnabledRangeFilters]
);

const byRangeFilters = rangeFilters => feature => {
  if (rangeFilters) {
    for (let filter of rangeFilters) {
      const val = feature.properties[filter.field];
      if (val < filter.selected[0] || val > filter.selected[1]) {
        return false;
      }
    }
  }
  return true;
};

export const actionInputNodes = [
  observations,
  discreteFilters,
  geoFilter,
  cpuOnlyRangeFilters,
  gpuEnabledRangeFilters
];