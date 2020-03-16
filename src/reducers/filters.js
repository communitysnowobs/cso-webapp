/**
 * @fileOverview Defines filters reducer
 * @author Jonah Joughin
 */

import ActionTypes from '../actions/actionTypes';
import { combineReducers } from 'redux'
import { featureCollection } from '../utils/geojson';

const initialState = [];

export const discreteFilterReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_SELECTED_DISCRETE_FILTER: {
      const { idx, selectedIdxs } = action;
      const newFilter = {
        ...state[idx],
        selected: selectedIdxs
      };
      return [...state.slice(0, idx), newFilter, ...state.slice(idx + 1)];
    }
    case ActionTypes.ADD_FILTERS: {
      const { discrete } = action;
      if (discrete) {
        return [...state, ...discrete];
      }
    }
    case ActionTypes.SET_FILTERS: {
      const { discrete } = action;
      if (discrete instanceof Array) {
        return discrete;
      } else {
        return [];
      }
    }
    default: {
      return state;
    }
  }
};

const initialGeoFilterState = {
  enabled: false,
  featureCollection: featureCollection()
};

export const geoFilterReducer = (state = initialGeoFilterState, action) => {
  switch (action.type) {
    case ActionTypes.SET_FEATURE_COLLECTION_GEO_FILTER: {
      const { featureCollection } = action;
      return {
        ...state,
        featureCollection
      };
    }
    case ActionTypes.SET_DRAW_MODE_GEO_FILTER: {
      const { drawMode } = action;
      return {
        ...state,
        drawMode
      };
    }
    case ActionTypes.SET_FILTERS: {
      const { geo } = action;
      if (geo) {
        return {
          ...state,
          ...geo
        };
      } else {
        return {
          ...state,
          enabled: false
        };
      }
    }
    default: {
      return state;
    }
  }
};

export const rangeFilterReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_SELECTED_RANGE_FILTER: {
      const { idx, selected } = action;
      const newFilter = {
        ...state[idx],
        selected
      };
      return [...state.slice(0, idx), newFilter, ...state.slice(idx + 1)];
    }
    case ActionTypes.ADD_FILTERS: {
      const { range } = action;
      if (range) {
        return [...state, ...range];
      }
    }
    case ActionTypes.SET_FILTERS: {
      const { range } = action;
      if (range instanceof Array) {
        return range;
      } else {
        return [];
      }
    }

    default: {
      return state;
    }
  }
};

export const filterReducer = combineReducers({
  discrete: discreteFilterReducer,
  geo: geoFilterReducer,
  range: rangeFilterReducer
});
