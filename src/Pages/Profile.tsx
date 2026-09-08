import React from 'react';
import { Container, Paper, Typography, Box, Avatar, Divider } from '@mui/material';
import { useAuth } from '../Context/AuthContext';

export const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          <Box>
            <Typography variant="h4">{user?.name || 'User'}</Typography>
            <Typography variant="body1" color="text.secondary">
              {user?.email || 'No email'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Role: {user?.role || 'User'}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="text.secondary">
          Profile settings and preferences coming soon...
        </Typography>
      </Paper>
    </Container>
  );
};