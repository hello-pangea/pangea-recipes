import { RouterLink } from '#src/components/RouterLink';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { useMutation } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { TextFieldElement, useForm } from 'react-hook-form-mui';
import { z } from 'zod';
import { authClient } from './authClient';

const signUpFormSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(128, { message: 'Password must be at most 128 characters long' }),
});

type SignUpFormSchema = z.infer<typeof signUpFormSchema>;

const route = getRouteApi('/sign-up');

export function SignUpPage() {
  const navigate = route.useNavigate();
  const { redirect } = route.useSearch();
  const { handleSubmit, control } = useForm<SignUpFormSchema>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const signUp = useMutation({
    mutationFn: (data: Parameters<typeof authClient.signUp.email>[0]) => {
      return authClient.signUp.email(data, {
        onError: (ctx) => {
          throw ctx.error;
        },
      });
    },
  });

  const onSubmit: SubmitHandler<SignUpFormSchema> = (data) => {
    signUp.mutate(
      {
        email: data.email,
        password: data.password,
        name: data.name ?? '',
      },
      {
        onSuccess: () => {
          void navigate({
            to: redirect || '/app/recipes',
          });
        },
      },
    );
  };

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
          width: 400,
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction={'column'} spacing={3} sx={{ maxWidth: '400px' }}>
            <TextFieldElement
              label="Name (optional)"
              name="name"
              control={control}
              fullWidth
              autoComplete="name"
            />
            <TextFieldElement
              label="Email"
              name="email"
              required
              control={control}
              fullWidth
              type="email"
              autoComplete="email"
            />
            <TextFieldElement
              label="Password"
              name="password"
              required
              control={control}
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
