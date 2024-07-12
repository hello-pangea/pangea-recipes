import { Page } from '#src/components/Page';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import { LoadingButton } from '@mui/lab';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { useAuthRequired } from '../auth/useAuth';
import { ThemeCard } from './ThemeCard';

export function AccountPage() {
  const { user, signOut } = useAuthRequired();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  return (
    <Page>
      <Typography variant="h1" sx={{ mb: 2 }}>
        Account
      </Typography>
      <Typography>Hello, {user.name}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <MailOutlineRoundedIcon fontSize="inherit" sx={{ mr: 1 }} />
        <Typography variant="body2">{user.email}</Typography>
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
        <Grid xs={12} sm={6}>
          <ThemeCard themeName="Lavendar" themeMode="lavendar" />
        </Grid>
        <Grid xs={12} sm={6}>
          <ThemeCard themeName="Ocean" themeMode="ocean" />
        </Grid>
      </Grid>
      <LoadingButton
        loading={isLoading}
        color="error"
        onClick={() => {
          setIsLoading(true);

          signOut().then(() => {
            router.invalidate();
          });
        }}
        sx={{ mt: 8 }}
      >
        Sign out
      </LoadingButton>
    </Page>
  );
}
