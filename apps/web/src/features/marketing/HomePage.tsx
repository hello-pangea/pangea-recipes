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
import { ImportRecipeDemo } from './ImportRecipeDemo';
import { RecipesDemo } from './RecipesDemo';
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
            xs: 8,
            sm: 4,
            md: 8,
          }}
        >
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
              <Typography
                variant="h2"
                component={'span'}
                sx={{
                  color: (theme) => theme.palette.primary.main,
                  fontWeight: 'bold',
                }}
              >
                Step 1:
              </Typography>{' '}
              Import your favorite recipes
            </Typography>
            <Typography sx={{ maxWidth: 400 }}>
              <b>Never forget</b> another recipe. Quickly add your favorites and
              want-to-try recipes to your collection.
            </Typography>
          </Grid2>
          <Grid2
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <ImportRecipeDemo />
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
              <Typography
                variant="h2"
                component={'span'}
                sx={{
                  color: (theme) => theme.palette.primary.main,
                  fontWeight: 'bold',
                }}
              >
                Step 2:
              </Typography>{' '}
              Currate your collection
            </Typography>
            <Typography sx={{ maxWidth: 400 }}>
              Search, sort, and enjoy! Your recipes are always available and
              organized how you like.
            </Typography>
          </Grid2>
          <Grid2
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <RecipesDemo />
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
              <Typography
                variant="h2"
                component={'span'}
                sx={{
                  color: (theme) => theme.palette.primary.main,
                  fontWeight: 'bold',
                }}
              >
                Step 3:
              </Typography>{' '}
              Share recipes with friends and family
            </Typography>
            <Typography sx={{ maxWidth: 400 }}>
              Save, share, and organize your favorite recipes with friends and
              family in <b>recipe books</b>.
            </Typography>
          </Grid2>
          <Grid2
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <ShareDialogDemo />
          </Grid2>
        </Grid2>
        <Box
          sx={{
            backgroundColor: (theme) => theme.palette.background.paper,
            borderRadius: '28px',
            px: 3,
            py: 8,
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            mt: { xs: 4, sm: 8 },
            mb: { xs: 2, sm: 4 },
            textAlign: 'center',
          }}
        >
          <Typography variant="h1" component={'p'} sx={{ mb: 2 }}>
            Start saving and sharing recipes.
          </Typography>
          <Typography
            sx={{
              mb: 4,
            }}
          >
            Hello Recipes is free to use. We don't have ads, trackers, popups,
            or distractions. Just you and your recipes.
          </Typography>
          <RouterButton to="/app/sign-up/$" variant="contained">
            Sign up
          </RouterButton>
        </Box>
      </Container>
      <Copyright sx={{ pb: 2, pt: 6 }} />
    </Box>
  );
}
