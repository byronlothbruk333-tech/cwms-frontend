import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Chip,
  Alert,
  Divider,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  CalendarToday,
  Recycling,
  Delete as TrashIcon,
  Grass,
  Warning,
  Home as HomeIcon,
} from '@mui/icons-material';  // ← Removed unused LocationOn and AccessTime
import { useNavigate } from 'react-router-dom';

// Types
interface CollectionSchedule {
  id: string;
  zone: string;
  day: string;
  time: string;
  wasteType: 'general' | 'recycling' | 'green' | 'bulky';
  frequency: 'weekly' | 'bi-weekly' | 'monthly';
  notes?: string;
}

interface Suburb {
  id: string;
  name: string;
  zones: string[];
  schedules: CollectionSchedule[];
}

// Mock Data
const mockSuburbs: Suburb[] = [
  {
    id: '1',
    name: 'Central City',
    zones: ['Zone A', 'Zone B', 'Zone C'],
    schedules: [
      {
        id: '1',
        zone: 'Zone A',
        day: 'Monday',
        time: '06:00 - 08:00',
        wasteType: 'general',
        frequency: 'weekly',
        notes: 'Place bins out by 6am',
      },
      {
        id: '2',
        zone: 'Zone A',
        day: 'Wednesday',
        time: '06:00 - 08:00',
        wasteType: 'recycling',
        frequency: 'weekly',
        notes: 'Recycling only - no glass',
      },
      {
        id: '3',
        zone: 'Zone A',
        day: 'Friday',
        time: '06:00 - 08:00',
        wasteType: 'green',
        frequency: 'weekly',
        notes: 'Green waste and garden clippings',
      },
      {
        id: '4',
        zone: 'Zone B',
        day: 'Tuesday',
        time: '07:00 - 09:00',
        wasteType: 'general',
        frequency: 'weekly',
        notes: 'Place bins out by 7am',
      },
      {
        id: '5',
        zone: 'Zone B',
        day: 'Thursday',
        time: '07:00 - 09:00',
        wasteType: 'recycling',
        frequency: 'weekly',
      },
      {
        id: '6',
        zone: 'Zone C',
        day: 'Wednesday',
        time: '08:00 - 10:00',
        wasteType: 'general',
        frequency: 'weekly',
      },
      {
        id: '7',
        zone: 'Zone C',
        day: 'Friday',
        time: '08:00 - 10:00',
        wasteType: 'recycling',
        frequency: 'weekly',
      },
      {
        id: '8',
        zone: 'Zone C',
        day: 'Monday',
        time: '08:00 - 10:00',
        wasteType: 'green',
        frequency: 'weekly',
      },
    ],
  },
  {
    id: '2',
    name: 'Northside',
    zones: ['Zone A', 'Zone B'],
    schedules: [
      {
        id: '9',
        zone: 'Zone A',
        day: 'Monday',
        time: '06:00 - 08:00',
        wasteType: 'general',
        frequency: 'weekly',
      },
      {
        id: '10',
        zone: 'Zone A',
        day: 'Thursday',
        time: '06:00 - 08:00',
        wasteType: 'recycling',
        frequency: 'bi-weekly',
        notes: 'Bi-weekly recycling collection',
      },
      {
        id: '11',
        zone: 'Zone B',
        day: 'Tuesday',
        time: '07:00 - 09:00',
        wasteType: 'general',
        frequency: 'weekly',
      },
      {
        id: '12',
        zone: 'Zone B',
        day: 'Friday',
        time: '07:00 - 09:00',
        wasteType: 'green',
        frequency: 'weekly',
      },
    ],
  },
  {
    id: '3',
    name: 'Southside',
    zones: ['Zone A'],
    schedules: [
      {
        id: '13',
        zone: 'Zone A',
        day: 'Wednesday',
        time: '06:00 - 08:00',
        wasteType: 'general',
        frequency: 'weekly',
      },
      {
        id: '14',
        zone: 'Zone A',
        day: 'Saturday',
        time: '07:00 - 09:00',
        wasteType: 'recycling',
        frequency: 'weekly',
      },
      {
        id: '15',
        zone: 'Zone A',
        day: 'Tuesday',
        time: '06:00 - 08:00',
        wasteType: 'bulky',
        frequency: 'monthly',
        notes: 'Bulky waste - first Tuesday of each month',
      },
    ],
  },
  {
    id: '4',
    name: 'Eastside',
    zones: ['Zone A', 'Zone B', 'Zone C'],
    schedules: [
      {
        id: '16',
        zone: 'Zone A',
        day: 'Monday',
        time: '06:00 - 08:00',
        wasteType: 'general',
        frequency: 'weekly',
      },
      {
        id: '17',
        zone: 'Zone B',
        day: 'Tuesday',
        time: '06:00 - 08:00',
        wasteType: 'general',
        frequency: 'weekly',
      },
      {
        id: '18',
        zone: 'Zone C',
        day: 'Wednesday',
        time: '06:00 - 08:00',
        wasteType: 'general',
        frequency: 'weekly',
      },
    ],
  },
  {
    id: '5',
    name: 'Westside',
    zones: ['Zone A', 'Zone B'],
    schedules: [
      {
        id: '19',
        zone: 'Zone A',
        day: 'Thursday',
        time: '07:00 - 09:00',
        wasteType: 'general',
        frequency: 'weekly',
      },
      {
        id: '20',
        zone: 'Zone B',
        day: 'Friday',
        time: '07:00 - 09:00',
        wasteType: 'general',
        frequency: 'weekly',
      },
    ],
  },
];

