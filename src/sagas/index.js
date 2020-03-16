/**
 * @fileOverview Defines root saga
 * @author Jonah Joughin
 */

import { invalidateHandler, evaluateAllFiltersHandler, evaluateCPUOnlyFiltersHandler } from './handlers';
import { all, call, spawn } from 'redux-saga/effects';

// Wraps and starts all sagas. Restarts if errors occur
export function* rootSaga() {
  const sagas = [invalidateHandler, evaluateAllFiltersHandler, evaluateCPUOnlyFiltersHandler];

  yield all(
    sagas.map(saga =>
      spawn(function*() {
        while (true) {
          try {
            yield call(saga);
            break;
          } catch (e) {
            console.log(e);
          }
        }
      })
    )
  );
}
