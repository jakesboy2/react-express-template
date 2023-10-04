import {
  AppBar,
  Avatar,
  Box,
  Container,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPrivateAxios } from '../../axios';

const settingsPages = [
  { name: 'Profile', route: '/profile' },
  { name: 'Configuration', route: '/configuration' },
  { name: 'Logout', route: '/logout' },
];

export default function Navbar() {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  const privateAxios = getPrivateAxios();

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.dispatchEvent(new Event('storage'));
    handleCloseUserMenu();
    navigate('/login', { replace: true });
  };

  const updateAuthenticationStatus = async () => {
    if (!privateAxios) {
      setIsAuthenticated(false);
      handleLogout();
    }

    try {
      await privateAxios.get('/auth/verify');
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      handleLogout();
    }
  };

  useEffect(() => {
    window.addEventListener('storage', updateAuthenticationStatus);
    updateAuthenticationStatus();
    return () => window.removeEventListener('storage', updateAuthenticationStatus);
  }, []);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleOnClick = (route: string) => {
    if (route === '/logout') {
      handleLogout();
      return;
    }

    handleCloseUserMenu();
    navigate(route, { replace: true });
  };

  const renderAvatar = () => (
    <>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt="Name" />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {settingsPages.map((page) => (
          <MenuItem key={page.name} onClick={() => handleOnClick(page.route)}>
            <Typography textAlign="center">{page.name}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );

  const renderLogin = () => (
    <MenuItem onClick={() => handleOnClick('/login')}>
      <Typography textAlign="center">Log in</Typography>
    </MenuItem>
  );

  return (
    <AppBar
      position="static"
      sx={{ borderBottom: (theme) => `1px solid ${theme.palette.background.paper}`, maxHeight: '9vh' }}
    >
      <Toolbar disableGutters sx={{ flexWrap: 'wrap' }}>
        <Container maxWidth={false}>
          <Grid
            container
            justifyContent="space-between"
            sx={{ px: '7vw' }}
          >
            <Typography
              variant="h4"
              noWrap
              component="a"
              href="/"
              sx={{
                display: { md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 300,
                letterSpacing: '.2rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              React Template
            </Typography>
            <Box sx={{ flexGrow: 0 }}>
              { isAuthenticated
                ? renderAvatar()
                : renderLogin()}
            </Box>
          </Grid>
        </Container>
      </Toolbar>
    </AppBar>
  );
}
