import { hex2rgb } from '../utils/color';
import { map } from '../utils/objects';
import { DataFilterExtension } from '@deck.gl/extensions';
import { GeoJsonLayer } from '@deck.gl/layers';
import GL from '@luma.gl/constants';
import {
  EditableGeoJsonLayer,
  ViewMode
} from 'nebula.gl';
import { withAlpha, withBrightness } from '../utils/color';

const editHandleColor = hex2rgb('#ff8000');
const featureColor = hex2rgb('#0088ff');
const inactiveColor = hex2rgb('#8A8A8A');
const whiteColor = hex2rgb('#FFF');

const getFilterValue = gpuFilters => obs =>
  map(gpuFilters, f => obs.properties[f.field]);

const getFilterRange = gpuFilters =>
  map(gpuFilters, f => [
    f.selected[0] - f.gpu.softMargin,
    f.selected[1] + f.gpu.softMargin
  ]);

const getFilterSoftRange = gpuFilters => map(gpuFilters, f => f.selected);

export const getFilteredObservationsLayer = (
  cpuFilteredObservations,
  filters,
  setHoveredObservation
) => {

  const gpuFilters = filters.filter(f => f.gpu !== undefined)
  const id = map(gpuFilters, filter => filter.name).join('/');

  const layer = new GeoJsonLayer({
    id: 'filtered-observations' + id,
    data: cpuFilteredObservations,
    pickable: true,
    filled: true,
    getFillColor: featureColor,
    getLineColor: whiteColor,
    pointRadiusMinPixels: 4,
    lineWidthMinPixels: 1.5,
    getLineWidth: 8,
    getRadius: 24,
    getFilterValue: getFilterValue(gpuFilters),
    filterRange: getFilterRange(gpuFilters),
    filterSoftRange: getFilterSoftRange(gpuFilters),
    filterTransformSize: true,
    onHover: info => setHoveredObservation(info),
    // Define extensions
    extensions:
      gpuFilters.length > 0
        ? [new DataFilterExtension({ filterSize: gpuFilters.length })]
        : []
  });
  return layer;
};

// Returns layer of all observations
export const getObservationsLayer = allObservations =>
  new GeoJsonLayer({
    data: allObservations,
    getFillColor: inactiveColor,
    getLineColor: whiteColor,
    getLineWidth: 5,
    getRadius: 15,
    id: 'all-observations',
    lineWidthMinPixels: 1,
    pointRadiusMinPixels: 2.5,
    stroked: true
  });

// Returns editable GeoJSON layer
export const getEditableGeoJsonLayer = (
  geoFilterFeatureCollection,
  onEdit,
  geoFilter
) => {
  const layer = new EditableGeoJsonLayer({
    // Parameterized properties
    data: geoFilterFeatureCollection,
    mode: geoFilter.drawMode || ViewMode,
    onEdit: onEdit,

    autoHighlight: false,
    editHandlePointRadiusScale: 2,
    editHandleType: 'point',
    getEditHandlePointColor: () => editHandleColor,
    getFillColor: withAlpha(withBrightness(featureColor, 0.4), 0.2),
    getLineColor: featureColor,
    id: 'filter-area',
    parameters: {
      depthTest: true,
      depthMask: false,
      blend: true,
      blendEquation: GL.FUNC_ADD,
      blendFunc: [GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA]
    },
    pointRadiusMinPixels: 5,
    selectedFeatureIndexes: []
  });

  return layer;
};
