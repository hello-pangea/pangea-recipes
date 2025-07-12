import { RouterLink } from '#src/components/RouterLink';
import { useAppForm } from '#src/hooks/form';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { z } from 'zod/v4';
import { authClient } from './authClient';
import { useSignIn } from './useSignIn';

const formSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
});

export function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const signIn = useSignIn();
  const form = useAppForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => {
      const parsed = formSchema.parse(value);

      signIn.mutate({
        email: parsed.email,
        password: parsed.password,
      });
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
          Hello Recipes
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
          Sign in
        </Typography>
        <Stack direction={'row'} spacing={2}>
          <Button
            variant="outlined"
            color="inherit"
            fullWidth
            startIcon={<img src="/assets/social-icons/google.svg" />}
            onClick={() => {
              void authClient.signIn.social({
                provider: 'google',
                callbackURL: `${location.origin}/app/recipes`,
              });
            }}
          >
            Google
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            fullWidth
            startIcon={<img src="/assets/social-icons/facebook.svg" />}
            onClick={() => {
              void authClient.signIn.social({
                provider: 'facebook',
                callbackURL: `${location.origin}/app/recipes`,
              });
            }}
          >
            Facebook
          </Button>
        </Stack>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mt: 2,
            mb: 2,
          }}
        >
          <Divider
            sx={{
              flexGrow: 1,
            }}
          />
          <Typography variant="body2" sx={{ textAlign: 'center', mx: 2 }}>
            or
          </Typography>
          <Divider
            sx={{
              flexGrow: 1,
            }}
          />
        </Box>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <Stack direction={'column'} spacing={2} sx={{ maxWidth: '400px' }}>
            <form.AppField
              name="email"
              children={(field) => (
                <field.TextField
                  fullWidth
                  required
                  label="Email"
                  type="email"
                  autoComplete="email"
                />
              )}
            />
            <form.AppField
              name="password"
              children={(field) => (
                <field.TextField
                  label="Password"
                  required
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
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
            {signIn.isError && (
              <Alert severity="error">
                {signIn.error.message || 'An error occurred'}
              </Alert>
            )}
            <Button
              variant="contained"
              type="submit"
              loading={signIn.isPending}
              fullWidth
            >
              Sign in
            </Button>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <RouterLink to="/sign-up" variant="caption">
                Don't have an account?
              </RouterLink>
              <RouterLink to="/forgot-password" variant="caption">
                Forgot password?
              </RouterLink>
            </Box>
          </Stack>
        </form>
      </Card>
    </Container>
  );
}
