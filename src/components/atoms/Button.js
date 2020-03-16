/**
 * @fileOverview Defines template button components
 * @author Jonah Joughin
 */

import { styled } from 'baseui';
import { withStyle } from 'styletron-react';

export const Button = styled('div', ({ padding, margin, css = {} }) => ({
    borderRadius: '0.375rem',
    textAlign: 'center',
    cursor: 'pointer',
    userSelect: 'none',
    padding: padding || 'initial',
    margin: margin || 'initial',
    ...css
}));

export const PrimaryButton = withStyle(Button, ({ $theme }) => ({
    color: 'white',
    backgroundColor: $theme.colors.primary,
}))

export const SecondaryButton = withStyle(Button, ({ $theme }) => ({
    color: $theme.colors.primary,
    backgroundColor: 'white',
}))