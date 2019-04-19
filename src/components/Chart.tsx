/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled'

import { NextFC } from "next"
import * as Recharts from 'recharts'

export interface ChartPoint {
  value: number,
  date: string
}

interface Props {
  data: Array<ChartPoint>,
  unit: string,
  className?: string
}

export const AreaChart: NextFC<Props> = ({data, unit, className}) => (
  <Frame className={className}>
    <Recharts.ResponsiveContainer width="100%" height={200}>
      <Recharts.AreaChart
        data={data}
        margin={{top: 20, right: 20, bottom: 0, left: -10}}>
        <Recharts.XAxis
          dataKey="date"
          tick={{fontSize: 9, textAnchor: 'middle'}}
          interval = {'preserveStartEnd'}
        />
        <Recharts.YAxis tick={{fontSize: 9}} unit={unit}/>
        <Recharts.Area isAnimationActive={false} type="monotone" dataKey="value" stroke="#08f" strokeWidth={2} fill="#63B6FF" fillOpacity={1} dot={{r: 2, strokeWidth: 2, stroke: "#08f"}}/>
      </Recharts.AreaChart>
    </Recharts.ResponsiveContainer>
  </Frame>
)

const Frame = styled.div({
  borderRadius: "5px",
  border: "1px solid #D7D7D7",
  backgroundColor: "#FCFCFC",
})
