import React, { useState, useRef } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
  Fab,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  IconButton,
} from '@mui/material';
import {
  Route as RouteIcon,
  CheckCircle,
  PhotoCamera,
  LocationOn,
  Schedule,
  DirectionsCar,
  Warning,
  Navigation,
  Delete,
} from '@mui/icons-material';

import type {Route} from '../../Services/types';
import type { RouteStop } from '../../Services/types';



// Mock route data with complaint types
const mockRoute: Route = {
  id: 'R-2024-001',
  truckId: 'T-001',
  zone: 'Zone A',
  suburb: 'Moresby North-West',
  wards: 'Waigani, Tokarara',
  status: 'in-progress',
  scheduledStart: '2024-01-15T06:00:00',
  scheduledEnd: '2024-01-15T18:00:00',
  estimatedDuration: 480,
  stops: [
    { 
      id: '1', 
      address: '123 Main St', 
      location: { lat: -9.4438, lng: 147.1803 }, 
      status: 'completed',
    },
    { 
      id: '2', 
      address: '45 Park Ave', 
      location: { lat: -9.4450, lng: 147.1850 }, 
      status: 'completed',
    },
    { 
      id: '3', 
      address: '78 Beach Rd', 
      location: { lat: -9.4500, lng: 147.1900 }, 
      status: 'skipped',
    },
    { 
      id: '4', 
      address: '22 Hill St', 
      location: { lat: -9.4550, lng: 147.1950 }, 
      status: 'pending',
      isComplaintStop: true,
      complaintType: 'missed-collection',
    },
    { 
      id: '5', 
      address: '90 Valley Blvd', 
      location: { lat: -9.4600, lng: 147.2000 }, 
      status: 'pending',
      isComplaintStop: true,
      complaintType: 'illegal-dumping',
    },
  ],
};

