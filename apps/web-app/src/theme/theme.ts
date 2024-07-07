import { createTheme } from '@mui/material/styles';
import type { User } from '@open-zero/features';
import { autumnTheme, darkTheme, lightTheme, mintTheme } from './themeModes';

export function getThemeForMode(themeMode: User['themePreference']) {
  const partialColorPalette =
    themeMode === 'dark'
      ? darkTheme
      : themeMode == 'autumn'
        ? autumnTheme
        : themeMode == 'mint'
          ? mintTheme
          : lightTheme;

  return createTheme({
    palette: partialColorPalette,
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
        color: partialColorPalette.text?.secondary,
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
}
