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
import { useSignUp } from './useSignUp';

const formSchema = z.object({
  name: z.string().transform((val) => (val === '' ? undefined : val)),
  email: z.email(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(128, { message: 'Password must be at most 128 characters long' }),
});

export function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const signUp = useSignUp();
  const form = useAppForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => {
      const parsed = formSchema.parse(value);

      signUp.mutate({
        email: parsed.email,
        password: parsed.password,
        name: parsed.name ?? '',
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
          Create your account
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
          <Stack direction={'column'} spacing={3} sx={{ maxWidth: '400px' }}>
            <form.AppField
              name="name"
              children={(field) => (
                <field.TextField
                  label="Name (optional)"
                  fullWidth
                  autoComplete="name"
                />
              )}
            />
            <form.AppField
              name="email"
              children={(field) => (
                <field.TextField
                  label="Email"
                  fullWidth
                  type="email"
                  autoComplete="email"
                  required
                />
              )}
            />
            <form.AppField
              name="password"
              children={(field) => (
                <field.TextField
                  label="Password"
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
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
            {signUp.isError && (
              <Alert severity="error">
                {signUp.error.message || 'An error occurred'}
              </Alert>
            )}
            <Button
              variant="contained"
              type="submit"
              loading={signUp.isPending}
              fullWidth
            >
              Sign up
            </Button>
            <Typography variant="caption">
              Signing up for a Hello Recipes account means you agree to the{' '}
              <RouterLink to="/privacy-policy">Privacy Policy</RouterLink> and{' '}
              <RouterLink to="/terms-of-service">Terms of Service</RouterLink>
            </Typography>
            <Typography variant="caption">
              Already have an account?{' '}
              <RouterLink to="/sign-in">Sign in</RouterLink>
            </Typography>
          </Stack>
        </form>
      </Card>
    </Container>
  );
}
