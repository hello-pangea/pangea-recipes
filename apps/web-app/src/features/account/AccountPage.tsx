import { Page } from '#src/components/Page';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import { LoadingButton } from '@mui/lab';
import { Box, Typography } from '@mui/material';
import { useSignOutUser, useUser } from '@open-zero/features';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from './userStore';

export function AccountPage() {
  const navigate = useNavigate();
  const userId = useUserStore((state) => state.userId);
  const setUserId = useUserStore((state) => state.setUserId);

  const userQuery = useUser({
    userId: userId ?? 'not_found',
  });

  const signOutMutation = useSignOutUser();

  function signOut() {
    signOutMutation.mutate(undefined, {
      onSuccess: () => {
        localStorage.clear();
        sessionStorage.clear();
        setUserId(null);

        navigate('/sign-in');
      },
    });
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
