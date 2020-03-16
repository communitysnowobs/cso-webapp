/**
 * @fileOverview Defines template pill component s
 * @author Jonah Joughin
 */

import { styled } from 'baseui';
import { spacingBottomRight } from '../../utils/css';

const Pill = styled('div', ({ $theme, padding, margin, active, css = {} }) => ({
  backgroundColor: active ? $theme.colors.primary : $theme.colors.primary200,
  color: active ? $theme.colors.primary50 : $theme.colors.primary500,
  fontSize: $theme.typography.font150.fontSize,
  borderRadius: '6px',
  cursor: 'pointer',
  padding: padding || $theme.sizing.scale400,
  margin: margin || spacingBottomRight($theme.sizing.scale400),
  ...css
}));

export default Pill;
