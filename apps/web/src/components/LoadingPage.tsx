import { Box, CircularProgress, Typography } from '@mui/material';

interface Props {
  message?: string;
}

export function LoadingPage({ message }: Props) {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <CircularProgress sx={{ mb: 2 }} />
      <Typography>{message ?? 'Loading'}</Typography>
    </Box>
  );
}
