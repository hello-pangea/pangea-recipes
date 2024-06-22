import { Copyright } from '#src/components/Copyright';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, Container, Stack, Typography } from '@mui/material';
import { useSignUpUser } from '@open-zero/features';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { TextFieldElement } from 'react-hook-form-mui';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../account/userStore';

interface SignUpFormInputs {
  name?: string;
  email: string;
  password: string;
}

export function SignUpPage() {
  const navigate = useNavigate();
  const { handleSubmit, control } = useForm<SignUpFormInputs>();
  const setUserId = useUserStore((state) => state.setUserId);

  const signUpUser = useSignUpUser({
    mutationConfig: {
      onSuccess: ({ user }) => {
        localStorage.setItem('userId', user.id);
        setUserId(user.id);

        navigate('/');
      },
    },
  });

  const onSubmit: SubmitHandler<SignUpFormInputs> = (data) => {
    signUpUser.mutate({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  };

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
          <Typography variant="h1">Create your profile</Typography>
          <Button variant="text" href="/log-in" size="small">
            Log in
          </Button>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack
            direction={'column'}
            spacing={2}
            sx={{ maxWidth: '400px', display: 'block' }}
          >
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
              type="password"
              autoComplete="new-password"
            />
            <LoadingButton
              variant="contained"
              type="submit"
              loading={signUpUser.isPending}
              fullWidth
            >
              Sign up
            </LoadingButton>
          </Stack>
        </form>
      </Card>
      <Copyright />
    </Container>
  );
}
