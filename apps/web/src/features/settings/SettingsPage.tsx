import { Page } from '#src/components/Page';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import SettingsBrightnessRoundedIcon from '@mui/icons-material/SettingsBrightnessRounded';
import {
  Box,
  Button,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import {
  useSignedInUser,
  useUpdateUser,
  type User,
} from '@open-zero/features/users';
import { useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { authClient } from '../auth/authClient';

export function SettingsPage() {
  const { data: user } = useSignedInUser();
  const updateUser = useUpdateUser();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  if (!user) {
    return null;
  }

  return (
    <Page>
      <Typography variant="h1" sx={{ mb: 4 }}>
        Settings
      </Typography>
      <Stack spacing={6}>
        <Box>
          <Typography variant="h2" sx={{ mb: 2 }}>
            Theme preferences
          </Typography>
          <ToggleButtonGroup
            color="primary"
            value={user.themePreference}
            exclusive
            onChange={(_event, newValue: User['themePreference']) => {
              updateUser.mutate({
                themePreference: newValue,
                id: user.id,
              });
            }}
            aria-label="Theme mode"
          >
            <ToggleButton value="light">
              <LightModeRoundedIcon sx={{ mr: 1 }} />
              Light
            </ToggleButton>
            <ToggleButton value="system">
              <SettingsBrightnessRoundedIcon sx={{ mr: 1 }} />
              System
            </ToggleButton>
            <ToggleButton value="dark">
              <DarkModeRoundedIcon sx={{ mr: 1 }} />
              Dark
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box>
          <Typography variant="h2" sx={{ mb: 2 }}>
            Units preferences
          </Typography>
          <ToggleButtonGroup
            color="primary"
            value={user.unitsPreference}
            exclusive
            onChange={(_event, newValue: User['unitsPreference']) => {
              updateUser.mutate({
                unitsPreference: newValue,
                id: user.id,
              });
            }}
            aria-label="Theme mode"
          >
            <ToggleButton value="imperial">Imperial</ToggleButton>
            <ToggleButton value="metric">Metric</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Button
          loading={isLoading}
          color="error"
          onClick={() => {
            setIsLoading(true);

            void authClient.signOut().then(() => {
              void router.invalidate();
            });
          }}
          sx={{ alignSelf: 'flex-start' }}
        >
          Sign out
        </Button>
      </Stack>
    </Page>
  );
}
