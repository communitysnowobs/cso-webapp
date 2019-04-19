/** @jsx jsx */
import { jsx} from '@emotion/core'
import styled from '@emotion/styled'
import { NextFC } from "next"

export interface Column {
  transformer(feature: {}): React.ReactNode,
  name: string
}

interface Props {
  features: Array<{}>,
  columns: Array<Column>,
  className?: string
}

const renderHeader = (columns: Column[]) => (
  <tr>
    {columns.map(column => (<Th key={column.name}>{column.name}</Th>))}
  </tr>
)

const renderFeature = (feature: {}, columns: Column[], even: boolean) => (
  <tr key={feature.id}>
    {columns.map(column => (<Td even={even} key={column.name}>{column.transformer(feature)}</Td>))}
  </tr>
)

const Table: NextFC<Props> = ({features, columns, className}) => (
  <Wrapper className={className}>
    <Scroller>
      <TableEl>
        <thead>
          {renderHeader(columns)}
        </thead>
        <tbody>
          {features.slice(0,100).map((feature, i) => renderFeature(feature, columns, i % 2 == 1))}
        </tbody>
      </TableEl>
    </Scroller>
  </Wrapper>)

const Wrapper = styled.div({
  border: "1px solid #D7D7D7",
  borderRadius: "5px",
  overflow: "hidden"
})

const Scroller = styled.div({
  overflow: 'scroll',
  maxHeight: '300px'
})

const TableEl = styled.table({
  position: "relative",
  borderSpacing: "0px",
  borderCollapse: "separate",
  tableLayout: "auto",
  zIndex: "initial",
  '& th': {
    zIndex: -20,
    position: ['sticky', '-webkit-sticky'],
    top: 0,
    borderTop: 0,
    borderLeft: 0,
    '&:first-of-type': {
      zIndex: -10
    }
  },
  '& td': {
    borderTop: 0,
    borderLeft: 0,
    zIndex: -30,
    position: "relative",
    '&:first-of-type': {
      zIndex: -20,
      position: "absolute"
    }
  },
  '& td:first-of-type, th:first-of-type': {
    borderLeft: 0,
    left: 0,
    position: ['sticky', '-webkit-sticky'],
  },
  '& tr td:last-of-type, tr th:last-of-type': {
    borderRight: '0 !important' // Hide right border
  },
  '& tr:last-of-type td': {
    borderBottom: 0 // Hide bottom border
  },
})

const Td = styled.td({
  fontSize: '0.75rem',
  padding: "0.5rem",
  border: "1px solid #D7D7D7",
  width: "1px",
  whiteSpace: "nowrap"
}, (props : {even? : boolean}) => ({
  backgroundColor: props.even ? "#F0F0F0" : "#FFF"
}))

const Th = styled.th({
  fontSize: '0.875rem',
  fontWeight: 500,
  padding: '0.5rem',
  border: '1px solid #D7D7D7',
  backgroundColor: '#F0F0F0',
  textAlign: 'left'
})

export default Table
