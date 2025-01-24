import { Copyright } from '#src/components/Copyright';
import { RouterButton } from '#src/components/RouterButton';
import { useUser } from '@clerk/tanstack-start';
import { Box, Container, Typography, useMediaQuery } from '@mui/material';
import { Navigate } from '@tanstack/react-router';
import { Header } from './Header';

export function HomePage() {
  const { isSignedIn } = useUser();
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  if (isSignedIn) {
    return <Navigate to="/app/recipes" />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header />
      <Container
        maxWidth="lg"
        sx={{
          my: 16,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          flex: 1,
        }}
      >
        <Typography
          variant="h1"
          sx={{ fontSize: isSmall ? 48 : 64, mb: 4, maxWidth: 600 }}
        >
          Save and share recipes online.
        </Typography>
        <Typography
          sx={{
            mb: 4,
            maxWidth: 400,
          }}
        >
          No ads, no popups, no distractions. Just you and your recipes. 100%
          free.
        </Typography>
        <RouterButton to="/app/sign-up/$" variant="contained">
          Start saving recipes
        </RouterButton>
      </Container>
      <Copyright sx={{ pb: 2 }} />
    </Box>
  );
}
