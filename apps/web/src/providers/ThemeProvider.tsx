import { theme } from '#src/theme/theme';
import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';

interface Props {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: Props) {
  return (
    <MuiThemeProvider theme={theme} noSsr>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
