import { Copyright } from '#src/components/Copyright';
import { SignUp } from '@clerk/tanstack-start';
import { Box, Container } from '@mui/material';

export function SignUpPage() {
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
        <SignUp routing="hash" />
      </Box>
      <Box>
        <Copyright />
      </Box>
    </Container>
  );
}
