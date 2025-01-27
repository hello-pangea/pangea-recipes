import { createTheme } from '@mui/material/styles';
import { colorSchemes } from './themePrimitives';

export const theme = createTheme({
  colorSchemes: colorSchemes,
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  typography: {
    fontFamily: '"Inter Variable", sans-serif',
    fontSize: 16,
    h1: {
      fontFamily: '"Lora Variable", serif',
      fontWeight: 'bold',
      fontSize: 36,
      color: 'var(--mui-palette-text-heading)',
    },
    h2: {
      fontFamily: '"Lora Variable", serif',
      fontWeight: 'bold',
      fontSize: 24,
      color: 'var(--mui-palette-text-heading)',
    },
    h3: {
      fontFamily: '"Lora Variable", serif',
      fontWeight: 'bold',
      fontSize: 18,
      color: 'var(--mui-palette-text-heading)',
    },
    h6: {
      fontFamily: '"Lora Variable", serif',
      fontWeight: 'bold',
      fontSize: 16,
      lineHeight: 1.5,
      color: 'var(--mui-palette-text-heading)',
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
      color: 'var(--mui-palette-text-secondary)',
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
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 28,
        },
      },
    },
    MuiDialogTitle: {
      defaultProps: {
        variant: 'h1',
      },
      styleOverrides: {
        root: {
          paddingTop: 24,
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.vars.palette.text.heading,
          textDecorationColor: '#a5b4fc',
          ':hover': {
            textDecorationThickness: 2,
          },
          ...theme.applyStyles('dark', {
            textDecorationColor: '#818cf8',
          }),
        }),
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: 24,
        },
      },
    },
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
    MuiPopover: {
      styleOverrides: {
        paper: {
          borderRadius: 4,
        },
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
