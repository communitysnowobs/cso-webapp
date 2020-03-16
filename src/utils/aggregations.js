/**
 * @fileOverview Defines aggregation utilities
 * @author Jonah Joughin
 */

import { map } from './objects';

// Allows aggregations to be computed over transformed values of an array
const withTransform = aggFn => (array, transformFn) => {
  if (transformFn === undefined) {
    return aggFn(array);
  } else {
    return aggFn(map(array, transformFn));
  }
};

// Returns minimum value in a list
const _min = list => {
  if (list.length > 0) {
    return list.reduce((a, b) => (a < b ? a : b), list[0]);
  }
  throw 'List must be nonempty';
};

// Returns maximum value in a list
const _max = list => {
  if (list.length > 0) {
    return list.reduce((a, b) => (a > b ? a : b), list[0]);
  }
  throw 'List must be nonempty';
};

// Returns value range of a list
const _bounds = list => {
  return [_min(list), _max(list)];
};

// Returns mean value of a list
const _mean = list => {
  if (list.length > 0) {
    return list.reduce((a, b) => a + b, 0.0) / list.length;
  }
  return 0;
};

// Returns unique values in a list
const _uniq = list => {
  return [...new Set(list)];
};

// Returns number of unique values in a list
const _countUniq = list => {
  return _uniq(list).length;
};

// Returns length of a list
const _count = list => list.length;

// Wrappers allowing aggregations to be computed over transformed lists
export const min = withTransform(_min);
export const max = withTransform(_max);
export const bounds = withTransform(_bounds);
export const mean = withTransform(_mean);
export const uniq = withTransform(_uniq);
export const countUniq = withTransform(_countUniq);
export const count = withTransform(_count);
