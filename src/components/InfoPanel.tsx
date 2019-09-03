/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import * as moment from 'moment';
import * as R from 'ramda'
import * as React from 'react'
import { NextFC } from "next"
import { Observation } from '../types/Observation'
import { AreaChart, ChartPoint } from './Chart'
import Table, {Column} from './Table'
import { A } from './Common'
import { AppContext } from './AppContext'
import { ObservationsContext } from '../context/Observations';
import { FunctionalContext } from '../context/Functional';

type Aggregation = (values: Array<number> | Array<string>) => string | Array<string> | number | Array<number>
type ChartAggregation = (values: Array<number> | Array<string>, key: string) =>  ChartPoint | Array<ChartPoint>

interface LineItemProps {
  name: String,
  value: React.ReactNode
}

const urls = {
  SnowPilot: "https://snowpilot.org",
  MountainHub: "https://about.mountainhub.com/about/",
  regObs: "https://www.regobs.no"
}

// Aggregate using the following functions to avoid excessive looping over large feature collections
const aggregate = (features: Array<any>, aggregations: Record<string, Aggregation>) : Record<string, number | string>=> {
  return R.applySpec(aggregations)(features) as Record<string, number | string>
}

const aggregateMonthly = (features: Array<any>, aggregations: Record<string, ChartAggregation>) : Record<string, Array<ChartPoint>> => {
  const minDate = moment(R.reduce(R.min, Infinity, R.map(R.prop('timestamp'), features)))
  const maxDate = moment(R.reduce(R.max, -Infinity, R.map(R.prop('timestamp'), features)))
  const months : Record<string, ChartPoint> = {};

  R.until(
    R.gt(R.__, maxDate),
    ((m : moment.Moment) : moment.Moment => {
      months[m.format('YYYY-MM')] = {value: NaN, date: m.format('YYYY-MM')};
      return m.add(1, 'month')
    }),
    minDate
  )

  const groupedFeatures = R.groupBy(({timestamp} : {timestamp : number}) => moment(timestamp).format('YYYY-MM'))(features)

  return R.applySpec(R.map((aggregator : ChartAggregation) =>
    R.pipe(
      R.mapObjIndexed(aggregator), // Aggregate
      R.mergeWith((x,y) => ((!y || (Array.isArray(y) && y.length == 0)) ? x : y), months),
      R.values,
      R.flatten,
    ), aggregations))(groupedFeatures) as Record<string, Array<ChartPoint>>
}

const aggregations : Record<string, Aggregation> = {
  meanDepth : R.compose(R.mean, R.map(R.prop("depth"))),
  minDepth : R.compose(R.reduce(R.min, Infinity), R.map(R.prop("depth"))),
  maxDepth : R.compose(R.reduce(R.max, -Infinity), R.map(R.prop("depth"))),
  meanElevation : R.compose(R.mean, R.map(R.prop("elevation"))) ,
  minElevation : R.compose(R.reduce(R.min, Infinity), R.map(R.prop("elevation"))),
  maxElevation : R.compose(R.reduce(R.max, -Infinity), R.map(R.prop("elevation"))) ,
  minTimestamp : R.compose(R.reduce(R.min, Infinity), R.map(R.prop("timestamp"))),
  maxTimestamp : R.compose(R.reduce(R.max, -Infinity), R.map(R.prop("timestamp"))) ,
  contributors : R.compose(R.length, R.uniq, R.map(R.prop("author"))),
  sources :  R.compose(R.uniq, R.map(R.prop("source")))
}

const monthlyAggregations : Record<string, ChartAggregation> = {
  monthlyAverages : (values, key) : ChartPoint => ({value: R.mean(R.map(R.prop("depth"), values)), date: key}),
  monthlyCounts : (values, key) : ChartPoint => ({value: R.map(R.prop("depth"), values).length, date: key})
}

const tableFormatters : Array<Column> = ([
  { name: "Depth", transformer: (f : Observation) : string =>  f.depth.toPrecision(3) + " cm"},
  { name: "Location", transformer: (f : Observation) : string => {
    let lat = Math.abs(f.latitude).toPrecision(4)
    let latSuffix = f.latitude >= 0 ? "°N" : "°S"
    let long = Math.abs(f.longitude).toPrecision(4)
    let longSuffix = f.longitude >= 0 ? "°E" : "°W"
    return lat + latSuffix + ", " + long + longSuffix
  }},
  { name: "Elevation", transformer: (f : Observation) : string => f.elevation.toPrecision(4) + " m"},
  { name: "Date", transformer: (f : Observation) : string => {
    let date = new Date(f.timestamp)
    return moment(date).format("YYYY/MM/DD")
  }},
  { name: "Source", transformer: (f : Observation) : React.ReactNode => <A href={urls[f.source]} target="_blank">{f.source}</A>}
])

