/**
 * @fileOverview Defines template horizontal rule component
 * @author Jonah Joughin
 */

import { styled } from 'baseui';
import { spacingHorizontal } from '../../utils/css';

const HorizontalRule = styled(
  'div',
  ({ $theme, padding, margin, css = {} }) => ({
    height: '1px',
    backgroundColor: $theme.colors.primary300,
    padding: padding || "initial",
    margin: margin || spacingHorizontal($theme.sizing.scale600),
    ...css
  })
);

export default HorizontalRule;
