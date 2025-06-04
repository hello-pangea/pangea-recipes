import { alpha, type CssVarsThemeOptions } from '@mui/material/styles';
import { color } from './colors';

export const colorSchemes: CssVarsThemeOptions['colorSchemes'] = {
  light: {
    palette: {
      primary: {
        main: color.indigo[600],
      },
      secondary: {
        main: '#36558F',
      },
      success: {
        main: '#4d7c0f',
      },
      warning: {
        main: '#df8e1d',
      },
      error: {
        main: '#b91c1c',
      },
      background: {
        paper: color.white,
        default: '#f9f5f3',
      },
      text: {
        heading: color.slate[950],
        primary: color.slate[700],
        secondary: color.slate[600],
        disabled: color.slate[500],
      },
      divider: '#eaddd5',
      grey: color.slate,
    },
  },
  dark: {
    palette: {
      primary: {
        main: color.indigo[400],
      },
      secondary: {
        main: '#F1C40F',
      },
      success: {
        main: '#a3e635',
      },
      warning: {
        main: '#E67E22',
      },
      error: {
        main: '#f87171',
      },
      background: {
        paper: color.slate[950],
        default: color.slate[900],
      },
      text: {
        heading: color.slate[200],
        primary: color.slate[400],
        secondary: color.slate[500],
        disabled: color.slate[600],
      },
      divider: alpha('#E0E0E0', 0.18),
      grey: color.slate,
    },
  },
};

declare module '@mui/material/styles' {
  interface TypeText {
    heading: string;
  }
}
