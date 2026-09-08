import React from 'react';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to role-specific dashboard
  React.useEffect(() => {
    if (user?.role) {
      navigate(`/${user.role}`);
    }
  }, [user, navigate]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.name || 'User'}!
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Quick Stats</Typography>
            <Typography variant="body2" color="text.secondary">
              Your dashboard overview coming soon...
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Recent Activity</Typography>
            <Typography variant="body2" color="text.secondary">
              Your recent activity coming soon...
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};