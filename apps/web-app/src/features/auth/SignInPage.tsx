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
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-between',
        py: 2,
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
          routing="hash"
        />
      </Box>
      <Box>
        <Copyright />
      </Box>
    </Container>
  );
}
