import { RouterButton } from '#src/components/RouterButton';
import { RouterLink } from '#src/components/RouterLink';
import { isSxArray } from '#src/utils/isSxArray';
import {
  Box,
  Container,
  Typography,
  useMediaQuery,
  type SxProps,
  type Theme,
} from '@mui/material';
import { useMaybeSignedInUserId } from '../auth/useMaybeSignedInUserId';

interface Props {
  sx?: SxProps<Theme>;
}

export function Header({ sx = [] }: Props) {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const userId = useMaybeSignedInUserId();
  const isSignedIn = Boolean(userId);

  return (
    <Container
      component="header"
      maxWidth="lg"
      sx={[
        {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: isSmall ? 2 : 4,
        },
        ...(isSxArray(sx) ? sx : [sx]),
      ]}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <img
          src="/assets/lil-guy.svg"
          alt="Hello Recipes Logo"
          width={isSmall ? 24 : 28}
          height={isSmall ? 24 : 28}
        />
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.h1.fontFamily,
            color: (theme) => theme.typography.h1.color,
            fontWeight: (theme) => theme.typography.h1.fontWeight,
            fontSize: isSmall ? 16 : 19,
            lineHeight: 1,
            ml: isSmall ? 1 : 2,
          }}
        >
          <RouterLink to="/" color="inherit" underline="none">
            Hello Recipes
          </RouterLink>
        </Typography>
      </Box>
      {isSignedIn ? (
        <RouterButton
          to="/"
          variant="contained"
          size={isSmall ? 'small' : 'medium'}
        >
          My recipes
        </RouterButton>
      ) : (
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
      )}
    </Container>
  );
}
