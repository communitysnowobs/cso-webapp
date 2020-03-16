/**
 * @fileOverview Defines color utilities
 * @author Jonah Joughin
 */

import { map } from './objects';

// Converts hex code to rgb
export const hex2rgb = hex => {
  // Strip hash
  hex = hex.startsWith('#') ? hex.slice(1) : hex;
  // Double half length hex codes
  hex =
    hex.length == 3
      ? hex[0].repeat(2) + hex[1].repeat(2) + hex[2].repeat(2)
      : hex;

  const value = parseInt(hex, 16);
  return [16, 8, 0].map(shift => (value >> shift) & 0xff);
};

// Returns color with specified brightness
export const withBrightness = (color, bright) => {
  // Strip hash
  return [...map(color.slice(0, 3), c => c * bright), ...color.slice(3)];
};

// Returns color with specified alpha
export const withAlpha = (color, alpha) => {
  return [...color.slice(0, 3), alpha * 255];
};
