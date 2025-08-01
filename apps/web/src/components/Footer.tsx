import {
  Box,
  Link,
  Stack,
  Typography,
  type SxProps,
  type Theme,
} from '@mui/material';
import { RouterLink } from './RouterLink';

interface Props {
  sx?: SxProps<Theme>;
}

export function Footer({ sx = [] }: Props) {
  return (
    <Box component={'footer'} sx={sx}>
      <Typography
        variant="body2"
        sx={{
          mb: 1,
          textAlign: 'center',
          color: (theme) => theme.palette.text.secondary,
        }}
      >
        {'Copyright © Reece Carolan '}
        {new Date().getFullYear()}
      </Typography>
      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 1 }}>
        <RouterLink variant="caption" to="/terms-of-service">
          Terms of service
        </RouterLink>
        <RouterLink variant="caption" to="/privacy-policy">
          Privacy policy
        </RouterLink>
      </Stack>
      <Typography
        variant="body2"
        sx={{
          mb: 1,
          textAlign: 'center',
          color: (theme) => theme.palette.text.secondary,
        }}
      >
        Made with ❤️ |{' '}
        <Link
          variant="body2"
          href="https://github.com/hello-pangea/pangea-recipes"
          target="_blank"
        >
          GitHub
        </Link>
      </Typography>
    </Box>
  );
}
