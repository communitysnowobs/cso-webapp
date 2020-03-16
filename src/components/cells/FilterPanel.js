import { styled } from 'baseui';
import { connect } from 'react-redux';
import { intersperse } from '../../utils/objects';
import { RangeFilterControl } from '../molecules/RangeFilterControl';
import GeoFilterControl from '../molecules/GeoFilterControl';
import DiscreteFilterControl from '../molecules/DiscreteFilterControl';
import HorizontalRule from '../atoms/HorizontalRule';
import { theme } from '../../config/theme';
import HideCloseWrapper from '../molecules/HideCloseWrapper';
import Label from '../atoms/Label';
import { spacingTop } from '../../utils/css';

const Container = styled('div', {
  position: 'absolute',
  left: theme.sizing.scale800,
  bottom: theme.sizing.scale800
});

const ControlWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  paddingLeft: theme.sizing.scale600,
  paddingRight: theme.sizing.scale600,
  paddingTop: theme.sizing.scale300,
  paddingBottom: theme.sizing.scale300
});

const _renderDiscreteFilter = (filter, idx) => (
  <ControlWrapper>
    <Label css={{ width: '90px', flex: 'none', fontSize: '1 rem' }}>
      {filter.name}
    </Label>
    <DiscreteFilterControl idx={idx} />
  </ControlWrapper>
);

const _renderGeoFilter = () => (
  <ControlWrapper>
    <Label css={{ width: '90px', flex: 'none', fontSize: '1 rem' }}>
      {'Region'}
    </Label>
    <GeoFilterControl />
  </ControlWrapper>
);

const _renderRangeFilter = (filter, idx) => (
  <ControlWrapper>
    <Label css={{ width: '90px', flex: 'none', fontSize: '1 rem' }}>
      {filter.name}
    </Label>
    <RangeFilterControl idx={idx} />
  </ControlWrapper>
);

const FilterPanel = props => (
  <div
    style={{
      backgroundColor: 'white',
      borderRadius: '6px',
      width: '340px',
      boxShadow: '0px 0px 40px #A0A0A0'
    }}
  >
    {intersperse(
      [
        props.filters.range.map((filter, idx) =>
          _renderRangeFilter(filter, idx)
        ),
        props.filters.geo.enabled ? _renderGeoFilter() : null,
        props.filters.discrete.map((filter, idx) =>
          _renderDiscreteFilter(filter, idx)
        )
      ].flat(),
      <HorizontalRule />
    )}
  </div>
);

const FilterPanelWrapper = props => (
  <Container>
    <HideCloseWrapper
      buttonCss={{
        margin: spacingTop(theme.sizing.scale8),
        boxShadow: '0px 0px 40px #A0A0A0'
      }}
      css={{
        display: 'flex',
        alignItems: 'flex-start',
        flexDirection: 'column-reverse'
      }}
      name={'Filters'}
    >
      <FilterPanel {...props} />
    </HideCloseWrapper>
  </Container>
);

const mapStateToProps = ({ filters }) => ({
  filters
});

export default connect(mapStateToProps)(FilterPanelWrapper);