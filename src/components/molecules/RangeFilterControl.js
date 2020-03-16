import * as React from 'react';
import { Slider } from 'baseui/slider';
import { useStyletron } from 'baseui';
import { connect } from 'react-redux';
import {
  setSelectedRangeFilter,
} from '../../actions/filters';

const slider = ({ name, bounds, selected, setSelected, display, step }) => {
  const [useCss, theme] = useStyletron();
  return (
      <Slider
        value={selected}
        min={bounds[0]}
        max={bounds[1]}
        onChange={({ value }) => value && setSelected(value)}
        step={step}
        overrides={{
          TickBar: ({ $value }) => (
            <div
              className={useCss({
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: theme.sizing.scale400,
                fontFamily: theme.typography.font150.fontFamily,
                fontSize: theme.typography.font150.fontSize,
                color: theme.colors.primary400
              })}
            >
              <div>{display($value[0])}</div>
              <div>{display($value[1])}</div>
            </div>
          ),
          ThumbValue: ({ $value }) => null,
          Thumb: () => (
            <div
              className={useCss({
                position: 'absolute',
                display: 'block',
                borderRadius: '4px',
                width: '3px',
                backgroundColor: '#fff',
                border: '3px solid #08f',
                height: '16px'
              })}
            ></div>
          ),
          Track: {
            style: ({ $theme }) => {
              return {
                paddingTop: theme.sizing.scale800,
                paddingLeft: theme.sizing.scale0,
                paddingRight: theme.sizing.scale0
              };
            }
          },
          Root: {
            style: ({ $theme }) => {
              return {
                padding: theme.sizing.scale0,
                margin: theme.sizing.scale0
              };
            }
          }
        }}
      />
  );
};

const mapStateToProps = ({ filters }, { idx }) => {
  return filters.range[idx];
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setSelected: selected =>
      dispatch(setSelectedRangeFilter(ownProps.idx, selected))
  };
};

export const RangeFilterControl = connect(
  mapStateToProps,
  mapDispatchToProps
)(slider);
