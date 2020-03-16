/**
 * @fileOverview Defines template button components
 * @author Jonah Joughin
 */

import { styled } from 'baseui';

const Heading = styled('div', ({ $theme, padding, margin, css = {} }) => ({
    fontWeight: 700,
    fontSize: $theme.sizing.scale10,
    padding: padding || 'initial',
    margin: margin || '0 0 1rem',
    ...css
}));

export default Heading