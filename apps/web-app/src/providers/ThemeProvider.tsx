import { useAuth } from '#src/features/auth/AuthProvider';
import { getThemeForMode } from '#src/theme/theme';
import {
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
  useMediaQuery,
} from '@mui/material';

interface Props {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: Props) {
  const { user } = useAuth();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const userThemePreference = user?.themePreference ?? 'system';

  const theme = getThemeForMode(
    userThemePreference === 'system'
      ? prefersDarkMode
        ? 'dark'
        : 'light'
      : userThemePreference,
  );

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
