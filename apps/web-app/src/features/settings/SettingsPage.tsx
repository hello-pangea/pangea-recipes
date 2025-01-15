import { Page } from '#src/components/Page';
import { useAuth } from '@clerk/tanstack-start';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import SettingsBrightnessRoundedIcon from '@mui/icons-material/SettingsBrightnessRounded';
import {
  Box,
  Button,
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

export function SettingsPage() {
  const { data: user } = useSignedInUser();
  const updateUser = useUpdateUser();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signOut } = useAuth();

  return (
    <Page>
      <Typography variant="h1" sx={{ mb: 2 }}>
        Settings
      </Typography>
      <Typography variant="h2" sx={{ mb: 2 }}>
        Theme preferences
      </Typography>
      <ToggleButtonGroup
        color="primary"
        value={user?.themePreference ?? 'light'}
        exclusive
        onChange={(_event, newValue: User['themePreference']) => {
          updateUser.mutate({
            themePreference: newValue,
            id: user?.id ?? '',
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
      <Box>
        <Button
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
        </Button>
      </Box>
    </Page>
  );
}
