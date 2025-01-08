import Sidebar from '#src/features/layout/Sidebar';
import { useUser } from '@clerk/tanstack-start';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  type Theme,
} from '@mui/material';
import { getSignedInUserQueryOptions } from '@open-zero/features/users';
import { useQueryClient } from '@tanstack/react-query';
import {
  Navigate,
  Outlet,
  useNavigate,
  useRouter,
} from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      void router.invalidate();
      void queryClient.invalidateQueries({
        queryKey: getSignedInUserQueryOptions().queryKey,
      });

      if (!clerkUser.publicMetadata.helloRecipesUserId) {
        void navigate({
          to: '/finish-sign-up',
        });
      }
    }
  }, [
    isSignedIn,
    isLoaded,
    router,
    clerkUser?.publicMetadata.helloRecipesUserId,
    queryClient,
    navigate,
  ]);

  if (isLoaded && clerkUser && !clerkUser.publicMetadata.helloRecipesUserId) {
    return <Navigate to="/finish-sign-up" />;
  } else if (isLoaded && !clerkUser) {
    return <Navigate to="/sign-in/$" />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        isSmallScreen={isSmallScreen}
        open={sidebarOpen}
        onClose={() => {
          setSidebarOpen(false);
        }}
      />
      <Box component="main" width={'100%'}>
        {isSmallScreen && (
          <AppBar
            position="static"
            elevation={0}
            sx={{
              backgroundColor: (theme) => theme.palette.background.default,
              borderBottom: 1,
              borderColor: 'divider',
              color: (theme) => theme.palette.text.primary,
            }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open sidebar"
                edge="start"
                onClick={() => {
                  setSidebarOpen(!sidebarOpen);
                }}
                sx={{ mr: 1 }}
              >
                <MenuRoundedIcon />
              </IconButton>
              <Box sx={{ display: 'flex', alignItems: 'center', m: 2 }}>
                <img src="/assets/lil-guy.svg" width={24} height={24} />
                <Typography
                  variant="h1"
                  sx={{ fontSize: 22, lineHeight: 1, ml: 2, pt: '0.4rem' }}
                >
                  Hello Recipes
                </Typography>
              </Box>
            </Toolbar>
          </AppBar>
        )}
        <Outlet />
      </Box>
    </Box>
  );
}
