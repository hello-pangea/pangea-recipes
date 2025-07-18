import { EmphasizeText } from '#src/components/EmphasizeText';
import { Footer } from '#src/components/Footer';
import { RouterButton } from '#src/components/RouterButton';
import mockupImage from '#src/images/hero-mockup.png';
import screenshotImage from '#src/images/screenshot-1.png';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { Box, Chip, Container, Grid, Stack, Typography } from '@mui/material';
import { useSignedInUser } from '@open-zero/features/users';
import { Navigate } from '@tanstack/react-router';
import { DesktopDemo } from './DesktopDemo';
import { FeatureHighlights } from './FeatureHighlights';
import { Header } from './Header';
import { PhoneMockup } from './PhoneMockup';
import { ShareDialogDemo } from './ShareDialogDemo';

export function HomePage() {
  const { data: user } = useSignedInUser();

  if (user) {
    return <Navigate to="/app/recipes" replace />;
  }

  return (
    <>
      <Header />
      <main>
        <Container
          maxWidth="lg"
          sx={{
            mt: { xs: 4, sm: 6, md: 16 },
            mb: { xs: 4, sm: 16 },
          }}
        >
          <Grid
            container
            spacing={4}
            direction={{ xs: 'column-reverse', md: 'row' }}
          >
            <Grid
              size={{
                xs: 12,
                md: 5,
              }}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <img
                height={400}
                width={500}
                src={mockupImage}
                style={{
                  objectFit: 'contain',
                  display: 'block',
                  maxWidth: '100%',
                }}
              />
              {/* <img
              height={550}
              width={320}
              src={mockupImage}
              style={{
                objectFit: 'contain',
                display: 'block',
              }}
            /> */}
              {/* <PhoneDemo /> */}
            </Grid>
            <Grid
              size={{
                xs: 12,
                md: 7,
              }}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  maxWidth: {
                    xs: 350,
                    sm: 400,
                    md: 600,
                  },
                }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    mb: 2,
                    maxWidth: 600,
                    fontWeight: 'normal',
                  }}
                >
                  A recipe manager you'll <EmphasizeText>love</EmphasizeText>
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip size="small" label="Free" color="primary" />
                  <Chip size="small" label="No ads" color="primary" />
                  <Chip size="small" label="Open source" color="primary" />
                </Box>
                <Typography
                  sx={{
                    mb: 4,
                    maxWidth: 400,
                    fontSize: { xs: 16, md: 18 },
                  }}
                >
                  Hello Recipes is a modern, ad-free recipe manager that makes
                  it easy to save, share, organize, and collaborate on your
                  favorite dishes.
                </Typography>
                <RouterButton
                  to="/sign-up"
                  variant="contained"
                  endIcon={<ArrowForwardRoundedIcon />}
                >
                  Get started
                </RouterButton>
              </Box>
            </Grid>
          </Grid>
        </Container>
        <Container
          maxWidth="lg"
          sx={{
            mb: 16,
          }}
        >
          <FeatureHighlights />
        </Container>
        <Container maxWidth="lg">
          <Stack spacing={32}>
            <Grid
              container
              spacing={{
                xs: 8,
                sm: 4,
                md: 8,
              }}
            >
              <Grid
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
                <Typography
                  variant="h1"
                  component={'h2'}
                  sx={{ mb: 4, maxWidth: 400, fontWeight: 'normal' }}
                >
                  <EmphasizeText>Save</EmphasizeText> your favorite recipes
                </Typography>
                <Typography
                  sx={{ maxWidth: 400, fontSize: { xs: 16, md: 18 } }}
                >
                  <b>Never forget</b> another recipe. Quickly add your favorites
                  and want-to-try recipes to your collection.
                </Typography>
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <PhoneMockup src={screenshotImage} />
              </Grid>
            </Grid>
            <Grid
              container
              spacing={{
                xs: 8,
                sm: 4,
                md: 8,
              }}
            >
              <Grid
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
                <Typography
                  variant="h1"
                  component="h2"
                  sx={{ mb: 4, maxWidth: 400, fontWeight: 'normal' }}
                >
                  Collect and access <EmphasizeText>anywhere</EmphasizeText>
                </Typography>
                <Typography
                  sx={{ maxWidth: 400, fontSize: { xs: 16, md: 18 } }}
                >
                  All your favorite recipes, available on the web on all your
                  devices.
                </Typography>
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <DesktopDemo />
              </Grid>
            </Grid>
            <Grid
              container
              spacing={{
                xs: 8,
                sm: 4,
                md: 8,
              }}
            >
              <Grid
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
                <Typography
                  variant="h1"
                  component={'h2'}
                  sx={{ mb: 4, maxWidth: 400, fontWeight: 'normal' }}
                >
                  <EmphasizeText>Share</EmphasizeText> recipes with friends and
                  family
                </Typography>
                <Typography
                  sx={{ maxWidth: 400, fontSize: { xs: 16, md: 18 } }}
                >
                  Collaborate with friends and family to make the perfect{' '}
                  <b>recipe book</b>. Share with a single link or invite.
                </Typography>
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <ShareDialogDemo />
              </Grid>
            </Grid>
          </Stack>
          <Box
            sx={{
              backgroundColor: (theme) => theme.vars.palette.background.paper,
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
            <img
              src="/assets/lil-guy.svg"
              alt="Hello Recipes Logo"
              width={64}
              height={64}
            />
            <Typography variant="h1" component={'p'} sx={{ mb: 2, mt: 4 }}>
              Start saving and sharing recipes.
            </Typography>
            <Typography
              sx={{
                mb: 4,
                maxWidth: 600,
              }}
            >
              Hello Recipes is free to use. We don't have ads, trackers, popups,
              or distractions. We never sell data. Enjoy your recipes, your way.
            </Typography>
            <RouterButton to="/sign-up" variant="contained">
              Sign up
            </RouterButton>
          </Box>
        </Container>
      </main>
      <Footer sx={{ pb: 2, pt: 6 }} />
    </>
  );
}