export const ScheduleLookup: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSuburb, setSelectedSuburb] = useState<string>('');
  const [selectedZone, setSelectedZone] = useState<string>('');

  const suburbData = mockSuburbs.find(s => s.id === selectedSuburb);
  const zones = suburbData?.zones || [];
  const schedules = suburbData?.schedules.filter(s => 
    !selectedZone || s.zone === selectedZone
  ) || [];

  const getWasteTypeIcon = (type: string) => {
    switch(type) {
      case 'general':
        return <TrashIcon sx={{ color: '#616161' }} />;
      case 'recycling':
        return <Recycling sx={{ color: '#4CAF50' }} />;
      case 'green':
        return <Grass sx={{ color: '#388E3C' }} />;
      case 'bulky':
        return <Warning sx={{ color: '#F57C00' }} />;
      default:
        return <TrashIcon />;
    }
  };

  const getWasteTypeColor = (type: string) => {
    switch(type) {
      case 'general':
        return 'default' as const;
      case 'recycling':
        return 'success' as const;
      case 'green':
        return 'success' as const;
      case 'bulky':
        return 'warning' as const;
      default:
        return 'default' as const;
    }
  };

  const getDayOfWeek = (day: string) => {
    const days = {
      Monday: 'Mon',
      Tuesday: 'Tue',
      Wednesday: 'Wed',
      Thursday: 'Thu',
      Friday: 'Fri',
      Saturday: 'Sat',
      Sunday: 'Sun',
    };
    return days[day as keyof typeof days] || day;
  };

  const handleSuburbChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedSuburb(event.target.value as string);
    setSelectedZone('');
  };

  const handleZoneChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedZone(event.target.value as string);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumb Navigation */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          color="inherit"
          onClick={() => navigate('/citizen')}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Report Issue
        </Link>
        <Typography color="text.primary">Collection Schedule</Typography>
      </Breadcrumbs>

      <Grid container spacing={3}>
        {/* Header */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CalendarToday sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h5" component="h1">
                  Collection Schedule
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Find your waste collection schedule by suburb and zone
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Search/Filters */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Find Your Schedule
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Select Suburb</InputLabel>
                    <Select
                      value={selectedSuburb}
                      onChange={handleSuburbChange}
                      label="Select Suburb"
                    >
                      <MenuItem value="">
                        <em>Select a suburb</em>
                      </MenuItem>
                      {mockSuburbs.map((suburb) => (
                        <MenuItem key={suburb.id} value={suburb.id}>
                          {suburb.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Select Zone</InputLabel>
                    <Select
                      value={selectedZone}
                      onChange={handleZoneChange}
                      label="Select Zone"
                      disabled={!selectedSuburb}
                    >
                      <MenuItem value="">
                        <em>All Zones</em>
                      </MenuItem>
                      {zones.map((zone) => (
                        <MenuItem key={zone} value={zone}>
                          {zone}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Schedule Table */}
        {selectedSuburb && (
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    {suburbData?.name} {selectedZone && `- ${selectedZone}`}
                  </Typography>
                  <Chip 
                    label={`${schedules.length} schedule${schedules.length !== 1 ? 's' : ''}`}
                    color="primary"
                    size="small"
                  />
                </Box>
                <Divider sx={{ mb: 3 }} />

                {schedules.length > 0 ? (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                          <TableCell><strong>Day</strong></TableCell>
                          <TableCell><strong>Zone</strong></TableCell>
                          <TableCell><strong>Time</strong></TableCell>
                          <TableCell><strong>Waste Type</strong></TableCell>
                          <TableCell><strong>Frequency</strong></TableCell>
                          <TableCell><strong>Notes</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {schedules.map((schedule) => (
                          <TableRow 
                            key={schedule.id}
                            hover
                            sx={{
                              '&:hover': { bgcolor: '#f5f5f5' },
                              '&:nth-of-type(odd)': { bgcolor: '#fafafa' },
                            }}
                          >
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <strong>{getDayOfWeek(schedule.day)}</strong>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={schedule.zone} 
                                size="small" 
                                color="info" 
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>{schedule.time}</TableCell>
                            <TableCell>
                              <Chip 
                                icon={getWasteTypeIcon(schedule.wasteType)}
                                label={schedule.wasteType.charAt(0).toUpperCase() + schedule.wasteType.slice(1)}
                                color={getWasteTypeColor(schedule.wasteType)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={schedule.frequency}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              {schedule.notes ? (
                                <Typography variant="caption" color="text.secondary">
                                  {schedule.notes}
                                </Typography>
                              ) : (
                                <Typography variant="caption" color="text.disabled">
                                  —
                                </Typography>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Alert severity="info">
                    No schedules found for the selected zone.
                  </Alert>
                )}

                {/* Legend */}
                <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
                    <strong>Legend:</strong>
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Chip icon={<TrashIcon sx={{ fontSize: 16 }} />} label="General Waste" size="small" color="default" />
                    <Chip icon={<Recycling sx={{ fontSize: 16 }} />} label="Recycling" size="small" color="success" />
                    <Chip icon={<Grass sx={{ fontSize: 16 }} />} label="Green Waste" size="small" color="success" />
                    <Chip icon={<Warning sx={{ fontSize: 16 }} />} label="Bulky Waste" size="small" color="warning" />
                  </Box>
                </Box>

                {/* Important Notes */}
                <Alert severity="info" sx={{ mt: 3 }}>
                  <Typography variant="caption" component="div">
                    <strong>Collection Tips:</strong>
                    <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                      <li>Place bins out by 6:00 AM on collection day</li>
                      <li>Bins should be placed 1 meter apart</li>
                      <li>Ensure lids are fully closed</li>
                      <li>Do not overfill bins</li>
                      <li>For bulky waste, please call our hotline to schedule</li>
                    </ul>
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Empty State */}
        {!selectedSuburb && (
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <CalendarToday sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Select Your Suburb
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Choose your suburb from the dropdown above to view collection schedules
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default ScheduleLookup;