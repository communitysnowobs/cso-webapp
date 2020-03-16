import * as React from 'react';
import { connect } from 'react-redux';
import {
  setDrawModeGeoFilter,
  setFeatureCollectionGeoFilter
} from '../../actions/filters';
import { useStyletron } from 'baseui';
import { DrawRectangleMode, DrawPolygonMode } from '@nebula.gl/edit-modes';
import { DrawCircleFromCenterMode } from '@nebula.gl/edit-modes/dist/lib/draw-circle-from-center-mode';
import { featureCollection } from '../../utils/geojson';

import { styled } from 'baseui';
import { theme } from '../../config/theme';
import { spacingBottomRight } from '../../utils/css';

const options = [
  {
    mode: DrawCircleFromCenterMode,
    path: 'icons/circle',
    title: 'Select Circle',
    onClick: dispatch =>
      dispatch(setDrawModeGeoFilter(DrawCircleFromCenterMode))
  },
  {
    mode: DrawRectangleMode,
    path: 'icons/rectangle',
    title: 'Select Rectangle',
    onClick: dispatch => dispatch(setDrawModeGeoFilter(DrawRectangleMode))
  },
  {
    mode: DrawPolygonMode,
    path: 'icons/polygon',
    title: 'Select Polygon',
    onClick: dispatch => dispatch(setDrawModeGeoFilter(DrawPolygonMode))
  },
  {
    mode: undefined,
    path: 'icons/delete',
    title: 'Clear Selection',
    onClick: dispatch =>
      dispatch(setFeatureCollectionGeoFilter(featureCollection()))
  }
];

const Wrapper = styled('div', {
  paddingTop: theme.sizing.scale300,
  display: 'flex',
  flexWrap: 'wrap'
});

const geoFilterControl = ({ drawMode, dispatch }) => {
  const [useCss, theme] = useStyletron();
  return (
    <Wrapper>
      {options.map((value, i) => (
        <img
          src={
            drawMode == value.mode
              ? `${value.path}-selected.png`
              : `${value.path}-unselected.png`
          }
          className={useCss({
            width: '36px',
            height: '36px',
            margin: spacingBottomRight(theme.sizing.scale400),
            cursor: 'pointer'
          })}
          title={value.title}
          onClick={() => value.onClick(dispatch)}
        ></img>
      ))}
    </Wrapper>
  );
};

const mapStateToProps = ({ filters }) => {
  return filters.geo;
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(geoFilterControl);
