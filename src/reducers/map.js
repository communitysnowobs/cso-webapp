/**
 * @fileOverview Defines observations reducer
 * @author Jonah Joughin
 */

import ActionTypes from '../actions/actionTypes';

const initialState = {
  latitude: 37.76,
  longitude: -122.44,
  bearing: 0,
  pitch: 0,
  zoom: 2
};

export const mapReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_MAP_VIEW_STATE:
      return { ...state, ...action.viewState };
    default:
      return state;
  }
};
