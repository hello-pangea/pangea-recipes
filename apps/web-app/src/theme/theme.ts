import { alpha, createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#2E86C1',
    },
    secondary: {
      main: '#F7DC6F',
    },
    success: {
      main: '#58D68D',
    },
    warning: {
      main: '#df8e1d',
    },
    error: {
      main: '#E74C3C',
    },
    background: {
      paper: '#F8F9F9',
      default: '#FDFEFE',
    },
    text: {
      primary: '#2C3E50',
      secondary: '#7F8C8D',
      disabled: '#6c6f85',
    },
    divider: alpha('#2C3E50', 0.18),
  },
  typography: {
    fontFamily: '"Inter Variable", sans-serif',
    fontSize: 16,
    h1: {
      fontFamily: '"Merriweather Sans Variable", serif',
      fontWeight: 'bold',
      fontSize: 32,
    },
    h2: {
      fontFamily: '"Merriweather Sans Variable", serif',
      fontWeight: 'bold',
      fontSize: 22,
    },
    h3: {
      fontFamily: '"Merriweather Sans Variable", serif',
      fontWeight: 'bold',
      fontSize: 16,
    },
    h6: {
      fontFamily: '"Merriweather Sans Variable", serif',
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
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: '100vmax',
        },
        sizeSmall: {
          fontSize: '0.8rem',
        },
      },
    },
    MuiCard: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    // MuiLink: {
    //   defaultProps: {
    //     component: LinkBehavior,
    //   } as LinkProps,
    // },
    // MuiButtonBase: {
    //   defaultProps: {
    //     LinkComponent: LinkBehavior,
    //   },
    // },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 4,
        },
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
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiUseMediaQuery: {
      defaultProps: {
        noSsr: true,
      },
    },
    MuiDialogTitle: {
      defaultProps: {
        variant: 'h2',
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 4,
        },
      },
    },
  },
});

// Fall colors
// primary: {
//   main: '#994636',
// },
// secondary: {
//   main: '#36558F',
// },
// success: {
//   main: '#688E26',
// },
// warning: {
//   main: '#df8e1d',
// },
// error: {
//   main: '#d20f39',
// },
// background: {
//   paper: '#F3ECE2',
//   default: '#fdf6ec',
// },
// text: {
//   primary: '#242423',
//   secondary: '#373F47',
//   disabled: '#6c6f85',
// },
// divider: alpha('#4c4f69', 0.18),

// Light blue colors
// primary: {
//   main: '#2E86C1',
// },
// secondary: {
//   main: '#F7DC6F',
// },
// success: {
//   main: '#58D68D',
// },
// warning: {
//   main: '#df8e1d',
// },
// error: {
//   main: '#E74C3C',
// },
// background: {
//   paper: '#F8F9F9',
//   default: '#FDFEFE',
// },
// text: {
//   primary: '#2C3E50',
//   secondary: '#7F8C8D',
//   disabled: '#6c6f85',
// },
// divider: alpha('#2C3E50', 0.18),
