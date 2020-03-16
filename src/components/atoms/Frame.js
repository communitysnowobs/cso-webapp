/**
 * @fileOverview Defines frame component used in graphs
 * @author Jonah Joughin
 */

import { styled } from 'baseui';

const Frame = styled('div', ({ $theme, padding, margin, height, width, css = {} }) => ({
    backgroundColor: $theme.colors.lightGray,
    border: `1px solid ${$theme.colors.mono400}`,
    borderRadius: $theme.sizing.scale3,
    height: height || 'initial',
    width: width || 'initial',
    padding: padding || 'initial',
    margin: margin || 'initial',
    ...css
}));

export default Frame