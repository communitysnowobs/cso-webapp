/**
 * @fileOverview Defines math utility functions
 * @author Jonah Joughin
 */

// Defines abstract set product
// product defines the function which is applied to pairs of elements
const setProduct = product => {
  const _inner = (a, b) => [].concat(...a.map(d => b.map(e => product(d, e))));
  const _setProduct = (a, b, ...c) =>
    b ? _setProduct(_inner(a, b), ...c) : a || [];
  return _setProduct;
};

// Defines cartesian product of sets
// Ex: [1,2] * [3,4] is [[1,3],[1,4],[2,3],[2,4]]
export const cartesian = setProduct((a, b) => [].concat(a, b));

// Defines analogue of cartesian product defined using strings
// Ex: ["a","b"] * ["c","d"] is ["a/c","a/d","b/c", "b/d"]
export const keyProduct = setProduct((a, b) => a + '/' + b);

// Returns a range of integers
export const range = (start, end, step = 1) => {
  const len = Math.floor((end - start) / step);
  return Array(len)
    .fill()
    .map((_, idx) => start + idx * step);
};

// Rounds a value to the nearest step
export const round = (value, step) => {
  step || (step = 1.0);
  var inv = 1.0 / step;
  return Math.round(value * inv) / inv;
};

// Restricts bounds of the form [min, max]
export const restrictBounds = (bounds, maxBounds) => {
  return [Math.max(bounds[0], maxBounds[0]), Math.min(bounds[1], maxBounds[1])];
};

// Generates simple (non-cryptographic) hash
export const hash = str =>
  str
    .split('')
    .reduce(
      (prevHash, currVal) =>
        ((prevHash << 5) - prevHash + currVal.charCodeAt(0)) | 0,
      0
    );

// Generates simple (non-cryptographic) 16 character string hash
export const stringHash = str => Math.abs(hash(str)).toString(16) + Math.abs(hash(hash(str).toString(16))).toString(16)