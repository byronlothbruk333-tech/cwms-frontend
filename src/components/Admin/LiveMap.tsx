import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Grid,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import {
  Refresh,
  LocalShipping,
  CenterFocusStrong,
} from '@mui/icons-material';
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';
import {
  truckService,
  type Truck,
  type TruckStatus,
} from '../../Services/truckService';

// ============================================
// MAP CONFIG
// ============================================
const mapContainerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '8px',
};

const defaultCenter = {
  lat: -9.4438,
  lng: 147.1803,
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
};

// ============================================
// COMPONENT
// ============================================
export const LiveMap: React.FC = () => {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  // ============================================
  // LOAD TRUCKS
  // ============================================
  const fetchTrucks = async () => {
    setRefreshing(true);
    setError('');

    try {
      const data = await truckService.getAllTrucks();
      setTrucks(data.trucks);
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string; error?: string } };
      };
      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          'Failed to load trucks. Please try again.'
      );
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await truckService.getAllTrucks();

        if (isMounted) {
          setTrucks(data.trucks);
        }
      } catch (err: unknown) {
        const error = err as {
          response?: { data?: { message?: string; error?: string } };
        };
        if (isMounted) {
          setError(
            error.response?.data?.message ||
              error.response?.data?.error ||
              'Failed to load trucks. Please try again.'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // ============================================
  // HANDLERS
  // ============================================
  const handleMarkerClick = (truck: Truck) => {
    setSelectedTruck(truck);
  };

  const handleCenterMap = () => {
    if (map) {
      map.panTo(defaultCenter);
      map.setZoom(13);
    }
  };

  const handleFocusTruck = (truck: Truck) => {
    if (map && truck.latitude && truck.longitude) {
      map.panTo({
        lat: Number(truck.latitude),
        lng: Number(truck.longitude),
      });
      map.setZoom(15);
      setSelectedTruck(truck);
    }
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // ============================================
  // HELPERS
  // ============================================
  const getStatusColor = (status: TruckStatus): string => {
    switch (status) {
      case 'available':
        return '#4CAF50';
      case 'on-route':
        return '#2196F3';
      case 'maintenance':
        return '#FF9800';
      case 'offline':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusChipColor = (
    status: TruckStatus
  ): 'success' | 'info' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'available':
        return 'success';
      case 'on-route':
        return 'info';
      case 'maintenance':
        return 'warning';
      case 'offline':
        return 'error';
      default:
        return 'default';
    }
  };

  const trucksWithLocation = trucks.filter(
    (t) =>
      t.latitude !== null &&
      t.longitude !== null &&
      t.latitude !== undefined &&
      t.longitude !== undefined
  );

  // ============================================
  // LOADING / ERROR STATES
  // ============================================
  if (loadError) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">
          <Typography variant="h6" gutterBottom>
            Failed to load Google Maps
          </Typography>
          <Typography variant="body2">
            {loadError.message || 'Please check your API key configuration.'}
          </Typography>
        </Alert>
      </Container>
    );
  }

  if (!isLoaded || loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            py: 8,
          }}
        >
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading map...</Typography>
        </Box>
      </Container>
    );
  }

  // ============================================
  // RENDER
  // ============================================
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <LocalShipping sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4">Live Fleet Map</Typography>
            <Typography variant="body2" color="text.secondary">
              Real-time tracking of all active waste collection trucks
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<CenterFocusStrong />}
            onClick={handleCenterMap}
          >
            Center Map
          </Button>
          <IconButton onClick={fetchTrucks} disabled={refreshing} color="primary">
            {refreshing ? <CircularProgress size={24} /> : <Refresh />}
          </IconButton>
        </Box>
      </Box>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats Row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          {
            label: 'On Route',
            count: trucks.filter((t) => t.status === 'on-route').length,
            color: 'info.main',
          },
          {
            label: 'Available',
            count: trucks.filter((t) => t.status === 'available').length,
            color: 'success.main',
          },
          {
            label: 'Maintenance',
            count: trucks.filter((t) => t.status === 'maintenance').length,
            color: 'warning.main',
          },
          {
            label: 'Offline',
            count: trucks.filter((t) => t.status === 'offline').length,
            color: 'error.main',
          },
        ].map((stat) => (
          <Grid size={{ xs: 6, sm: 3 }} key={stat.label}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
                <Typography variant="h5" color={stat.color}>
                  {stat.count}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Map */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 2 }}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={defaultCenter}
              zoom={13}
              onLoad={onLoad}
              onUnmount={onUnmount}
              options={mapOptions}
            >
              {trucksWithLocation.map((truck) => (
                <Marker
                  key={truck.id}
                  position={{
                    lat: Number(truck.latitude),
                    lng: Number(truck.longitude),
                  }}
                  onClick={() => handleMarkerClick(truck)}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 12,
                    fillColor: getStatusColor(truck.status),
                    fillOpacity: 1,
                    strokeColor: '#FFFFFF',
                    strokeWeight: 2,
                  }}
                  label={{
                    text: truck.truckId.replace('T-', ''),
                    color: '#FFFFFF',
                    fontSize: '10px',
                    fontWeight: 'bold',
                  }}
                />
              ))}

              {selectedTruck &&
                selectedTruck.latitude &&
                selectedTruck.longitude && (
                  <InfoWindow
                    position={{
                      lat: Number(selectedTruck.latitude),
                      lng: Number(selectedTruck.longitude),
                    }}
                    onCloseClick={() => setSelectedTruck(null)}
                  >
                    <Box sx={{ minWidth: 220, p: 1 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600 }}
                      >
                        🚛 {selectedTruck.truckId}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2">
                        <strong>Driver:</strong>{' '}
                        {selectedTruck.driver?.name ||
                          selectedTruck.driverName ||
                          'Unassigned'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Zone:</strong> {selectedTruck.zone}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Registration:</strong>{' '}
                        {selectedTruck.registrationNumber}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          label={selectedTruck.status
                            .toUpperCase()
                            .replace('-', ' ')}
                          color={getStatusChipColor(selectedTruck.status)}
                          size="small"
                        />
                      </Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mt: 1 }}
                      >
                        Last update:{' '}
                        {new Date(
                          selectedTruck.lastUpdate
                        ).toLocaleTimeString()}
                      </Typography>
                    </Box>
                  </InfoWindow>
                )}
            </GoogleMap>
          </Paper>
        </Grid>

        {/* Truck List */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Trucks ({trucks.length})
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Click a truck to focus on the map
              </Typography>
              <Divider sx={{ my: 2 }} />

              <List sx={{ maxHeight: 520, overflowY: 'auto' }}>
                {trucks.map((truck) => (
                  <ListItem
                    key={truck.id}
                    onClick={() => handleFocusTruck(truck)}
                    sx={{
                      cursor: 'pointer',
                      borderRadius: 1,
                      mb: 1,
                      border: '1px solid',
                      borderColor:
                        selectedTruck?.id === truck.id
                          ? 'primary.main'
                          : 'divider',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: getStatusColor(truck.status) }}>
                        <LocalShipping />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600 }}
                          >
                            {truck.truckId}
                          </Typography>
                          <Chip
                            label={truck.status.replace('-', ' ')}
                            color={getStatusChipColor(truck.status)}
                            size="small"
                            sx={{ height: 18, fontSize: '0.65rem' }}
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography
                            variant="caption"
                            sx={{ display: 'block' }}
                          >
                            {truck.driver?.name ||
                              truck.driverName ||
                              'Unassigned'}{' '}
                            • {truck.zone}
                          </Typography>
                          {truck.latitude && truck.longitude ? (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {Number(truck.latitude).toFixed(4)},{' '}
                              {Number(truck.longitude).toFixed(4)}
                            </Typography>
                          ) : (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              No location data
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LiveMap;