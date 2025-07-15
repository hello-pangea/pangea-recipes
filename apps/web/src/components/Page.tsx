import { Container, type ContainerProps } from '@mui/material';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  maxWidth?: ContainerProps['maxWidth'];
}

export function Page({ children, maxWidth }: Props) {
  return (
    <Container maxWidth={maxWidth} sx={{ p: { xs: 2, sm: 3 }, width: '100%' }}>
      {children}
    </Container>
  );
}
