import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Container,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications,
  Person,
  Dashboard as DashboardIcon,
  ExitToApp,
  Map,
} from '@mui/icons-material';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AdminNavbarProps {
  title?: string;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({ title = 'CWMS' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileAnchorEl, setMobileAnchorEl] = useState<null | HTMLElement>(null);
  const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };

  const getRoleLabel = (role: string) => {
    switch(role) {
      case 'admin': return 'Administrator';
      case 'driver': return 'Driver';
      case 'citizen': return 'Citizen';
      default: return 'User';
    }
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: theme.palette.primary.main }}>
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          {/* Left Section - Logo and Hamburger Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              color="inherit" 
              edge="start" 
              onClick={handleMobileMenuOpen}
              sx={{ color: 'white' }}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
              }}
            >
              🌍 {title}
            </Typography>
          </Box>

          {/* Center Section - Empty (Navigation moved to hamburger) */}
          <Box sx={{ display: 'flex', gap: 2 }} />

          {/* Right Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit" onClick={(e) => setNotifAnchor(e.currentTarget)}>
              <Notifications />
            </IconButton>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                {user?.name}
                <span style={{ opacity: 0.7, fontSize: '0.8rem', marginLeft: '4px' }}>
                  ({getRoleLabel(user?.role || '')})
                </span>
              </Typography>
              <IconButton onClick={handleMenuOpen} color="inherit">
                <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.secondary.main }}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
              </IconButton>
            </Box>

            {/* Profile Dropdown Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                <Person sx={{ mr: 1 }} /> Profile
              </MenuItem>
            </Menu>

            {/* Hamburger Menu - Contains Dashboard & Live Map ONLY */}
            <Menu
              anchorEl={mobileAnchorEl}
              open={Boolean(mobileAnchorEl)}
              onClose={handleMobileMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
              <MenuItem 
                onClick={() => { 
                  navigate('/admin'); 
                  handleMobileMenuClose(); 
                }}
              >
                <DashboardIcon sx={{ mr: 1 }} /> Dashboard
              </MenuItem>
              <MenuItem 
                onClick={() => { 
                  navigate('/admin'); 
                  handleMobileMenuClose(); 
                }}
              >
                <DashboardIcon sx={{ mr: 1 }} /> Truck Registry
              </MenuItem>
              <MenuItem 
                onClick={() => { 
                  navigate('/admin/map'); 
                  handleMobileMenuClose(); 
                }}
              >
              <Map sx={{ mr: 1 }} /> Live Map
              </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <ExitToApp sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};