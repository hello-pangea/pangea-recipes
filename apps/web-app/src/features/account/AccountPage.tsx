import { Page } from '#src/components/Page';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import { LoadingButton } from '@mui/lab';
import { Box, Grid2, Typography } from '@mui/material';
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
      <Grid2 container spacing={2}>
        <Grid2
          size={{
            xs: 12,
            sm: 4,
          }}
        >
          <ThemeCard themeName="Light" themeMode="light" />
        </Grid2>
        <Grid2
          size={{
            xs: 12,
            sm: 4,
          }}
        >
          <ThemeCard themeName="Dark" themeMode="dark" />
        </Grid2>
        <Grid2
          size={{
            xs: 12,
            sm: 4,
          }}
        >
          <ThemeCard
            themeName="Auto"
            themeMode="system"
            subtext="Matches your device settings"
          />
        </Grid2>
        <Grid2
          size={{
            xs: 12,
            sm: 6,
          }}
        >
          <ThemeCard themeName="Autumn" themeMode="autumn" />
        </Grid2>
        <Grid2
          size={{
            xs: 12,
            sm: 6,
          }}
        >
          <ThemeCard themeName="Mint" themeMode="mint" />
        </Grid2>
        <Grid2
          size={{
            xs: 12,
            sm: 6,
          }}
        >
          <ThemeCard themeName="Lavendar" themeMode="lavendar" />
        </Grid2>
        <Grid2
          size={{
            xs: 12,
            sm: 6,
          }}
        >
          <ThemeCard themeName="Ocean" themeMode="ocean" />
        </Grid2>
      </Grid2>
      <LoadingButton
        loading={isLoading}
        color="error"
        onClick={() => {
          setIsLoading(true);

          void signOut().then(() => {
            void router.invalidate();
          });
        }}
        sx={{ mt: 8 }}
      >
        Sign out
      </LoadingButton>
    </Page>
  );
}
