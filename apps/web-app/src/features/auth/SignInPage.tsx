import { LoadingButton } from '@mui/lab';
import { Container, Stack, Typography } from '@mui/material';
import { useSignInUser } from '@open-zero/features';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { TextFieldElement } from 'react-hook-form-mui';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../account/userStore';

interface SignInFormInputs {
  email: string;
  password: string;
}

export function SignInPage() {
  const navigate = useNavigate();
  const { handleSubmit, control } = useForm<SignInFormInputs>();
  const setUserId = useUserStore((state) => state.setUserId);

  const userSignIn = useSignInUser({
    config: {
      onSuccess: ({ user }) => {
        localStorage.setItem('userId', user.id);
        setUserId(user.id);

        navigate('/');
      },
    },
  });

  const onSubmit: SubmitHandler<SignInFormInputs> = (data) => {
    console.log('Sign in user:', data);

    userSignIn.mutate({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography variant="h1" sx={{ mb: 2, mt: 8 }}>
        Sign in
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack
          direction={'column'}
          spacing={2}
          sx={{ mb: 6, maxWidth: '400px', display: 'block' }}
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
            loading={userSignIn.isPending}
            fullWidth
          >
            Sign in
          </LoadingButton>
        </Stack>
      </form>
    </Container>
  );
}
