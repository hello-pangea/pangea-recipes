import { Copyright } from '#src/components/Copyright';
import { RouterButton } from '#src/components/RouterButton';
import { Box, Container, Typography } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <Box
      sx={{
        py: 4,
        px: 2,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          my: 12,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          flex: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <img src="/assets/lil-guy.svg" width={32} height={32} />
          <Typography
            variant="h1"
            sx={{ fontSize: 22, lineHeight: 1, ml: 2, pt: '0.4rem' }}
            component={'p'}
          >
            Hello Recipes
          </Typography>
        </Box>
        <Typography variant="h1" sx={{ fontSize: 48, mb: 4 }}>
          Save, savor, and
          <br />
          share recipes online
        </Typography>
        <RouterButton to="/app/sign-up/$" variant="contained">
          Start saving recipes
        </RouterButton>
      </Container>
      <Copyright />
    </Box>
  );
}
