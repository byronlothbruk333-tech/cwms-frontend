import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Container,
  useTheme,
  Menu,
  MenuItem,
} from '@mui/material';
import { Menu as MenuIcon, Home, Login } from '@mui/icons-material';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HomeNavbarProps {
  title?: string;
}

export const HomeNavbar: React.FC<HomeNavbarProps> = ({ title = 'CWMS' }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        bgcolor: theme.palette.primary.main,
        boxShadow: 'none',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'center', py: 1, position: 'relative' }}>
          {/* Left Section - Hamburger Menu */}
          <Box sx={{ position: 'absolute', left: 0 }}>
            <IconButton 
              color="inherit" 
              edge="start" 
              onClick={handleMenuOpen}
              sx={{ color: 'white' }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Center Section - Title (Plain - No Link) */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'white',
                // Removed cursor: 'pointer' and onClick
              }}
            >
              🌍 {title}
            </Typography>
          </Box>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          >            
            {!user ? (
              <MenuItem 
                onClick={() => { 
                  navigate('/login'); 
                  handleMenuClose(); 
                }}
              >
                <Login sx={{ mr: 1 }} /> Login
              </MenuItem>
            ) : (
              <MenuItem 
                onClick={() => { 
                  navigate(`/${user.role}`); 
                  handleMenuClose(); 
                }}
              >
                <Home sx={{ mr: 1 }} /> Dashboard
              </MenuItem>
            )}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};