import { theme } from '#src/theme/theme';
import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';

interface Props {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: Props) {
  return (
    // @ts-expect-error for some reason typescript is unhappy here, but it works
    <MuiThemeProvider theme={theme} noSsr forceThemeRerender>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
