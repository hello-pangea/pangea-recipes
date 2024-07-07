import { getThemeForMode } from '#src/theme/theme';
import {
  Button,
  Card,
  ThemeProvider,
  Typography,
  useMediaQuery,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useSignedInUser, useUpdateUser, type User } from '@open-zero/features';

interface Props {
  themeName: string;
  themeMode: User['themePreference'];
  subtext?: string;
}

export function ThemeCard({ themeMode, themeName, subtext }: Props) {
  const updateUserMutation = useUpdateUser();
  const userQuery = useSignedInUser();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const isSelected = userQuery.data?.user?.themePreference === themeMode;

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
        <Grid container spacing={2}>
          <Grid xs={6}>
            <Typography sx={{ fontWeight: 'bold', mb: subtext ? 1 : 2 }}>
              {themeName}
            </Typography>
            {subtext && <Typography sx={{ mb: 1 }}>{subtext}</Typography>}
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => {
                updateUserMutation.mutate({
                  themePreference: themeMode,
                  id: userQuery.data?.user?.id ?? '',
                });
              }}
            >
              Use {themeName.toLocaleLowerCase()}
            </Button>
          </Grid>
          <Grid xs={6}>
            <Card sx={{ p: 1 }}>
              <Typography sx={{ mb: 1 }}>
                Hello hello! This is a preview of this theme.
              </Typography>
              <Typography variant="caption">Small text.</Typography>
            </Card>
          </Grid>
        </Grid>
      </Card>
    </ThemeProvider>
  );
}
