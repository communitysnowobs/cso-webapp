import { spacingLeft } from '../../utils/css';
import Label from '../atoms/Label';
import { theme } from '../../config/theme';
import { styled } from 'baseui';

const Wrapper = styled('div', {
  display: 'flex',
  fontSize: theme.typography.font200.fontSize,
  justifyContent: 'space-between',
  paddingTop: theme.sizing.scale400,
  paddingBottom: theme.sizing.scale400
});

const Summary = ({ name, value }) => (
  <Wrapper>
    <Label>{name}</Label>
    <Label textAlign={'right'} margin={spacingLeft('1rem')}>
      {value}
    </Label>
  </Wrapper>
);

export default Summary;
