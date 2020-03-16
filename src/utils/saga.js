/**
 * @fileOverview Defines saga utility functions
 * @author Jonah Joughin
 */

import { take, fork, flush, join } from 'redux-saga/effects';

// Blocks while task is being completed, then takes most recent in queue, discarding the rest
// Used to avoid unnecessary repeated function calls
export const waitTakeLatest = (patternOrChannel, saga, ...args) =>
  fork(function*() {
    while (true) {
      const action = yield take(patternOrChannel);
      const _ = yield flush(patternOrChannel);
      let lastTask = yield fork(saga, ...args.concat(action));
      join(lastTask);
    }
  });
