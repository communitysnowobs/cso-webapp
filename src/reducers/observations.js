/**
 * @fileOverview Defines observations reducer
 * @author Jonah Joughin
 */

import ActionTypes from '../actions/actionTypes';
import { featureCollection } from '../utils/geojson';

const initialState = {
  all: featureCollection(),
  cpuFiltered: featureCollection(),
  filtered: featureCollection(),
};

export const observationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_OBSERVATIONS: {
      const { all } = action;
      return { ...state, all };
    }
    case ActionTypes.SET_CPU_FILTERED_OBSERVATIONS: {
      const { cpuFiltered } = action;
      return { ...state, cpuFiltered };
    }
    case ActionTypes.SET_FILTERED_OBSERVATIONS: {
      const { filtered } = action;
      return { ...state, filtered };
    }
    case ActionTypes.SET_HOVERED_OBSERVATION: {
      const { hovered } = action;
      return { ...state, hovered };
    }
    default: {
      return state;
    }
  }
};
