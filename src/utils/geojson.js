/**
 * @fileOverview Defines geojson utilities
 * @author Jonah Joughin
 */

import union from '@turf/union';
import intersect from '@turf/intersect';

// Creates featureCollection object from list of features
export const featureCollection = (features = []) => ({
  type: 'FeatureCollection',
  features
});

// Calculates union of features
export const featureUnion = features => features.reduce(union);
// Calculates intersection of features
export const featureIntersection = features => features.reduce(intersect);
// Allows for computed properties to be added to feature collection
export const injectProperties = injector => fc => {
  return featureCollection(
    fc.features.map(feature => ({
      ...feature,
      properties: {
        ...feature.properties,
        ...injector(feature.properties, feature.geometry)
      }
    }))
  );
};
