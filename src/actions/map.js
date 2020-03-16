/**
 * @fileOverview Defines wrapper functions for manipulating map state through actions
 * @author Jonah Joughin
 */

import ActionTypes from './actionTypes';

// Sets map view state
// This is used directly by Deck.GL
export const setMapViewState = viewState => {
  return {
    type: ActionTypes.SET_MAP_VIEW_STATE,
    viewState
  };
};
