import { createTheme, lightThemePrimitives } from 'baseui';

export const theme = createTheme(lightThemePrimitives, {
  colors: {
    primary: '#0088FF',
    white: '#FFF',
    lightGray: '#F8F8F8'
  },
  sizing: {
    scale1: '0.125rem',
    scale2: '0.25rem',
    scale3: '0.375rem',
    scale4: '0.5rem',
    scale5: '0.625rem',
    scale6: '0.75rem',
    scale7: '0.875rem',
    scale8: '1rem',
    scale10: '1.25rem',
    scale12: '1.5rem',
    scale16: '2rem'
  }
});
