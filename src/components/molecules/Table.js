import { styled } from 'baseui';
import * as React from 'react';

const renderHeader = columns => (
  <tr>
    {columns.map(column => (
      <Th key={column.name}>{column.name}</Th>
    ))}
  </tr>
);

const renderFeature = (feature, columns, even) => (
  <tr key={feature.id}>
    {columns.map(column => (
      <Td even={even} key={column.name}>
        {column.transform(feature)}
      </Td>
    ))}
  </tr>
);

const Table = ({ features, columns, className }) => {
  const [page, setPage] = React.useState(1);
  const pages = Math.ceil(features.length / 100);
  const scrollRef = React.useRef(null);

  const nextPage = () => {
    setPage(Math.min(page + 1, pages));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  };

  const previousPage = () => {
    setPage(Math.max(page - 1, 1));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  };
  // Reset page when features changes
  React.useEffect(() => setPage(1), [features]);

  return (
    <Wrapper className={className}>
      <Scroller ref={scrollRef}>
        <TableEl>
          <thead>{renderHeader(columns)}</thead>
          <tbody>
            {features
              .slice((page - 1) * 100, page * 100)
              .map((feature, i) => renderFeature(feature, columns, i % 2 == 1))}
          </tbody>
        </TableEl>
      </Scroller>
      {features.length > 100 && (
        <Footer>
          <Arrow src='/icons/left-arrow.png' onClick={previousPage} />
          <PageNo>{'Page ' + page + ' of ' + pages}</PageNo>
          <Arrow src='/icons/right-arrow.png' onClick={nextPage} />
        </Footer>
      )}
    </Wrapper>
  );
};

const PageNo = styled('div', ({ $theme }) => ({
  fontSize: '14px',
  color: '#2A2A2A',
  margin: '0rem 2rem'
}));

const Arrow = styled('img', ({ $theme }) => ({
  objectFit: 'contain',
  height: '1.75rem',
  borderRadius: '5px'
}));

const Footer = styled('div', ({ $theme }) => ({
  height: '2.75rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderTop: '1px solid #D7D7D7'
}));

const Wrapper = styled('div', ({ $theme }) => ({
  border: '1px solid #D7D7D7',
  borderRadius: '5px',
  overflow: 'hidden'
}));

const Scroller = styled('div', ({ $theme }) => ({
  overflow: 'scroll',
  maxHeight: '320px',
  height: 'auto',
  '::-webkit-scrollbar': {
    display: 'none'
  }
}));

const TableEl = styled('table', ({ $theme }) => ({
  position: 'relative',
  borderSpacing: '0px',
  borderCollapse: 'separate',
  tableLayout: 'auto',
  zIndex: 'initial',
  '& tr td:last-of-type, tr th:last-of-type': {
    borderRight: '0 !important' // Hide right border
  },
  '& tr:last-of-type td': {
    borderBottom: 0 // Hide bottom border
  }
}));

const Td = styled('td', ({ $theme, even }) => ({
  fontSize: '0.75rem',
  padding: '0.5rem',
  border: '1px solid #D7D7D7',
  width: '1px',
  whiteSpace: 'nowrap',
  backgroundColor: even ? '#F8F8F8' : '#FFF',
  borderTop: 0,
  borderLeft: 0,
  zIndex: 1,
  position: 'relative',
  ':first-of-type': {
    zIndex: 2,
    position: 'absolute',
    borderLeft: 0,
    left: 0,
    position: 'sticky'
  },
  ':last-of-type': {
    borderRight: '0 !important'
  }
}));

const Th = styled('th', ({ $theme }) => ({
  fontSize: '0.75rem',
  fontWeight: 500,
  padding: '0.5rem',
  border: '1px solid #D7D7D7',
  backgroundColor: '#F8F8F8',
  textAlign: 'left',
  top: 0,
  borderTop: 0,
  borderLeft: 0,
  zIndex: 3,
  position: 'sticky',
  ':first-of-type': {
    zIndex: 4,
    borderLeft: 0,
    left: 0
  },
  ':last-of-type': {
    borderRight: '0 !important'
  }
}));

export default Table;
