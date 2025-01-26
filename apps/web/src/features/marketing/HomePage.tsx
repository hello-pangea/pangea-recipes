import { Copyright } from '#src/components/Copyright';
import { RouterButton } from '#src/components/RouterButton';
import { useUser } from '@clerk/tanstack-start';
import {
  Box,
  Container,
  Grid2,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Navigate } from '@tanstack/react-router';
import { Header } from './Header';
import { ShareDialogDemo } from './ShareDialogDemo';

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
      <Container maxWidth="lg">
        <Grid2
          container
          spacing={{
            xs: 4,
            md: 8,
          }}
          direction={{
            xs: 'column-reverse',
            sm: 'row',
          }}
        >
          <Grid2
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <ShareDialogDemo />
          </Grid2>
          <Grid2
            size={{
              xs: 12,
              sm: 6,
            }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h2" sx={{ mb: 2, maxWidth: 400 }}>
              Share recipes with friends and family
            </Typography>
            <Typography sx={{ maxWidth: 400 }}>
              Save, share, and organize your favorite recipes with friends and
              family in <b>recipe books</b>.
            </Typography>
          </Grid2>
        </Grid2>
      </Container>
      <Copyright sx={{ py: 2 }} />
    </Box>
  );
}
