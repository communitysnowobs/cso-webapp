import * as React from 'react';
import { connect } from 'react-redux';
import { setSelectedDiscreteFilter } from '../../actions/filters';

import { spacingBottomRight } from '../../utils/css';
import { styled } from 'baseui';
import { theme } from '../../config/theme';
import Pill from '../atoms/Pill';

const Wrapper = styled('div', {
  paddingTop: theme.sizing.scale300,
  display: 'flex',
  flexWrap: 'wrap'
});

const _onClick = (selected, setSelected, i) => {
  let sidx = selected.indexOf(i);
  if (sidx >= 0) {
    const newSelected = [
      ...selected.slice(0, sidx),
      ...selected.slice(sidx + 1)
    ];
    setSelected(newSelected);
  } else {
    const newSelected = [...selected, i];
    setSelected(newSelected);
  }
};

const discreteFilterControl = ({ name, values, selected, setSelected }) => (
    <Wrapper>
      {values.map((value, i) => (
        <Pill
          active={selected.includes(i)}
          margin={spacingBottomRight(theme.sizing.scale400)}
          onClick={() => _onClick(selected, setSelected, i)}
          key={i}
        >
          {value}
        </Pill>
      ))}
    </Wrapper>
)

const mapStateToProps = ({ filters }, { idx }) => {
  return filters.discrete[idx];
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setSelected: selected =>
      dispatch(setSelectedDiscreteFilter(ownProps.idx, selected))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(discreteFilterControl);
