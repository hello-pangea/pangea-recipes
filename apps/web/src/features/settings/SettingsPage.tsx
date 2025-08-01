import { Page } from '#src/components/Page';
import { RouterButton } from '#src/components/RouterButton';
import { color } from '#src/theme/colors';
import { capitalizeFirstLetter } from '#src/utils/misc';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import SettingsBrightnessRoundedIcon from '@mui/icons-material/SettingsBrightnessRounded';
import {
  Alert,
  Box,
  Button,
  ButtonBase,
  Card,
  Link,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  useSignedInUser,
  useUpdateUser,
  type User,
} from '@open-zero/features/users';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { authClient } from '../auth/authClient';

const accentColors = [
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuschia',
  'pink',
  'rose',
] as const;

export function SettingsPage() {
  const { data: user } = useSignedInUser();
  const updateUser = useUpdateUser();
  const { enqueueSnackbar } = useSnackbar();
  const verifyEmail = useMutation({
    mutationFn: (data: { email: string; callbackURL: string }) => {
      return authClient.sendVerificationEmail(data, {
        onError: (ctx) => {
          throw ctx.error;
        },
      });
    },
  });

  if (!user) {
    return null;
  }

  return (
    <Page maxWidth="md">
      <Typography variant="h1" sx={{ mb: 4 }}>
        Settings
      </Typography>
      {!user.emailVerified && (
        <Alert
          severity={!verifyEmail.isSuccess ? 'warning' : 'success'}
          sx={{ mb: 2 }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              ml: '5px',
            }}
          >
            {!verifyEmail.isSuccess
              ? "Your email hasn't been verified"
              : 'Verification email sent'}
            {!verifyEmail.isSuccess && (
              <Button
                color="inherit"
                size="small"
                loading={verifyEmail.isPending}
                disabled={verifyEmail.isSuccess}
                onClick={() => {
                  verifyEmail.mutate(
                    {
                      email: user.email,
                      callbackURL: `${location.origin}/app/recipes`,
                    },
                    {
                      onError: () => {
                        enqueueSnackbar('Failed to send verification email', {
                          variant: 'error',
                        });
                      },
                    },
                  );
                }}
                sx={{ ml: '-5px' }}
              >
                Send verification email
              </Button>
            )}
          </Box>
        </Alert>
      )}
      <Stack spacing={4}>
        <Card
          sx={{
            p: 3,
          }}
        >
          <Typography variant="h2" sx={{ mb: 1.5 }}>
            Appearance
          </Typography>
          <ToggleButtonGroup
            color="primary"
            value={user.themePreference}
            exclusive
            onChange={(_event, newValue: User['themePreference']) => {
              updateUser.mutate({
                params: {
                  id: user.id,
                },
                body: {
                  themePreference: newValue,
                },
              });
            }}
            aria-label="Theme mode"
            sx={{ mb: 4 }}
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
          <Typography variant="h3" sx={{ mb: 1.5 }}>
            Accent color
          </Typography>
          <Stack spacing={1} direction={'row'} flexWrap="wrap">
            {accentColors.map((accentColor) => (
              <Tooltip
                title={capitalizeFirstLetter(accentColor)}
                key={accentColor}
                placement="bottom"
              >
                <ButtonBase
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: color[accentColor][500],
                    border: 2,
                    borderColor: color[accentColor][700],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onClick={() => {
                    updateUser.mutate({
                      params: {
                        id: user.id,
                      },
                      body: {
                        accentColor: accentColor,
                      },
                    });
                  }}
                >
                  {user.accentColor === accentColor && (
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: color.white,
                      }}
                    />
                  )}
                </ButtonBase>
              </Tooltip>
            ))}
          </Stack>
        </Card>
        <Card
          sx={{
            p: 3,
          }}
        >
          <Typography variant="h2" sx={{ mb: 1.5 }}>
            Units
          </Typography>
          <ToggleButtonGroup
            color="primary"
            value={user.unitsPreference}
            exclusive
            onChange={(_event, newValue: User['unitsPreference'] | null) => {
              if (newValue === null) {
                return;
              }

              updateUser.mutate({
                params: {
                  id: user.id,
                },
                body: {
                  unitsPreference: newValue,
                },
              });
            }}
            aria-label="Theme mode"
          >
            <ToggleButton value="imperial">Imperial</ToggleButton>
            <ToggleButton value="metric">Metric</ToggleButton>
          </ToggleButtonGroup>
        </Card>
        <Card
          sx={{
            p: 3,
          }}
        >
          <Typography variant="h2" sx={{ mb: 1.5 }}>
            Contact
          </Typography>
          <Typography>
            Pangea Recipes is in beta! Send any feedback to{' '}
            <Link href="mailto:hello@pangearecipes.com">
              hello@pangearecipes.com
            </Link>
            . I'd love to hear your thoughts 😊
            <br />
            <br />- Reece, Pangea Recipes creator
          </Typography>
        </Card>
        <Card
          sx={{
            p: 3,
          }}
        >
          <Typography variant="h2" sx={{ mb: 1.5 }}>
            Account
          </Typography>
          <RouterButton to="/log-out" color="error" sx={{ ml: -1 }}>
            Sign out
          </RouterButton>
        </Card>
      </Stack>
    </Page>
  );
}
