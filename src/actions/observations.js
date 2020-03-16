/**
 * @fileOverview Defines wrapper functions for manipulating observations data through actions
 * @author Jonah Joughin
 */

import ActionTypes from './actionTypes';

// Set pre-filtered observations data
export const setObservations = all => {
  return {
    type: ActionTypes.SET_OBSERVATIONS,
    all
  };
};

// Set observations data filtered by cpu filters
export const setCPUFilteredObservations = cpuFiltered => {
  return {
    type: ActionTypes.SET_CPU_FILTERED_OBSERVATIONS,
    cpuFiltered
  };
};

// Set observations data filtered by both CPU/GPU filters
// GPU filters are debounced and run on CPU
export const setFilteredObservations = filtered => {
  return {
    type: ActionTypes.SET_FILTERED_OBSERVATIONS,
    filtered
  };
};

// Set observations underneath mouse pointer
export const setHoveredObservation = hovered => {
  return {
    type: ActionTypes.SET_HOVERED_OBSERVATION,
    hovered
  };
};
