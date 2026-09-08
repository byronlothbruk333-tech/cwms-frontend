import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack,
  DirectionsCar,
  CheckCircle,
  LocationOn,
  Warning,
  Route as RouteIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import type { RouteStop } from '../../Services/types';

// Types
interface RouteData {
  id: string;
  truckId: string;
  driver: string;
  zone: string;
  status: 'in-progress' | 'completed' | 'delayed' | 'scheduled';
  scheduledStart: string;
  scheduledEnd: string;
  estimatedDuration: number;
  completedStops: number;
  totalStops: number;
  stops: RouteStop[];
}

// Mock data - In production, this comes from your API
const mockRouteData: Record<string, RouteData> = {
  'T-001': {
    id: 'R-001',
    truckId: 'T-001',
    driver: 'John Doe',
    zone: 'Zone A',
    status: 'in-progress',
    scheduledStart: '2024-01-15T06:00:00',
    scheduledEnd: '2024-01-15T18:00:00',
    estimatedDuration: 480,
    completedStops: 3,
    totalStops: 5,
    stops: [
      { id: '1', address: '123 Main St', location: { lat: -9.4438, lng: 147.1803 }, status: 'completed', completedAt: '2024-01-15T08:30:00' },
      { id: '2', address: '45 Park Ave', location: { lat: -9.4450, lng: 147.1850 }, status: 'completed', completedAt: '2024-01-15T09:15:00' },
      { id: '3', address: '78 Beach Rd', location: { lat: -9.4500, lng: 147.1900 }, status: 'completed', completedAt: '2024-01-15T10:00:00' },
      { id: '4', address: '22 Hill St', location: { lat: -9.4550, lng: 147.1950 }, status: 'pending' },
      { id: '5', address: '90 Valley Blvd', location: { lat: -9.4600, lng: 147.2000 }, status: 'pending' },
    ],
  },
  'T-002': {
    id: 'R-002',
    truckId: 'T-002',
    driver: 'Jane Smith',
    zone: 'Zone B',
    status: 'in-progress',
    scheduledStart: '2024-01-15T06:30:00',
    scheduledEnd: '2024-01-15T17:00:00',
    estimatedDuration: 420,
    completedStops: 3,
    totalStops: 4,
    stops: [
      { id: '1', address: '100 Oak St', location: { lat: -9.4470, lng: 147.1880 }, status: 'completed', completedAt: '2024-01-15T07:45:00' },
      { id: '2', address: '200 Pine St', location: { lat: -9.4490, lng: 147.1900 }, status: 'completed', completedAt: '2024-01-15T08:30:00' },
      { id: '3', address: '300 Elm St', location: { lat: -9.4520, lng: 147.1930 }, status: 'completed', completedAt: '2024-01-15T09:15:00' },
      { id: '4', address: '400 Maple Ave', location: { lat: -9.4550, lng: 147.1960 }, status: 'pending' },
    ],
  },
  'T-003': {
    id: 'R-003',
    truckId: 'T-003',
    driver: 'Bob Johnson',
    zone: 'Zone A',
    status: 'delayed',
    scheduledStart: '2024-01-15T07:00:00',
    scheduledEnd: '2024-01-15T16:00:00',
    estimatedDuration: 360,
    completedStops: 2,
    totalStops: 5,
    stops: [
      { id: '1', address: '10 First St', location: { lat: -9.4430, lng: 147.1790 }, status: 'completed', completedAt: '2024-01-15T08:00:00' },
      { id: '2', address: '20 Second St', location: { lat: -9.4460, lng: 147.1830 }, status: 'completed', completedAt: '2024-01-15T08:45:00' },
      { id: '3', address: '30 Third St', location: { lat: -9.4490, lng: 147.1870 }, status: 'pending' },
      { id: '4', address: '40 Fourth St', location: { lat: -9.4530, lng: 147.1920 }, status: 'pending' },
      { id: '5', address: '50 Fifth St', location: { lat: -9.4580, lng: 147.1980 }, status: 'pending' },
    ],
  },
  'T-004': {
    id: 'R-004',
    truckId: 'T-004',
    driver: 'Alice Brown',
    zone: 'Zone C',
    status: 'scheduled',
    scheduledStart: '2024-01-15T08:00:00',
    scheduledEnd: '2024-01-15T15:00:00',
    estimatedDuration: 300,
    completedStops: 0,
    totalStops: 4,
    stops: [
      { id: '1', address: '1000 Hill Rd', location: { lat: -9.4580, lng: 147.2000 }, status: 'pending' },
      { id: '2', address: '2000 Valley Rd', location: { lat: -9.4620, lng: 147.2050 }, status: 'pending' },
      { id: '3', address: '3000 Beach Rd', location: { lat: -9.4650, lng: 147.2100 }, status: 'pending' },
      { id: '4', address: '4000 Park Rd', location: { lat: -9.4680, lng: 147.2150 }, status: 'pending' },
    ],
  },
  'T-005': {
    id: 'R-005',
    truckId: 'T-005',
    driver: 'Charlie Davis',
    zone: 'Zone B',
    status: 'completed',
    scheduledStart: '2024-01-15T06:00:00',
    scheduledEnd: '2024-01-15T14:00:00',
    estimatedDuration: 360,
    completedStops: 3,
    totalStops: 3,
    stops: [
      { id: '1', address: '500 Main Rd', location: { lat: -9.4480, lng: 147.1890 }, status: 'completed', completedAt: '2024-01-15T07:30:00' },
      { id: '2', address: '600 Queen St', location: { lat: -9.4510, lng: 147.1920 }, status: 'completed', completedAt: '2024-01-15T08:15:00' },
      { id: '3', address: '700 King St', location: { lat: -9.4540, lng: 147.1950 }, status: 'completed', completedAt: '2024-01-15T09:00:00' },
    ],
  },
};

