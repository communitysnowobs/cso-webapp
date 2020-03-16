/**
 * @fileOverview Defines template label component
 * @author Jonah Joughin
 */

import { styled } from 'baseui';

const Label = styled('div', ({ $theme, padding, margin, textAlign, css = {} }) => ({
    fontSize: $theme.sizing.scale7,
    padding: padding || 'initial',
    margin: margin || 'initial',
    textAlign: textAlign || 'inherit',
    ...css
}));

export default Label