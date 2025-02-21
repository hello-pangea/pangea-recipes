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
import { useForm, type SubmitHandler } from 'react-hook-form';
import { TextFieldElement } from 'react-hook-form-mui';
import { z } from 'zod';
import { authClient } from './authClient';

const signInFormSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
});

type SignInFormSchema = z.infer<typeof signInFormSchema>;

const route = getRouteApi('/app/sign-in/$');

export function SignInPage() {
  const navigate = route.useNavigate();
  const { redirect } = route.useSearch();
  const { handleSubmit, control } = useForm<SignInFormSchema>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const signIn = useMutation({
    mutationFn: (data: { email: string; password: string }) => {
      return authClient.signIn.email(data, {
        onError: (ctx) => {
          throw ctx.error;
        },
      });
    },
  });

  const onSubmit: SubmitHandler<SignInFormSchema> = (data) => {
    signIn.mutate(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          console.log('success');
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
          minWidth: 400,
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
          <Stack direction={'column'} spacing={2} sx={{ maxWidth: '400px' }}>
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
            {signIn.isError && (
              <Alert severity="error">
                {signIn.error.message || 'oh noes'}
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
              <RouterLink to="/app/sign-up/$" variant="caption">
                Don't have an account?
              </RouterLink>
              <RouterLink to="/" variant="caption">
                Forgot password?
              </RouterLink>
            </Box>
          </Stack>
        </form>
      </Card>
    </Container>
  );
}
