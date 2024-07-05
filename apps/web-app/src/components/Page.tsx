import { Box } from '@mui/material';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function Page({ children }: Props) {
  return (
    <Box sx={{ px: { xs: 2, sm: 3 }, py: 2, width: '100%' }}>{children}</Box>
  );
}
