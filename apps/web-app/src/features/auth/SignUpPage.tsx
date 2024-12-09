import { ButtonLink } from '#src/components/ButtonLink';
import { Copyright } from '#src/components/Copyright';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Container,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import { useSignUpUser } from '@open-zero/features';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { TextFieldElement } from 'react-hook-form-mui';
import { useAuth } from './useAuth';

interface SignUpFormInputs {
  name?: string;
  email: string;
  password: string;
}

export function SignUpPage() {
  const navigate = useNavigate();
  const { handleSubmit, control } = useForm<SignUpFormInputs>();
  const { isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const signUpUser = useSignUpUser();

  useEffect(() => {
    if (isAuthenticated) {
      void navigate({
        to: '/recipes',
      });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit: SubmitHandler<SignUpFormInputs> = (data) => {
    signUpUser.mutate(
      {
        name: data.name,
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          void navigate({
            to: '/recipes',
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
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <img src="/assets/lil-guy.svg" width={32} height={32} />
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
          <ButtonLink variant="text" to="/sign-in" size="small">
            Log in
          </ButtonLink>
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
