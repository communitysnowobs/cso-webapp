/**
 * @fileOverview Defines root reducer and boilerplate for saga
 * @author Jonah Joughin
 */

import { mapReducer } from './map';
import { filterReducer } from './filters';
import { observationsReducer } from './observations';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { rootSaga } from '../sagas';
import createSagaMiddleware from 'redux-saga';

export const rootReducer = combineReducers({
  map: mapReducer,
  filters: filterReducer,
  observations: observationsReducer
});

export const makeStore = preloadedState => {
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(sagaMiddleware)
  );

  store.sagaTask = sagaMiddleware.run(rootSaga);

  return store;
};
