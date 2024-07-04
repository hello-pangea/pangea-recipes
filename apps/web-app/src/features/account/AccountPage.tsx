import { Page } from '#src/components/Page';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import { LoadingButton } from '@mui/lab';
import { Box, Typography } from '@mui/material';
import { useSignedInUser, useSignOutUser } from '@open-zero/features';
import { useNavigate } from '@tanstack/react-router';

export function AccountPage() {
  const navigate = useNavigate();
  const userQuery = useSignedInUser({
    queryConfig: {
      retry: false,
    },
  });

  const signOutMutation = useSignOutUser();

  function signOut() {
    signOutMutation.mutate(undefined, {
      onSuccess: () => {
        localStorage.clear();
        sessionStorage.clear();

        navigate({ to: '/sign-in' });
      },
    });
  }

  if (!userQuery.data?.user) {
    return null;
  }

  return (
    <Page>
      <Typography variant="h1" sx={{ mb: 2 }}>
        Account
      </Typography>
      <Typography>Hello, {userQuery.data?.user.name}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <MailOutlineRoundedIcon fontSize="inherit" sx={{ mr: 1 }} />
        <Typography variant="body2">{userQuery.data?.user.email}</Typography>
      </Box>
      <LoadingButton
        loading={signOutMutation.isPending}
        color="error"
        onClick={signOut}
        sx={{ mt: 8 }}
      >
        Sign out
      </LoadingButton>
    </Page>
  );
}
