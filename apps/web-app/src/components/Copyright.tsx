import { Box, Stack, Typography } from '@mui/material';
import { RouterLink } from './RouterLink';

export function Copyright() {
  return (
    <Box>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ mb: 1 }}
      >
        {'Copyright © Reece Carolan '}
        {new Date().getFullYear()}
      </Typography>
      <Stack direction="row" spacing={1} justifyContent="center">
        <RouterLink variant="caption" to="/terms-of-service">
          Terms of service
        </RouterLink>
        <RouterLink variant="caption" to="/privacy-policy">
          Privacy policy
        </RouterLink>
      </Stack>
      {/* <Typography variant="body2" color="text.secondary" align="center">
        <Link href="https://github.com/open-zero/hello-recipes" target="_blank">
          ❤️ Open Source
        </Link>
      </Typography> */}
    </Box>
  );
}
