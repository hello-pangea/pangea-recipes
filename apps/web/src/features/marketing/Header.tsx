import { RouterButton } from '#src/components/RouterButton';
import { RouterLink } from '#src/components/RouterLink';
import { Box, Container, Typography, useMediaQuery } from '@mui/material';

export function Header() {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: isSmall ? 2 : 4,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <img
          src="/assets/lil-guy.svg"
          width={isSmall ? 24 : 32}
          height={isSmall ? 24 : 32}
        />
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.h1.fontFamily,
            color: (theme) => theme.typography.h1.color,
            fontWeight: (theme) => theme.typography.h1.fontWeight,
            fontSize: isSmall ? 16 : 22,
            lineHeight: 1,
            ml: isSmall ? 1 : 2,
          }}
        >
          <RouterLink to="/" color="inherit" underline="none">
            Hello Recipes
          </RouterLink>
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: isSmall ? 1 : 2,
        }}
      >
        <RouterButton
          to="/sign-in"
          variant="text"
          size={isSmall ? 'small' : 'medium'}
        >
          Sign in
        </RouterButton>
        <RouterButton
          to="/sign-up"
          variant="contained"
          size={isSmall ? 'small' : 'medium'}
        >
          Get started
        </RouterButton>
      </Box>
    </Container>
  );
}
