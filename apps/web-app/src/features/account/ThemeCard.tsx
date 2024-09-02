import { getThemeForMode } from '#src/theme/theme';
import {
  Button,
  Card,
  Grid2,
  ThemeProvider,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useUpdateUser, type User } from '@open-zero/features';
import { useAuthRequired } from '../auth/useAuth';

interface Props {
  themeName: string;
  themeMode: User['themePreference'];
  subtext?: string;
}

export function ThemeCard({ themeMode, themeName, subtext }: Props) {
  const updateUserMutation = useUpdateUser();
  const { user, refreshUser } = useAuthRequired();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const isSelected = user.themePreference === themeMode;

  const theme =
    themeMode === 'system'
      ? prefersDarkMode
        ? getThemeForMode('dark')
        : getThemeForMode('light')
      : getThemeForMode(themeMode);

  return (
    <ThemeProvider theme={theme}>
      <Card
        sx={{
          p: 2,
          backgroundColor: (theme) => theme.palette.background.default,
          borderColor: (theme) =>
            isSelected ? theme.palette.primary.main : undefined,
          borderWidth: isSelected ? 2 : undefined,
        }}
      >
        <Grid2 container spacing={2}>
          <Grid2
            size={{
              xs: 6,
            }}
          >
            <Typography sx={{ fontWeight: 'bold', mb: subtext ? 1 : 2 }}>
              {themeName}
            </Typography>
            {subtext && <Typography sx={{ mb: 1 }}>{subtext}</Typography>}
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => {
                updateUserMutation.mutate(
                  {
                    themePreference: themeMode,
                    id: user.id,
                  },
                  {
                    onSuccess: () => {
                      void refreshUser();
                    },
                  },
                );
              }}
            >
              Use {themeName.toLocaleLowerCase()}
            </Button>
          </Grid2>
          <Grid2
            size={{
              xs: 6,
            }}
          >
            <Card sx={{ p: 1 }}>
              <Typography sx={{ mb: 1 }}>
                Hello hello! This is an example of the {themeName.toLowerCase()}{' '}
                theme.
              </Typography>
              <Typography variant="caption">{themeName}!</Typography>
            </Card>
          </Grid2>
        </Grid2>
      </Card>
    </ThemeProvider>
  );
}
