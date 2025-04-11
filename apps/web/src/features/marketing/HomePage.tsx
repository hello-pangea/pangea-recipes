import { Copyright } from '#src/components/Copyright';
import { RouterButton } from '#src/components/RouterButton';
import { alpha, Box, Container, Grid, Stack, Typography } from '@mui/material';
import { useSignedInUser } from '@open-zero/features/users';
import { Navigate } from '@tanstack/react-router';
import { DesktopDemo } from './DesktopDemo';
import { Header } from './Header';
import { ImportRecipeDemo } from './ImportRecipeDemo';
import { PhoneDemo } from './PhoneDemo';
import { ShareDialogDemo } from './ShareDialogDemo';

export function HomePage() {
  const { data: user } = useSignedInUser();

  if (user) {
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
          mt: { xs: 4, sm: 6, md: 16 },
          mb: 16,
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
            <PhoneDemo />
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
                <Typography
                  component={'span'}
                  variant="h1"
                  sx={{
                    color: (theme) => theme.vars.palette.primary.main,
                    fontSize: 'inherit',
                    fontFamily: 'inherit',
                    fontWeight: 'bold',
                  }}
                >
                  Organize
                </Typography>{' '}
                and{' '}
                <Typography
                  component={'span'}
                  variant="h1"
                  sx={{
                    color: (theme) => theme.vars.palette.primary.main,
                    fontSize: 'inherit',
                    fontFamily: 'inherit',
                    fontWeight: 'bold',
                  }}
                >
                  share
                </Typography>{' '}
                recipes online.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    border: 1,
                    borderColor: (theme) => theme.vars.palette.primary.main,
                    borderRadius: '8px',
                    backgroundColor: (theme) =>
                      alpha(theme.palette.primary.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    px: 1,
                    py: 0.5,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      color: (theme) => theme.vars.palette.primary.main,
                    }}
                  >
                    Free
                  </Typography>
                </Box>
                <Box
                  sx={{
                    border: 1,
                    borderColor: (theme) => theme.vars.palette.primary.main,
                    borderRadius: '8px',
                    backgroundColor: (theme) =>
                      alpha(theme.palette.primary.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    px: 1,
                    py: 0.5,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      color: (theme) => theme.vars.palette.primary.main,
                    }}
                  >
                    No ads
                  </Typography>
                </Box>
              </Box>
              <Typography
                sx={{
                  mb: 4,
                  maxWidth: 400,
                  fontSize: { xs: 16, md: 18 },
                }}
              >
                All your recipes on all your devices. Create recipe books with
                friends and family.
              </Typography>
              <RouterButton to="/sign-up" variant="contained">
                Sign up for free
              </RouterButton>
            </Box>
          </Grid>
        </Grid>
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
                <Typography
                  variant="h1"
                  component={'span'}
                  sx={{
                    color: (theme) => theme.vars.palette.primary.main,
                    fontWeight: 'bold',
                  }}
                >
                  Import
                </Typography>{' '}
                your favorite recipes
              </Typography>
              <Typography sx={{ maxWidth: 400, fontSize: { xs: 16, md: 18 } }}>
                <b>Never forget</b> another recipe. Quickly add your favorites
                and want-to-try recipes to your collection.
              </Typography>
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <ImportRecipeDemo />
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
                Collect and access{' '}
                <Typography
                  variant="h1"
                  component={'span'}
                  sx={{
                    color: (theme) => theme.vars.palette.primary.main,
                    fontWeight: 'bold',
                  }}
                >
                  anywhere
                </Typography>
              </Typography>
              <Typography sx={{ maxWidth: 400, fontSize: { xs: 16, md: 18 } }}>
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
                <Typography
                  variant="h1"
                  component={'span'}
                  sx={{
                    color: (theme) => theme.vars.palette.primary.main,
                    fontWeight: 'bold',
                  }}
                >
                  Share
                </Typography>{' '}
                recipes with friends and family
              </Typography>
              <Typography sx={{ maxWidth: 400, fontSize: { xs: 16, md: 18 } }}>
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
          <img src="/assets/lil-guy.svg" width={64} height={64} />
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
      <Copyright sx={{ pb: 2, pt: 6 }} />
    </Box>
  );
}
