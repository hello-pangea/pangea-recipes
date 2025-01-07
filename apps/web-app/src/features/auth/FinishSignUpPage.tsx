import { useUser } from '@clerk/clerk-react';
import { CircularProgress, Container } from '@mui/material';
import { useSetupUser, useSignedInUser } from '@open-zero/features/users';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

export function FinishSignUpPage() {
  const naviate = useNavigate();
  const setupUser = useSetupUser();
  const { data: user, isPending } = useSignedInUser();
  const { user: clerkUser } = useUser();

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (user && clerkUser?.publicMetadata.helloRecipesUserId) {
      void naviate({
        to: '/recipes',
      });

      return;
    }

    setupUser.mutate(
      {},
      {
        onSuccess: async () => {
          await clerkUser?.reload();

          void naviate({
            to: '/recipes',
          });
        },
      },
    );
  }, []);

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