export const DriverPortal: React.FC = () => {
  const [route, setRoute] = useState<Route>(mockRoute);
  const [selectedStop, setSelectedStop] = useState<RouteStop | null>(null);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [photoType, setPhotoType] = useState<'before' | 'after'>('before');
  const [currentComplaintType, setCurrentComplaintType] = useState<'missed-collection' | 'illegal-dumping'>('illegal-dumping');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Photo states for Missed Collection
  const [missedBeforePhotos, setMissedBeforePhotos] = useState<File[]>([]);
  const [missedBeforePhotoUrls, setMissedBeforePhotoUrls] = useState<string[]>([]);
  const [missedAfterPhotos, setMissedAfterPhotos] = useState<File[]>([]);
  const [missedAfterPhotoUrls, setMissedAfterPhotoUrls] = useState<string[]>([]);

  // Photo states for Illegal Dumping
  const [dumpBeforePhotos, setDumpBeforePhotos] = useState<File[]>([]);
  const [dumpBeforePhotoUrls, setDumpBeforePhotoUrls] = useState<string[]>([]);
  const [dumpAfterPhotos, setDumpAfterPhotos] = useState<File[]>([]);
  const [dumpAfterPhotoUrls, setDumpAfterPhotoUrls] = useState<string[]>([]);

  const completedStops = route.stops.filter(s => s.status === 'completed').length;
  const totalStops = route.stops.length;
  const progress = (completedStops / totalStops) * 100;

  // Navigate to stop using Google Maps
  const navigateToStop = (stop: RouteStop) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${stop.location.lat},${stop.location.lng}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const newPhotoUrls = newFiles.map(file => URL.createObjectURL(file));

    // Check which complaint type and photo type we're dealing with
    if (currentComplaintType === 'missed-collection') {
      if (photoType === 'before') {
        setMissedBeforePhotos([...missedBeforePhotos, ...newFiles]);
        setMissedBeforePhotoUrls([...missedBeforePhotoUrls, ...newPhotoUrls]);
      } else if (photoType === 'after') {
        setMissedAfterPhotos([...missedAfterPhotos, ...newFiles]);
        setMissedAfterPhotoUrls([...missedAfterPhotoUrls, ...newPhotoUrls]);
      }
    } else if (currentComplaintType === 'illegal-dumping') {
      if (photoType === 'before') {
        setDumpBeforePhotos([...dumpBeforePhotos, ...newFiles]);
        setDumpBeforePhotoUrls([...dumpBeforePhotoUrls, ...newPhotoUrls]);
      } else if (photoType === 'after') {
        setDumpAfterPhotos([...dumpAfterPhotos, ...newFiles]);
        setDumpAfterPhotoUrls([...dumpAfterPhotoUrls, ...newPhotoUrls]);
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = (
    index: number, 
    type: 'before' | 'after',
    complaintType: 'missed-collection' | 'illegal-dumping'
  ) => {
    if (complaintType === 'missed-collection') {
      if (type === 'before') {
        URL.revokeObjectURL(missedBeforePhotoUrls[index]);
        const newPhotos = [...missedBeforePhotos];
        const newPhotoUrls = [...missedBeforePhotoUrls];
        newPhotos.splice(index, 1);
        newPhotoUrls.splice(index, 1);
        setMissedBeforePhotos(newPhotos);
        setMissedBeforePhotoUrls(newPhotoUrls);
      } else if (type === 'after') {
        URL.revokeObjectURL(missedAfterPhotoUrls[index]);
        const newPhotos = [...missedAfterPhotos];
        const newPhotoUrls = [...missedAfterPhotoUrls];
        newPhotos.splice(index, 1);
        newPhotoUrls.splice(index, 1);
        setMissedAfterPhotos(newPhotos);
        setMissedAfterPhotoUrls(newPhotoUrls);
      }
    } else if (complaintType === 'illegal-dumping') {
      if (type === 'before') {
        URL.revokeObjectURL(dumpBeforePhotoUrls[index]);
        const newPhotos = [...dumpBeforePhotos];
        const newPhotoUrls = [...dumpBeforePhotoUrls];
        newPhotos.splice(index, 1);
        newPhotoUrls.splice(index, 1);
        setDumpBeforePhotos(newPhotos);
        setDumpBeforePhotoUrls(newPhotoUrls);
      } else if (type === 'after') {
        URL.revokeObjectURL(dumpAfterPhotoUrls[index]);
        const newPhotos = [...dumpAfterPhotos];
        const newPhotoUrls = [...dumpAfterPhotoUrls];
        newPhotos.splice(index, 1);
        newPhotoUrls.splice(index, 1);
        setDumpAfterPhotos(newPhotos);
        setDumpAfterPhotoUrls(newPhotoUrls);
      }
    }
  };

  const openPhotoDialog = (
    type: 'before' | 'after',
    complaintType: 'missed-collection' | 'illegal-dumping'
  ) => {
    setPhotoType(type);
    setCurrentComplaintType(complaintType);
    setShowPhotoDialog(true);
  };

  const getBeforePhotos = () => {
    if (currentComplaintType === 'missed-collection') {
      return missedBeforePhotos;
    } else {
      return dumpBeforePhotos;
    }
  };

  const getAfterPhotos = () => {
    if (currentComplaintType === 'missed-collection') {
      return missedAfterPhotos;
    } else {
      return dumpAfterPhotos;
    }
  };

  const getBeforePhotoUrls = () => {
    if (currentComplaintType === 'missed-collection') {
      return missedBeforePhotoUrls;
    } else {
      return dumpBeforePhotoUrls;
    }
  };

  const getAfterPhotoUrls = () => {
    if (currentComplaintType === 'missed-collection') {
      return missedAfterPhotoUrls;
    } else {
      return dumpAfterPhotoUrls;
    }
  };

  const handleCompleteStop = (stop: RouteStop) => {
    // Check if complaint stop requires photos
    if (stop.isComplaintStop && stop.complaintType === 'missed-collection') {
      // For missed collection, check if we have photos for this specific stop
      // We need to check if this stop has any photos stored
      const hasBefore = missedBeforePhotos.length > 0;
      const hasAfter = missedAfterPhotos.length > 0;
      
      if (!hasBefore || !hasAfter) {
        alert('Please take both "Before" and "After" photos for this missed collection complaint.');
        return;
      }
    }
    
    if (stop.isComplaintStop && stop.complaintType === 'illegal-dumping') {
      const hasBefore = dumpBeforePhotos.length > 0;
      const hasAfter = dumpAfterPhotos.length > 0;
      
      if (!hasBefore || !hasAfter) {
        alert('Please take both "Before" and "After" photos for this illegal dumping report.');
        return;
      }
    }

    setRoute((prev: Route) => ({
      ...prev,
      stops: prev.stops.map((s: RouteStop) => {
        if (s.id === stop.id) {
          return {
            ...s,
            status: 'completed' as const,
            completedAt: new Date().toISOString(),
            beforePhoto: 'photos_taken',
            afterPhoto: 'photos_taken',
          };
        }
        return s;
      }),
    }));
    
    setSelectedStop(null);
    // Reset all photo states when completing a stop
    setMissedBeforePhotos([]);
    setMissedBeforePhotoUrls([]);
    setMissedAfterPhotos([]);
    setMissedAfterPhotoUrls([]);
    setDumpBeforePhotos([]);
    setDumpBeforePhotoUrls([]);
    setDumpAfterPhotos([]);
    setDumpAfterPhotoUrls([]);
  };

  const getComplaintLabel = (stop: RouteStop) => {
    if (!stop.isComplaintStop) return null;
    switch(stop.complaintType) {
      case 'missed-collection': return '⚠️ Missed Collection';
      case 'illegal-dumping': return '🚯 Illegal Dumping';
      default: return '⚠️ Complaint';
    }
  };

  const getComplaintColor = (stop: RouteStop) => {
    if (!stop.isComplaintStop) return 'default';
    switch(stop.complaintType) {
      case 'missed-collection': return 'warning' as const;
      case 'illegal-dumping': return 'error' as const;
      default: return 'info' as const;
    }
  };

  const renderPhotoPreviews = (
    urls: string[], 
    type: 'before' | 'after',
    complaintType: 'missed-collection' | 'illegal-dumping'
  ) => {
    if (urls.length === 0) return null;
    
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
        {urls.map((url, index) => (
          <Box
            key={index}
            sx={{
              position: 'relative',
              width: 80,
              height: 80,
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              overflow: 'hidden',
            }}
          >
            <img
              src={url}
              alt={`${type} photo ${index + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <IconButton
              size="small"
              sx={{
                position: 'absolute',
                top: 2,
                right: 2,
                bgcolor: 'rgba(0,0,0,0.6)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.8)',
                },
                width: 20,
                height: 20,
              }}
              onClick={() => handleRemovePhoto(index, type, complaintType)}
            >
              <Delete sx={{ fontSize: 12 }} />
            </IconButton>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
            <Grid container spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Grid size="auto">
                <Typography variant="h5">
                  <DirectionsCar sx={{ mr: 1, verticalAlign: 'middle' }} />
                 Truck ID: {route.truckId} 
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                   Today's Route:{route.zone} | {route.suburb} | {route.wards}
                </Typography>
              </Grid>
              <Grid size="auto">
                <Chip
                  label={route.status.toUpperCase()}
                  color={route.status === 'in-progress' ? 'warning' : 'success'}
                  sx={{ color: 'white' }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Progress Section */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Route Progress
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={progress} 
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Typography variant="h6">
                  {Math.round(progress)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {completedStops}/{totalStops} stops
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Content - Stops List */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Schedule /> Stops ({totalStops})
              </Typography>
              <List>
                {route.stops.map((stop, index) => (
                  <ListItem
                    key={stop.id}
                    onClick={() => {
                      setSelectedStop(stop);
                      // Reset photo states when selecting new stop
                      setMissedBeforePhotos([]);
                      setMissedBeforePhotoUrls([]);
                      setMissedAfterPhotos([]);
                      setMissedAfterPhotoUrls([]);
                      setDumpBeforePhotos([]);
                      setDumpBeforePhotoUrls([]);
                      setDumpAfterPhotos([]);
                      setDumpAfterPhotoUrls([]);
                    }}
                    sx={{
                      cursor: 'pointer',
                      borderLeft: `4px solid ${
                        stop.status === 'completed' ? '#4CAF50' :
                        stop.status === 'skipped' ? '#f44336' : '#FFA726'
                      }`,
                      mb: 1,
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <ListItemIcon>
                      {stop.status === 'completed' ? (
                        <CheckCircle color="success" />
                      ) : stop.status === 'pending' ? (
                        <LocationOn color="warning" />
                      ) : (
                        <Warning color="error" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1">
                            {index + 1}. {stop.address}
                          </Typography>
                          {stop.isComplaintStop && (
                            <Chip 
                              label={getComplaintLabel(stop)}
                              size="small" 
                              color={getComplaintColor(stop)}
                              variant="outlined"
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          Status: {stop.status.toUpperCase()}
                          {stop.completedAt && ` | Completed: ${new Date(stop.completedAt).toLocaleTimeString()}`}
                        </Typography>
                      }
                    />
                    {stop.status === 'pending' && (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<CheckCircle />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCompleteStop(stop);
                        }}
                      >
                        Complete
                      </Button>
                    )}
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Panel - Selected Stop Details */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              {selectedStop ? (
                <>
                  <Typography variant="h6" gutterBottom>
                    Stop Details
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Address
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedStop.address}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      Status
                    </Typography>
                    <Chip 
                      label={selectedStop.status.toUpperCase()}
                      color={selectedStop.status === 'completed' ? 'success' : 
                             selectedStop.status === 'pending' ? 'warning' : 'error'}
                    />

                    {/* Complaint Alert */}
                    {selectedStop.isComplaintStop && (
                      <Alert 
                        severity={selectedStop.complaintType === 'illegal-dumping' ? 'error' : 'warning'} 
                        sx={{ mt: 2 }}
                      >
                        <strong>
                          {selectedStop.complaintType === 'illegal-dumping' 
                            ? '🚯 Illegal Dumping Report' 
                            : '⚠️ Missed Collection Complaint'}
                        </strong>
                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                          {selectedStop.complaintType === 'illegal-dumping' 
                            ? 'Before & After photos required for this report.'
                            : 'Before & After photos required for this complaint.'}
                        </Typography>
                      </Alert>
                    )}

                    <Box sx={{ mt: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        Quick Actions
                      </Typography>
                      <Grid container spacing={1} sx={{ mt: 1 }}>
                        <Grid size={{ xs: selectedStop.isComplaintStop ? 6 : 12 }}>
                          <Button 
                            variant="outlined" 
                            fullWidth
                            startIcon={<Navigation />}
                            onClick={() => navigateToStop(selectedStop)}
                            disabled={selectedStop.status === 'completed'}
                          >
                            Navigate
                          </Button>
                        </Grid>
                        
                        {/* Photo Actions for Complaint Stops - Both types now have Before & After */}
                        {selectedStop.isComplaintStop && selectedStop.status !== 'completed' && (
                          <>
                            <Grid size={{ xs: 6 }}>
                              <Button 
                                variant={
                                  (selectedStop.complaintType === 'missed-collection' 
                                    ? missedBeforePhotos 
                                    : dumpBeforePhotos
                                  ).length > 0 ? "contained" : "outlined"
                                }
                                fullWidth
                                size="small"
                                startIcon={<PhotoCamera />}
                                onClick={() => openPhotoDialog('before', selectedStop.complaintType!)}
                                color={
                                  (selectedStop.complaintType === 'missed-collection' 
                                    ? missedBeforePhotos 
                                    : dumpBeforePhotos
                                  ).length > 0 ? "success" : "primary"
                                }
                              >
                                {(selectedStop.complaintType === 'missed-collection' 
                                  ? missedBeforePhotos 
                                  : dumpBeforePhotos
                                ).length > 0 
                                  ? `✅ Before (${(selectedStop.complaintType === 'missed-collection' ? missedBeforePhotos : dumpBeforePhotos).length})` 
                                  : '📸 Before'}
                              </Button>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                              <Button 
                                variant={
                                  (selectedStop.complaintType === 'missed-collection' 
                                    ? missedAfterPhotos 
                                    : dumpAfterPhotos
                                  ).length > 0 ? "contained" : "outlined"
                                }
                                fullWidth
                                size="small"
                                startIcon={<PhotoCamera />}
                                onClick={() => openPhotoDialog('after', selectedStop.complaintType!)}
                                color={
                                  (selectedStop.complaintType === 'missed-collection' 
                                    ? missedAfterPhotos 
                                    : dumpAfterPhotos
                                  ).length > 0 ? "success" : "primary"
                                }
                              >
                                {(selectedStop.complaintType === 'missed-collection' 
                                  ? missedAfterPhotos 
                                  : dumpAfterPhotos
                                ).length > 0 
                                  ? `✅ After (${(selectedStop.complaintType === 'missed-collection' ? missedAfterPhotos : dumpAfterPhotos).length})` 
                                  : '📸 After'}
                              </Button>
                            </Grid>
                          </>
                        )}
                      </Grid>

                      {/* Photo previews for all complaint stops */}
                      {selectedStop.isComplaintStop && selectedStop.status !== 'completed' && (
                        <Box sx={{ mt: 2 }}>
                          {selectedStop.complaintType === 'missed-collection' ? (
                            // Missed Collection photos
                            <>
                              {missedBeforePhotos.length > 0 && (
                                <Box sx={{ mb: 1 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    Before Photos:
                                  </Typography>
                                  {renderPhotoPreviews(missedBeforePhotoUrls, 'before', 'missed-collection')}
                                </Box>
                              )}
                              {missedAfterPhotos.length > 0 && (
                                <Box>
                                  <Typography variant="caption" color="text.secondary">
                                    After Photos:
                                  </Typography>
                                  {renderPhotoPreviews(missedAfterPhotoUrls, 'after', 'missed-collection')}
                                </Box>
                              )}
                            </>
                          ) : (
                            // Illegal Dumping photos
                            <>
                              {dumpBeforePhotos.length > 0 && (
                                <Box sx={{ mb: 1 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    Before Photos:
                                  </Typography>
                                  {renderPhotoPreviews(dumpBeforePhotoUrls, 'before', 'illegal-dumping')}
                                </Box>
                              )}
                              {dumpAfterPhotos.length > 0 && (
                                <Box>
                                  <Typography variant="caption" color="text.secondary">
                                    After Photos:
                                  </Typography>
                                  {renderPhotoPreviews(dumpAfterPhotoUrls, 'after', 'illegal-dumping')}
                                </Box>
                              )}
                            </>
                          )}
                        </Box>
                      )}

                      {/* Photo Status Messages */}
                      {selectedStop.isComplaintStop && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                          {(() => {
                            let beforeCount = 0;
                            let afterCount = 0;
                            
                            if (selectedStop.complaintType === 'missed-collection') {
                              beforeCount = missedBeforePhotos.length;
                              afterCount = missedAfterPhotos.length;
                            } else {
                              beforeCount = dumpBeforePhotos.length;
                              afterCount = dumpAfterPhotos.length;
                            }
                            
                            if (beforeCount > 0 && afterCount > 0) {
                              return `✅ Both photos captured (${beforeCount} before, ${afterCount} after)`;
                            } else if (beforeCount > 0) {
                              return '⚠️ Please take "After" photo';
                            } else {
                              return '⚠️ Please take "Before" and "After" photos';
                            }
                          })()}
                        </Typography>
                      )}

                      <Button 
                        variant="contained" 
                        fullWidth
                        startIcon={<CheckCircle />}
                        onClick={() => handleCompleteStop(selectedStop)}
                        disabled={
                          selectedStop.status === 'completed' ||
                          (selectedStop.isComplaintStop && 
                            (() => {
                              let beforeCount = 0;
                              let afterCount = 0;
                              
                              if (selectedStop.complaintType === 'missed-collection') {
                                beforeCount = missedBeforePhotos.length;
                                afterCount = missedAfterPhotos.length;
                              } else {
                                beforeCount = dumpBeforePhotos.length;
                                afterCount = dumpAfterPhotos.length;
                              }
                              
                              return beforeCount === 0 || afterCount === 0;
                            })()
                          )
                        }
                        sx={{ mt: 2 }}
                      >
                        {selectedStop.isComplaintStop && 
                          (() => {
                            let beforeCount = 0;
                            let afterCount = 0;
                            
                            if (selectedStop.complaintType === 'missed-collection') {
                              beforeCount = missedBeforePhotos.length;
                              afterCount = missedAfterPhotos.length;
                            } else {
                              beforeCount = dumpBeforePhotos.length;
                              afterCount = dumpAfterPhotos.length;
                            }
                            
                            if (beforeCount === 0 || afterCount === 0) {
                              return '📸 Take Required Photos First';
                            }
                            return selectedStop.status === 'completed' ? '✅ Completed' : 'Complete Stop';
                          })()
                        }
                      </Button>
                    </Box>

                    <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        💡 Tip: Before & After photos are required for all complaint stops
                        {selectedStop.isComplaintStop && selectedStop.complaintType === 'illegal-dumping' 
                          ? ' (Illegal Dumping)' 
                          : selectedStop.isComplaintStop && selectedStop.complaintType === 'missed-collection'
                            ? ' (Missed Collection)'
                            : ''}
                      </Typography>
                    </Box>
                  </Box>
                </>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <RouteIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    Select a stop from the list to view details and take action
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Photo Upload Dialog - Same design as Citizen Portal */}
      <Dialog 
        open={showPhotoDialog} 
        onClose={() => setShowPhotoDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {photoType === 'before' && '📸 Take "Before" Photo'}
          {photoType === 'after' && '📸 Take "After" Photo'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {photoType === 'before' && `Take a photo showing the site BEFORE ${
                currentComplaintType === 'missed-collection' ? 'collection' : 'cleanup'
              }.`}
              {photoType === 'after' && `Take a photo showing the site AFTER ${
                currentComplaintType === 'missed-collection' ? 'collection' : 'cleanup'
              }.`}
            </Typography>
            
            <Alert 
              severity={
                photoType === 'before' ? 'warning' : 'success'
              } 
              sx={{ mt: 1, mb: 2 }}
            >
              {photoType === 'before' && `This photo serves as evidence of the ${
                currentComplaintType === 'missed-collection' ? 'missed collection' : 'illegal dumping'
              }`}
              {photoType === 'after' && `This photo confirms the ${
                currentComplaintType === 'missed-collection' ? 'collection' : 'issue'
              } has been resolved`}
            </Alert>

            {/* Photo Upload Area */}
            <Box sx={{ mb: 2 }}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                ref={fileInputRef}
                style={{ display: 'none' }}
                id="driver-photo-upload"
              />
              <label htmlFor="driver-photo-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<PhotoCamera />}
                  fullWidth
                  sx={{ py: 2 }}
                >
                  Add Photos
                </Button>
              </label>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                You can select multiple photos (JPG, PNG, GIF)
              </Typography>
            </Box>

            {/* Photo Preview */}
            {photoType === 'before' && renderPhotoPreviews(getBeforePhotoUrls(), 'before', currentComplaintType)}
            {photoType === 'after' && renderPhotoPreviews(getAfterPhotoUrls(), 'after', currentComplaintType)}

            {((photoType === 'before' && getBeforePhotos().length > 0) ||
             (photoType === 'after' && getAfterPhotos().length > 0)) && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {photoType === 'before' && `${getBeforePhotos().length} before photo(s) captured`}
                {photoType === 'after' && `${getAfterPhotos().length} after photo(s) captured`}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPhotoDialog(false)}>Close</Button>
          <Button 
            variant="contained" 
            onClick={() => setShowPhotoDialog(false)}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button for Emergency */}
      <Fab 
        color="error" 
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        onClick={() => alert('Emergency reported to dispatch!')}
      >
        <Warning />
      </Fab>
    </Container>
  );
};