import Sidebar from '#src/features/layout/Sidebar';
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
import { Navigate, Outlet } from '@tanstack/react-router';
import { useState } from 'react';
import { useAuth } from '../auth/useAuth';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
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
