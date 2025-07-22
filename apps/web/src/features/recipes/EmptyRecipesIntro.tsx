import { isSxArray } from '#src/utils/isSxArray';
import {
  alpha,
  Box,
  Grid,
  Typography,
  type SxProps,
  type Theme,
} from '@mui/material';

interface Props {
  sx?: SxProps<Theme>;
}

export function EmptyRecipesIntro({ sx = [] }: Props) {
  return (
    <Box
      sx={[
        {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        },
        ...(isSxArray(sx) ? sx : [sx]),
      ]}
    >
      <img src="/assets/lil-guy.svg" width={64} height={64} />
      <Grid
        container
        spacing={{
          xs: 6,
          sm: 2,
        }}
        columns={{
          xs: 1,
          sm: 3,
        }}
        sx={{
          mt: 4,
        }}
      >
        <Grid
          size={1}
          sx={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            color="primary"
            sx={{
              mb: 1.5,
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.main, 0.075),
              borderRadius: 99,
              p: 1,
              color: (theme) => theme.palette.primary.main,
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h2" component={'p'} color="primary">
              1.
            </Typography>
          </Box>
          <Typography variant="h2" sx={{ mb: 0.5 }}>
            Find a recipe
          </Typography>
          <Typography
            sx={{
              maxWidth: 250,
            }}
          >
            Search online for your favorite recipes.
          </Typography>
        </Grid>
        <Grid
          size={1}
          sx={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            color="primary"
            sx={{
              mb: 1.5,
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.main, 0.075),
              borderRadius: 99,
              p: 1,
              color: (theme) => theme.palette.primary.main,
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h2" component={'p'} color="primary">
              2.
            </Typography>
          </Box>
          <Typography variant="h2" sx={{ mb: 0.5 }}>
            Copy the url
          </Typography>
          <Typography
            sx={{
              maxWidth: 250,
            }}
          >
            Come back here when you have the url.
          </Typography>
        </Grid>
        <Grid
          size={1}
          sx={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            color="primary"
            sx={{
              mb: 1.5,
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.main, 0.075),
              borderRadius: 99,
              p: 1,
              color: (theme) => theme.palette.primary.main,
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h2" component={'p'} color="primary">
              3.
            </Typography>
          </Box>
          <Typography variant="h2" sx={{ mb: 0.5 }}>
            Save your recipe
          </Typography>
          <Typography
            sx={{
              maxWidth: 250,
            }}
          >
            Click "New" then "Save from url".
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
