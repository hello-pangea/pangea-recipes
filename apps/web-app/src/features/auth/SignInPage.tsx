import { ButtonLink } from '#src/components/ButtonLink';
import { Copyright } from '#src/components/Copyright';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Container, Link, Stack, Typography } from '@mui/material';
import { getRouteApi, useNavigate, useRouter } from '@tanstack/react-router';
import { useLayoutEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { TextFieldElement } from 'react-hook-form-mui';
import { useAuth } from './AuthProvider';

const route = getRouteApi('/sign-in');

interface SignInFormInputs {
  email: string;
  password: string;
}

export function SignInPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const { handleSubmit, control } = useForm<SignInFormInputs>();
  const { signIn, isAuthenticated, isLoaded } = useAuth();
  const search = route.useSearch();
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<SignInFormInputs> = (data) => {
    setLoading(true);

    signIn(data).then(() => {
      setLoading(false);
    });
  };

  useLayoutEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (isAuthenticated) {
      if (search.redirect) {
        router.history.push(search.redirect);
      } else {
        navigate({
          to: '/recipes',
        });
      }
    }
  }, [isAuthenticated, isLoaded, search.redirect, navigate, router.history]);

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <img src="/assets/lil-guy.svg" width={24} height={24} />
        <Typography
          variant="h1"
          sx={{ fontSize: 22, lineHeight: 1, ml: 2, pt: '0.4rem' }}
        >
          Hello Recipes
        </Typography>
      </Box>
      <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Typography variant="h1">Log in</Typography>
          <ButtonLink variant="text" to="/sign-up" size="small">
            Sign up
          </ButtonLink>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack
            direction={'column'}
            spacing={2}
            sx={{ maxWidth: '400px', display: 'block' }}
          >
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
              type="password"
              autoComplete="new-password"
            />
            <LoadingButton
              variant="contained"
              type="submit"
              loading={loading}
              fullWidth
            >
              Log in
            </LoadingButton>
            <Typography variant="body2" align="center">
              <Link href="/forgot-password" variant="body2">
                Forgot password?
              </Link>
            </Typography>
          </Stack>
        </form>
      </Card>
      <Copyright />
    </Container>
  );
}
