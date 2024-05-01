import { Page } from '#src/components/Page';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import { Box, Button, Typography } from '@mui/material';
import { useUser } from '@open-zero/features';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from './userStore';

export function AccountPage() {
  const navigate = useNavigate();
  const userId = useUserStore((state) => state.userId);

  const userQuery = useUser({
    userId: userId ?? 'not_found',
  });

  function signOut() {
    localStorage.clear();
    sessionStorage.clear();

    navigate('/sign-in');
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
      <Button color="error" onClick={signOut} sx={{ mt: 8 }}>
        Sign out
      </Button>
    </Page>
  );
}
