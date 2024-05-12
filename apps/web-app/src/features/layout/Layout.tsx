import { LoadingPage } from '#src/components/LoadingPage';
import Sidebar from '#src/features/layout/Sidebar';
import { Box } from '@mui/material';
import { useLoggedInUser } from '@open-zero/features';
import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '../account/userStore';

export function Layout() {
  const loggedInUserQuery = useLoggedInUser({
    config: {
      retry: false,
    },
  });
  const setUserId = useUserStore((state) => state.setUserId);

  useEffect(() => {
    if (loggedInUserQuery.data?.user?.id) {
      setUserId(loggedInUserQuery.data.user.id);
    }
  }, [loggedInUserQuery.data?.user?.id, setUserId]);

  if (loggedInUserQuery.isPending) {
    return <LoadingPage message="Loading user" />;
  }

  if (!loggedInUserQuery.data?.user) {
    return <Navigate to={'/log-in'} />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box component="main" width={'100%'}>
        <Outlet />
      </Box>
    </Box>
  );
}
