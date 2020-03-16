/**
 * @fileOverview Defines template link component
 * @author Jonah Joughin
 */

import { styled } from 'baseui';

const Link = styled('a', ({ $theme, color, css = {} }) => ({
  color: color || $theme.colors.primary,
  textDecoration: 'underline',
  '&:hover,:link,:active,:visited': {
    color: color || $theme.colors.primary
  },
  ...css
}));

export default Link;
