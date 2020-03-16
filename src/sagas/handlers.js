/**
 * @fileOverview Defines saga handlers
 * @author Jonah Joughin
 */

import {
  select,
  put,
  actionChannel,
  delay,
  takeEvery,
  takeLatest
} from 'redux-saga/effects';
import ActionTypes from '../actions/actionTypes';
import { featureCollection } from '../utils/geojson';
import {
  setCPUFilteredObservations,
  setFilteredObservations
} from '../actions/observations';
import { waitTakeLatest } from '../utils/saga';
import { requestFullFilterEvaluationOnCPU } from '../actions/filters';
import {
  actionInputNodes,
  cpuOnlyRangeFiltered,
  rangeFiltered
} from './filters';

// Notify all input nodes of action
function* invalidate(action) {
  const state = yield select(state => state);
  for (let node of actionInputNodes) {
    node.set(action, state);
  }
}

// Notify inputs of every Redux action
export function* invalidateHandler() {
  yield takeEvery('*', invalidate);
}

// Evaluate filters which cannot be processed on GPU
function* evaluateCPUOnlyFilters(action) {
  if (!cpuOnlyRangeFiltered._value) {
    const cpuFiltered = cpuOnlyRangeFiltered.get();
    yield put(
      setCPUFilteredObservations(featureCollection(cpuFiltered.features))
    );
  }
  if (action.type != ActionTypes.REQUEST_FULL_FILTER_EVALUATION_ON_CPU) {
    yield put(requestFullFilterEvaluationOnCPU());
  }
}

export function* evaluateCPUOnlyFiltersHandler() {
  const channel = yield actionChannel('*');
  yield waitTakeLatest(channel, evaluateCPUOnlyFilters);
}

// Evaluate all filters
function* evaluateAllFilters() {
  yield delay(250);
  if (!rangeFiltered._value) {
    const filtered = rangeFiltered.get();
    yield put(setFilteredObservations(featureCollection(filtered.features)));
  }
}

export function* evaluateAllFiltersHandler() {
  const channel = yield actionChannel(
    ActionTypes.REQUEST_FULL_FILTER_EVALUATION_ON_CPU
  );
  yield takeLatest(channel, evaluateAllFilters);
}
