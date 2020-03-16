import * as React from 'react';
import { connect } from 'react-redux';
import { aggregations, graphs, tableColumns } from '../../config/analytics';
import { map } from '../../utils/objects';
import Table from '../molecules/Table';
import fileDownload from 'js-file-download';
import { styled } from 'baseui';
import { theme } from '../../config/theme';
import HideCloseWrapper from '../molecules/HideCloseWrapper';
import { featureCollection } from '../../utils/geojson';
import Title from '../atoms/Heading';
import Graph from '../molecules/Graph';
import Summary from '../molecules/Summary';
import { PrimaryButton } from '../atoms/Button';
import { spacingBottomRight } from '../../utils/css';

const Wrapper = styled('div', {
  boxSizing: 'border-box',
  height: '100vh',
  width: '350px',
  color: '#2a2a2a',
  backgroundColor: theme.colors.mono100,
  boxShadow: '#A0A0A0 0px 0px 50px',
  zIndex: 10,
  display: 'flex',
  flexDirection: 'column'
});

const InnerWrapper = styled('div', {
  padding: '1.5rem 1.5rem 0rem 1.5rem',
  overflowY: 'scroll'
});

const PanelSection = styled('div', {
  padding: 'initial',
  margin: '0 0 1rem 0',
});

const _renderAggregation = features => agg => (
  <Summary name={agg.name} value={agg.transform(agg.fn(features))} />
);

const _renderGraph = features => graph => (
  <PanelSection>
    <Graph features={features} graph={graph} />
  </PanelSection>
);

const _downloadGeoJSON = features =>
  fileDownload(JSON.stringify(featureCollection(features)), 'cso-data.geojson');

const Panel = ({ features }) => {
  return (
    <HideCloseWrapper
      buttonCss={{
        margin: spacingBottomRight(theme.sizing.scale12),
        boxShadow: '0px 0px 40px #A0A0A0'
      }}
      css={{
        display: 'flex',
        alignItems: 'flex-end',
        position: 'absolute',
        right: '0',
        bottom: '0',
        maxHeight: '1vh'
      }}
      name={'Analytics'}
    >
      {features.length > 0 ? (
        <Wrapper>
          <InnerWrapper>
            <Title>{'Summary'}</Title>
            <PanelSection>{map(aggregations, _renderAggregation(features))}</PanelSection>
            <Title>{'Graphs'}</Title>
            {map(graphs, _renderGraph(features))}
            <Title>{'Observations'}</Title>
            <Table features={features} columns={tableColumns}></Table>
          </InnerWrapper>
          <PrimaryButton
            margin={'1.5rem'}
            padding={'1rem'}
            css={{ flexGrow: 0 }}
            onClick={() => _downloadGeoJSON(features)}
          >
            {'Download Data'}
          </PrimaryButton>
        </Wrapper>
      ) : null}
    </HideCloseWrapper>
  );
};

const mapStateToProps = ({ observations }) => {
  return {
    features: observations.filtered.features
  };
};

export default connect(mapStateToProps)(Panel);
