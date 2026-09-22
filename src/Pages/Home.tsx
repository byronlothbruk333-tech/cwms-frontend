import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
          Welcome to CleanTrack
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
  <i>"Smart Waste Management for Cleaner Cities"</i>
</Typography>
        {!user ? (
          <Button 
            variant="contained" 
            size="large" 
            onClick={() => navigate('/login')}
            sx={{ mt: 2 }}
          >
            Get Started
          </Button>
        ) : (
          <Button 
            variant="contained" 
            size="large" 
            onClick={() => navigate(`/${user.role}`)}
            sx={{ mt: 2 }}
          >
            Go to Dashboard
          </Button>
        )}
      </Box>

      {/* Cards Section - Centered */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Grid 
          container 
          spacing={4} 
          sx={{ 
            maxWidth: 800,
            justifyContent: 'center',
          }}
        >
          {/* Card 1: For Citizens */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
                p: 2,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Typography variant="h1" sx={{ fontSize: 48, mb: 2 }}>
                  🙋
                </Typography>
                <Typography variant="h5" gutterBottom>
                  For Citizens
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Report issues, check schedules, and track complaints
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Card 2: For Drivers */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
                p: 2,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Typography variant="h1" sx={{ fontSize: 48, mb: 2 }}>
                  🚛
                </Typography>
                <Typography variant="h5" gutterBottom>
                  For Drivers
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  View routes, update status, and manage collections
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};