export const RouteView: React.FC = () => {
  const navigate = useNavigate();
  const { truckId } = useParams<{ truckId: string }>();
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState<RouteData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // In production, fetch from API
  useEffect(() => {
    const fetchRouteData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const data = mockRouteData[truckId || ''];
        if (data) {
          setRoute(data);
          setError(null);
        } else {
          setError('Route not found for this truck');
        }
      } catch (err) {
        setError('Failed to load route data');
      } finally {
        setLoading(false);
      }
    };

    fetchRouteData();
  }, [truckId]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return '#4CAF50';
      case 'pending': return '#FFA726';
      case 'skipped': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed': return <CheckCircle sx={{ color: '#4CAF50' }} />;
      case 'pending': return <LocationOn sx={{ color: '#FFA726' }} />;
      case 'skipped': return <Warning sx={{ color: '#f44336' }} />;
      default: return <Warning sx={{ color: '#9e9e9e' }} />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'completed': return 'Completed';
      case 'pending': return 'Pending';
      case 'skipped': return 'Skipped';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading route data...</Typography>
      </Container>
    );
  }

  if (error || !route) {
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/admin')}
          sx={{ mb: 3 }}
        >
          Back to Dashboard
        </Button>
        <Alert severity="error">
          {error || 'Route not found'}
        </Alert>
      </Container>
    );
  }

  const completedStops = route.stops.filter(s => s.status === 'completed').length;
  const totalStops = route.stops.length;
  const progress = (completedStops / totalStops) * 100;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/admin')}
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>

      {/* Route Header - Status Summary */}
      <Paper sx={{ p: 3, bgcolor: 'primary.main', color: 'white', mb: 3 }}>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid size="auto">
            <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DirectionsCar sx={{ mr: 1, verticalAlign: 'middle' }} />
              {route.truckId} - Route Status
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
              <strong>Driver:</strong> {route.driver} &nbsp;|&nbsp; <strong>Zone:</strong> {route.zone}
            </Typography>
          </Grid>
          <Grid size="auto">
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                label={route.status.toUpperCase()}
                color={route.status === 'in-progress' ? 'warning' : route.status === 'completed' ? 'success' : 'error'}
                sx={{ color: 'white' }}
              />
              <Chip
                label={`${completedStops}/${totalStops} stops`}
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white' }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Progress Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Route Progress
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ height: 12, borderRadius: 5 }}
              />
            </Box>
            <Typography variant="h5">
              {Math.round(progress)}%
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Completed: {completedStops} stops
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Remaining: {totalStops - completedStops} stops
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Stop List */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <RouteIcon /> All Stops
          </Typography>
          <List>
            {route.stops.map((stop: RouteStop, index: number) => (
              <ListItem
                key={stop.id}
                sx={{
                  borderLeft: `4px solid ${getStatusColor(stop.status)}`,
                  mb: 1,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  py: 1.5,
                }}
              >
                <ListItemIcon>
                  {getStatusIcon(stop.status)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Typography variant="body1">
                        <strong>{index + 1}.</strong> {stop.address}
                      </Typography>
                      <Chip
                        label={getStatusLabel(stop.status)}
                        size="small"
                        sx={{
                          bgcolor: getStatusColor(stop.status),
                          color: 'white',
                          fontWeight: 'bold',
                          height: 22,
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    stop.completedAt && (
                      <Typography variant="caption" color="text.secondary">
                        ✅ Completed at: {new Date(stop.completedAt).toLocaleTimeString()}
                      </Typography>
                    )
                  }
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Container>
  );
};