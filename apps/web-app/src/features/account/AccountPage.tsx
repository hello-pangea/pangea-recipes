import { Page } from '#src/components/Page';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import { LoadingButton } from '@mui/lab';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useSignedInUser, useSignOutUser } from '@open-zero/features';
import { useNavigate } from '@tanstack/react-router';
import { ThemeCard } from './ThemeCard';

export function AccountPage() {
  const navigate = useNavigate();
  const userQuery = useSignedInUser({
    queryConfig: {
      retry: false,
    },
  });

  const signOutMutation = useSignOutUser();

  function signOut() {
    signOutMutation.mutate(undefined, {
      onSuccess: () => {
        localStorage.clear();
        sessionStorage.clear();

        navigate({ to: '/sign-in' });
      },
    });
  }

  if (!userQuery.data?.user) {
    return null;
  }

  return (
    <Page>
      <Typography variant="h1" sx={{ mb: 2 }}>
        Account
      </Typography>
      <Typography>Hello, {userQuery.data?.user.name}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <MailOutlineRoundedIcon fontSize="inherit" sx={{ mr: 1 }} />
        <Typography variant="body2">{userQuery.data?.user.email}</Typography>
      </Box>
      <Typography variant="h2" sx={{ mb: 2 }}>
        Theme preferences
      </Typography>
      <Grid container spacing={2}>
        <Grid xs={12} sm={4}>
          <ThemeCard themeName="Light" themeMode="light" />
        </Grid>
        <Grid xs={12} sm={4}>
          <ThemeCard themeName="Dark" themeMode="dark" />
        </Grid>
        <Grid xs={12} sm={4}>
          <ThemeCard
            themeName="Auto"
            themeMode="system"
            subtext="Matches your device settings"
          />
        </Grid>
        <Grid xs={12} sm={6}>
          <ThemeCard themeName="Autumn" themeMode="autumn" />
        </Grid>
        <Grid xs={12} sm={6}>
          <ThemeCard themeName="Mint" themeMode="mint" />
        </Grid>
      </Grid>
      <LoadingButton
        loading={signOutMutation.isPending}
        color="error"
        onClick={signOut}
        sx={{ mt: 8 }}
      >
        Sign out
      </LoadingButton>
    </Page>
  );
}
