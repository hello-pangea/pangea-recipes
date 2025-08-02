import { useAppForm } from '#src/hooks/form';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useState } from 'react';
import { z } from 'zod/v4';
import { authClient } from './authClient';

const formSchema = z.object({
  newPassword: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(128, { message: 'Password must be at most 128 characters long' }),
});

const route = getRouteApi('/reset-password');

export function ResetPasswordPage() {
  const navigate = route.useNavigate();
  const { token } = route.useSearch();
  const [showPassword, setShowPassword] = useState(false);
  const resetPassword = useMutation({
    mutationFn: (data: Parameters<typeof authClient.resetPassword>[0]) => {
      return authClient.resetPassword(data, {
        onError: (ctx) => {
          throw ctx.error;
        },
      });
    },
  });
  const form = useAppForm({
    defaultValues: {
      newPassword: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => {
      const parsed = formSchema.parse(value);

      resetPassword.mutate(
        {
          newPassword: parsed.newPassword,
          token: token,
        },
        {
          onSuccess: () => {
            void navigate({
              to: '/sign-in',
            });
          },
        },
      );
    },
  });

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        minHeight: '100vh',
        py: 2,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <img src="/assets/lil-guy.svg" width={22} height={22} />
        <Typography
          variant="h1"
          sx={{
            fontSize: 16,
            lineHeight: 1,
            ml: 1.5,
          }}
        >
          Pangea Recipes
        </Typography>
      </Box>
      <Card
        variant="outlined"
        sx={{
          p: 2,
          mb: 2,
          maxWidth: 400,
          width: '100%',
          border: 0,
          boxShadow:
            '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        }}
      >
        <Typography variant="h2" component={'h1'} sx={{ mb: 4 }}>
          Reset password
        </Typography>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <Stack direction={'column'} spacing={3} sx={{ maxWidth: '400px' }}>
            <form.AppField
              name="newPassword"
              children={(field) => (
                <field.TextField
                  label="New password"
                  required
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={
                              showPassword
                                ? 'hide the password'
                                : 'display the password'
                            }
                            onClick={() => {
                              setShowPassword((show) => !show);
                            }}
                            onMouseDown={(event) => {
                              event.preventDefault();
                            }}
                            onMouseUp={(event) => {
                              event.preventDefault();
                            }}
                            edge="end"
                          >
                            {showPassword ? (
                              <VisibilityOffRoundedIcon />
                            ) : (
                              <VisibilityRoundedIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            />
            {resetPassword.isError && (
              <Alert severity="error">
                {resetPassword.error.message || 'An error occurred'}
              </Alert>
            )}
            <Button
              variant="contained"
              type="submit"
              loading={resetPassword.isPending}
              fullWidth
            >
              Reset password
            </Button>
          </Stack>
        </form>
      </Card>
    </Container>
  );
}
