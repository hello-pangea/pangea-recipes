import { RouterLink } from '#src/components/RouterLink';
import { Sidebar } from '#src/features/layout/Sidebar';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  useColorScheme,
  useMediaQuery,
  type Theme,
} from '@mui/material';
import { useSignedInUser } from '@repo/features/users';
import { Outlet } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { NewButton } from './NewButton';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );
  const { data: user } = useSignedInUser();
  const { setMode } = useColorScheme();

  useEffect(() => {
    if (user?.themePreference) {
      setMode(user.themePreference);
    }
  }, [user?.themePreference, setMode]);

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
              backgroundColor: (theme) => theme.vars.palette.background.default,
              color: (theme) => theme.vars.palette.text.primary,
            }}
          >
            <Toolbar
              sx={{
                backgroundColor: (theme) =>
                  theme.vars.palette.background.default,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
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
                <RouterLink
                  to="/app/recipes"
                  sx={{
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <img src="/assets/lil-guy.svg" width={24} height={24} />
                </RouterLink>
              </Box>
              <NewButton
                slotProps={{
                  button: {
                    size: 'small',
                  },
                }}
              />
            </Toolbar>
          </AppBar>
        )}
        <Outlet />
      </Box>
    </Box>
  );
}
