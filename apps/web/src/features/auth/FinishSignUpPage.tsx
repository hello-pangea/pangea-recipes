import { useUser } from '@clerk/tanstack-start';
import { CircularProgress, Container } from '@mui/material';
import { useSetupUser } from '@open-zero/features/users';
import { Navigate, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

export function FinishSignUpPage() {
  const naviate = useNavigate();
  const setupUser = useSetupUser();
  const { user: clerkUser } = useUser();

  useEffect(() => {
    if (setupUser.isPending) {
      return;
    }

    setupUser.mutate(
      {},
      {
        onSuccess: async () => {
          await clerkUser?.reload();

          void naviate({
            to: '/app/recipes',
          });
        },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (clerkUser?.publicMetadata.helloRecipesUserId) {
    return <Navigate to="/app/recipes" />;
  }

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <CircularProgress />
    </Container>
  );
}
