import { Copyright } from '#src/components/Copyright';
import { SignUp } from '@clerk/tanstack-start';
import { Box, Container } from '@mui/material';
import { getRouteApi } from '@tanstack/react-router';

const route = getRouteApi('/app/sign-up/$');

export function SignUpPage() {
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
        justifyContent: 'center',
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
        <SignUp
          signInUrl={
            redirect ? `/app/sign-in?redirect=${redirect}` : '/app/sign-in'
          }
        />
      </Box>
      <Copyright />
    </Container>
  );
}
