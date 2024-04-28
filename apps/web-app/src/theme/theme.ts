import { LinkBehavior } from '#src/components/LinkBehavior';
import type {} from '@mui/lab/themeAugmentation';
import { alpha, createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1e66f5',
    },
    secondary: {
      main: '#8839ef',
    },
    success: {
      main: '#40a02b',
    },
    warning: {
      main: '#df8e1d',
    },
    error: {
      main: '#d20f39',
    },
    background: {
      paper: '#e6e9ef',
      default: '#eff1f5',
    },
    text: {
      primary: '#4c4f69',
      secondary: '#5c5f77',
      disabled: '#6c6f85',
    },
    divider: alpha('#4c4f69', 0.18),
  },
  typography: {
    fontFamily: 'Inter Variable',
    fontSize: 16,
    h1: {
      fontFamily: 'Vollkorn Variable',
      fontWeight: 'bold',
      fontSize: 32,
    },
    h2: {
      fontFamily: 'Vollkorn Variable',
      fontWeight: 'bold',
      fontSize: 22,
    },
    h3: {
      fontFamily: 'Vollkorn Variable',
      fontWeight: 'bold',
      fontSize: 16,
    },
    h6: {
      fontFamily: 'Vollkorn Variable',
      fontWeight: 'bold',
      fontSize: 16,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: 16,
    },
    body2: {
      fontSize: 13,
    },
    caption: {
      fontSize: 12,
      lineHeight: 1,
      color: 'rgb(85, 94, 104)',
      textTransform: 'none',
      display: 'block',
    },
    button: {
      textTransform: 'none',
      fontSize: 16,
      fontWeight: 'bold',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
            @font-face {
              font-family: 'Inter Variable', sans-serif;
              font-style: normal;
              font-display: swap;
              font-weight: 400;
            }
            
            @font-face {
              font-family: 'Vollkorn Variable', serif;
              font-style: normal;
              font-display: swap;
              font-weight: 400;
            }
          `,
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: '100vmax',
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
    MuiListItemButton: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
    MuiIconButton: {
      styleOverrides: {
        sizeMedium: {
          '& .MuiSvgIcon-root': {
            fontSize: 22,
          },
        },
      },
    },
  },
});
