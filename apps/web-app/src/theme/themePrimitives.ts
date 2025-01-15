import { alpha, type CssVarsThemeOptions } from '@mui/material/styles';

export const colorSchemes: CssVarsThemeOptions['colorSchemes'] = {
  light: {
    palette: {
      primary: {
        main: '#4f46e5',
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
        paper: '#fff',
        default: '#f9f5f3',
      },
      text: {
        heading: '#0f172a',
        primary: '#334155',
        secondary: '#475569',
        disabled: '#64748b',
      },
      divider: '#eaddd5',
      grey: {
        '50': '#f9fafb',
        '100': '#f3f4f6',
        '200': '#e5e7eb',
        '300': '#d1d5db',
        '400': '#9ca3af',
        '500': '#6b7280',
        '600': '#4b5563',
        '700': '#374151',
        '800': '#1f2937',
        '900': '#111827',
      },
    },
  },
  dark: {
    palette: {
      primary: {
        main: '#818cf8',
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
        paper: '#020617',
        default: '#0f172a',
      },
      text: {
        heading: '#e2e8f0',
        primary: '#94a3b8',
        secondary: '#64748b',
        disabled: '#475569',
      },
      divider: alpha('#E0E0E0', 0.18),
    },
  },
};

declare module '@mui/material/styles' {
  interface TypeText {
    heading: string;
  }
}