const LineItem : NextFC<LineItemProps> =  ({name, value}) => (
  <MetaRow>
    <MetaTitle>{name}</MetaTitle>
    <MetaValue>{value}</MetaValue>
  </MetaRow>
)

const Panel: NextFC<{}> = () => {

  const observations = React.useContext(ObservationsContext)
  const fn = React.useContext(FunctionalContext)

  const selected = observations.selected
  const parsedObservations = selected.map(fn.observations.parse).sort((a,b) => b.timestamp - a.timestamp)

  // Compute aggregate information
  const agg = aggregate(parsedObservations, aggregations)
  const aggMonthly = aggregateMonthly(parsedObservations, monthlyAggregations)

  return (
          <Wrapper>
            <Header>
              <Title>{selected.length}</Title>
              <Subtitle>{"Observations"}</Subtitle>
            </Header>
            <HiddenDivider/>
            { React.Children.toArray(R.flatten(R.intersperse(<Divider/>, [
              <LineItem name = {"Mean Depth"} value={agg.meanDepth.toPrecision(3) + " cm"}/>,
              <LineItem name = {"Mean Elevation"} value={agg.meanElevation.toFixed(1) + " m"}/>,
              <LineItem name = {"Depth Range"} value={agg.minDepth.toFixed(1) + " cm - " + agg.maxDepth.toFixed(1) + " cm"}/>,
              <LineItem name = {"Elevation Range"} value={agg.minElevation.toFixed(1) + " m - " + agg.maxElevation.toFixed(1) + " m"}/>,
              <LineItem name = {"Providers"} value={R.intersperse(", ", R.map(x => <A href={urls[x]} key={x} target={"_blank"}>{x}</A>, agg.sources))}/>,
              <LineItem name = {"Contributors"} value={agg.contributors}/>,
              <LineItem name = {"Temporal Extent"} value={moment(agg.minTimestamp).format("MMM Do YYYY, HH:mm A") + " - " + moment(agg.maxTimestamp).format("MMM Do YYYY, hh:mm A")}/>,
              [<MetaTitle>{"Depth Plot"}</MetaTitle>,
              <AreaChart data={aggMonthly.monthlyAverages} unit={"cm"} css={{margin: "0.75rem 0"}}/>],
              [<MetaTitle>{"Frequency Plot"}</MetaTitle>,
              <AreaChart data={aggMonthly.monthlyCounts} unit={"/mo"} css={{margin: "0.75rem 0"}}/>],
              [<MetaTitle>{"Observations"}</MetaTitle>,
              <Table columns={tableFormatters} features={parsedObservations} css={{margin: "0.75rem 0"}}/>]])))}
            <Footer>
              <Button>Download</Button>
            </Footer>
          </Wrapper>)
}

const Wrapper = styled.div`
  position: fixed;
  height: 100%;
  right: 0;
  width: 380px;
  box-shadow: #A0A0A0 0px 0px 50px;
  background-color: #FEFEFE;
  z-index: 100;
  padding: 0 1.5rem;
  overflow-y: scroll;
`
const Header = styled.div`
  padding: 3rem 0;
  position: sticky;
  top: 0;
  background-color: #FFF;
  z-index: 100;
  border-bottom: 1px solid #D8D8D8;
`
const Footer = styled.div`
  padding: 1rem 0;
  position: sticky;
  bottom: 0;
  background-color: #FFF;
  z-index: 100;
  border-top: 1px solid #D8D8D8;
`
const Button = styled.div`
  border-radius: 5px;
  background-color: #08f;
  color: white;
  padding: 1rem;
  font-weight: 400;
  text-align: center;
`
const Divider = styled.div`
  height: 1px;
  background-color: #D8D8D8;
  margin: 0.75rem 0;
`
const HiddenDivider = styled.div`
  height: 0px;
  padding: 0.375rem 0;
`
const MetaRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
  color: #2a2a2a;
  max-width: 100%;
`
const MetaTitle = styled.div`
  font-weight: 500;
  margin-right: 1rem;
`
const MetaValue = styled.div`
  font-weight: 400;
  margin-left: 1rem;
  text-align: right;
`
const Title = styled.div`
  font-size: 2.25rem;
  color: #08f;
  font-weight: 700;
  text-align: center;
  width: 100%;
`
const Subtitle = styled.div`
  font-size: 1.25rem;
  color: #2a2a2a;
  font-weight: 400;
  text-align: center;
  width: 100%;
`

export default Panel