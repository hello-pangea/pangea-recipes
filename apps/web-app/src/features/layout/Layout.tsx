import { LoadingPage } from '#src/components/LoadingPage';
import Sidebar from '#src/features/layout/Sidebar';
import { Box } from '@mui/material';
import { useSignedInUser } from '@open-zero/features';
import { Navigate, Outlet } from '@tanstack/react-router';

export function Layout() {
  const userQuery = useSignedInUser({
    queryConfig: {
      retry: false,
    },
  });

  if (userQuery.isPending) {
    return <LoadingPage message="Loading user" />;
  }

  if (!userQuery.data?.user) {
    return <Navigate to="/sign-in" />;
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
