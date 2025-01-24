import { Copyright } from '#src/components/Copyright';
import { SignIn } from '@clerk/tanstack-start';
import { Box, Container } from '@mui/material';
import { getRouteApi } from '@tanstack/react-router';

const route = getRouteApi('/app/sign-in/$');

export function SignInPage() {
  const { redirect } = route.useSearch();

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
        justifyContent: 'space-between',
      }}
    >
      <Box
        sx={{
          mb: 4,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <SignIn
          forceRedirectUrl={redirect ?? '/app/recipes'}
          signUpUrl={
            redirect ? `/app/sign-up?redirect=${redirect}` : '/app/sign-up'
          }
        />
      </Box>
      <Copyright />
    </Container>
  );
}
