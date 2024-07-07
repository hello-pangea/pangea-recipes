import { getThemeForMode } from '#src/theme/theme';
import {
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
  useMediaQuery,
} from '@mui/material';
import { useSignedInUser } from '@open-zero/features';

interface Props {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: Props) {
  const userQuery = useSignedInUser();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const userThemePreference = userQuery.data?.user?.themePreference ?? 'light';

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
