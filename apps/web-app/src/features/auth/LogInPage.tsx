import { Copyright } from '#src/components/Copyright';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Card,
  Container,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { useLogInUser, useLoggedInUser } from '@open-zero/features';
import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { TextFieldElement } from 'react-hook-form-mui';
import { Navigate, useNavigate } from 'react-router-dom';
import { useUserStore } from '../account/userStore';

interface LogInFormInputs {
  email: string;
  password: string;
}

export function LogInPage() {
  const navigate = useNavigate();
  const { handleSubmit, control } = useForm<LogInFormInputs>();
  const setUserId = useUserStore((state) => state.setUserId);
  const userId = useUserStore((state) => state.userId);
  const loggedInUserQuery = useLoggedInUser({
    config: {
      retry: false,
    },
  });

  useEffect(() => {
    if (loggedInUserQuery.data?.user?.id) {
      setUserId(loggedInUserQuery.data.user.id);
    }
  }, [loggedInUserQuery.data?.user?.id, setUserId]);

  const logInUser = useLogInUser({
    config: {
      onSuccess: ({ user }) => {
        localStorage.setItem('userId', user.id);
        setUserId(user.id);

        navigate('/');
      },
    },
  });

  const onSubmit: SubmitHandler<LogInFormInputs> = (data) => {
    console.log('Log in user:', data);

    logInUser.mutate({
      email: data.email,
      password: data.password,
    });
  };

  if (userId) {
    return <Navigate to="/" />;
  }

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
          <Button variant="text" href="/sign-up" size="small">
            Sign up
          </Button>
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
              loading={logInUser.isPending}
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
