import { Page } from '#src/components/Page';
import { Button, Typography } from '@mui/material';
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
      <Typography sx={{ mb: 2 }}>Hello, {userQuery.data?.user.name}</Typography>
      <Typography sx={{ mb: 2 }}>{userQuery.data?.user.email}</Typography>
      <Button color="error" onClick={signOut}>
        Sign out
      </Button>
    </Page>
  );
}
