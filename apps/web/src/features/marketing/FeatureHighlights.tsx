import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded';
import { alpha, Grid, Typography } from '@mui/material';

export function FeatureHighlights() {
  return (
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
        <RestaurantMenuRoundedIcon
          color="primary"
          sx={{
            mb: 1.5,
            backgroundColor: (theme) =>
              alpha(theme.palette.primary.main, 0.075),
            borderRadius: 1,
            p: 1,
            fontSize: 56,
          }}
        />
        <Typography variant="h2" sx={{ mb: 0.5 }}>
          Your personal recipe library
        </Typography>
        <Typography
          sx={{
            maxWidth: 250,
          }}
        >
          Save, manage, and organize your favorite recipes from any website.
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
        <MenuBookRoundedIcon
          color="primary"
          sx={{
            mb: 1.5,
            backgroundColor: (theme) =>
              alpha(theme.palette.primary.main, 0.075),
            borderRadius: 1,
            p: 1,
            fontSize: 56,
          }}
        />
        <Typography variant="h2" sx={{ mb: 0.5 }}>
          Recipe books
        </Typography>
        <Typography
          sx={{
            maxWidth: 250,
          }}
        >
          Invite friends and family to collaborate on recipe books.
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
        <CodeRoundedIcon
          color="primary"
          sx={{
            mb: 1.5,
            backgroundColor: (theme) =>
              alpha(theme.palette.primary.main, 0.075),
            borderRadius: 1,
            p: 1,
            fontSize: 56,
          }}
        />
        <Typography variant="h2" sx={{ mb: 0.5 }}>
          Community driven
        </Typography>
        <Typography
          sx={{
            maxWidth: 250,
          }}
        >
          Our code is public for anyone to read or improve.
        </Typography>
      </Grid>
    </Grid>
  );
}
