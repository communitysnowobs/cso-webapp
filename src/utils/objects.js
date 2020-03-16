/**
 * @fileOverview Defines javascript object utility functions
 * @author Jonah Joughin
 */

// Map function which can be applied to arrays and objects
export const map = (object, fn) => {
  if (Array.isArray(object)) {
    return object.map(fn);
  } else {
    return Object.keys(object).reduce(function(result, key) {
      result[key] = fn(object[key]);
      return result;
    }, {});
  }
};

// Concatenates a series of arrays
export const concatAll = arrays => {
  return [].concat.apply([], arrays);
};

// Intersperses array with separator
export const intersperse = (arr, sep) =>
  arr.reduce((a, v) => [...a, v, sep], []).slice(0, -1);
