/**
 * @fileOverview Defines wrapper functions for manipulating filter state through actions
 * @author Jonah Joughin
 */

import ActionTypes from './actionTypes';

// Add new filters
export const addFilters = filters => {
  return {
    type: ActionTypes.ADD_FILTERS,
    ...filters
  };
};

// Set filter list
export const setFilters = filters => {
  return {
    type: ActionTypes.SET_FILTERS,
    ...filters
  };
};

// Set selected indices on discrete filter
export const setSelectedDiscreteFilter = (idx, selectedIdxs) => {
  return {
    type: ActionTypes.SET_SELECTED_DISCRETE_FILTER,
    idx,
    selectedIdxs
  };
};

// Set the feature collection to filter by on geo filter
export const setFeatureCollectionGeoFilter = featureCollection => {
  return {
    type: ActionTypes.SET_FEATURE_COLLECTION_GEO_FILTER,
    featureCollection
  };
};

// Set the draw mode of the geo filter
export const setDrawModeGeoFilter = drawMode => {
  return {
    type: ActionTypes.SET_DRAW_MODE_GEO_FILTER,
    drawMode
  };
};

// Set the selected range on range filter
export const setSelectedRangeFilter = (idx, selected) => {
  return {
    type: ActionTypes.SET_SELECTED_RANGE_FILTER,
    idx,
    selected
  };
};

// Request asynchronous update of GPU enabled filter on CPU
// Map updates of GPU-enabled filters are done on the GPU, but updates on the CPU, which are reflected in the statistics, are debounced using this action
export const requestFullFilterEvaluationOnCPU = () => {
  return {
    type: ActionTypes.REQUEST_FULL_FILTER_EVALUATION_ON_CPU
  };
};
