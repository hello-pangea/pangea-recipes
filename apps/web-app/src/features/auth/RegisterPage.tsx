import { LoadingButton } from '@mui/lab';
import { Container, Stack, Typography } from '@mui/material';
import { useRegisterUser } from '@open-zero/features';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { TextFieldElement } from 'react-hook-form-mui';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../account/userStore';

interface SignUpFormInputs {
  name: string;
  email: string;
  password: string;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const { handleSubmit, control } = useForm<SignUpFormInputs>();
  const setUserId = useUserStore((state) => state.setUserId);

  const userCreator = useRegisterUser({
    config: {
      onSuccess: ({ user }) => {
        localStorage.setItem('userId', user.id);
        setUserId(user.id);

        navigate('/');
      },
    },
  });

  const onSubmit: SubmitHandler<SignUpFormInputs> = (data) => {
    console.log('Create user:', data);

    userCreator.mutate({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography variant="h1" sx={{ mb: 2, mt: 8 }}>
        Sign up
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack
          direction={'column'}
          spacing={2}
          sx={{ mb: 6, maxWidth: '400px', display: 'block' }}
        >
          <TextFieldElement
            label="Name"
            name="name"
            required
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
            loading={userCreator.isPending}
            fullWidth
          >
            Sign up
          </LoadingButton>
        </Stack>
      </form>
    </Container>
  );
}
