import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link,
  Grid,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Home as HomeIcon,
  Schedule as ScheduleIcon,
  LocationOn,
  AccessTime,
  CalendarToday,
  Info,
  CheckCircle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  scheduleService,
  type Schedule,
  type SuburbsResponse,
  type DayOfWeek,
} from '../../Services/scheduleService';

// ============================================
// CONSTANTS
// ============================================
const ALL_DAYS: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

// ============================================
// COMPONENT
// ============================================
export const ScheduleLookup: React.FC = () => {
  const navigate = useNavigate();

  const [suburbs, setSuburbs] = useState<string[]>([]);
  const [selectedSuburb, setSelectedSuburb] = useState<string>('');
  const [schedule, setSchedule] = useState<Schedule | null>(null);

  const [loadingSuburbs, setLoadingSuburbs] = useState(true);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [error, setError] = useState('');

  // ============================================
  // LOAD SUBURBS ON MOUNT
  // ============================================
  useEffect(() => {
    let isMounted = true;

    const loadSuburbs = async () => {
      setLoadingSuburbs(true);
      try {
        const data: SuburbsResponse = await scheduleService.getSuburbs();
        if (isMounted) {
          setSuburbs(data.suburbs);
        }
      } catch (err: unknown) {
        const error = err as {
          response?: { data?: { message?: string; error?: string } };
        };
        if (isMounted) {
          setError(
            error.response?.data?.message ||
              error.response?.data?.error ||
              'Failed to load suburbs. Please try again.'
          );
        }
      } finally {
        if (isMounted) {
          setLoadingSuburbs(false);
        }
      }
    };

    loadSuburbs();

    return () => {
      isMounted = false;
    };
  }, []);

  // ============================================
  // LOAD SCHEDULE ON SUBURB CHANGE
  // ============================================
  const handleSuburbChange = async (suburb: string) => {
    setSelectedSuburb(suburb);
    setSchedule(null);
    setError('');

    if (!suburb) return;

    setLoadingSchedule(true);
    try {
      const data = await scheduleService.getSuburbSchedule(suburb);
      setSchedule(data);
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string; error?: string } };
      };
      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          'Failed to load schedule. Please try again.'
      );
    } finally {
      setLoadingSchedule(false);
    }
  };

  // ============================================
  // HELPERS
  // ============================================
  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour =
      hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${displayHour}:${minute} ${period}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          color="inherit"
          onClick={() => navigate('/citizen')}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Dashboard
        </Link>
        <Typography color="text.primary">Collection Schedule</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <ScheduleIcon sx={{ fontSize: 40 }} />
        <Box>
          <Typography variant="h5">Collection Schedule</Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Find out when your suburb's waste is collected
          </Typography>
        </Box>
      </Paper>

      {/* Suburb Selector */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Select your suburb
          </Typography>
          <FormControl fullWidth variant="outlined" disabled={loadingSuburbs}>
            <InputLabel id="suburb-select-label">Suburb</InputLabel>
            <Select
              labelId="suburb-select-label"
              id="suburb-select"
              value={selectedSuburb}
              onChange={(e) => handleSuburbChange(e.target.value)}
              label="Suburb"
              startAdornment={
                <InputAdornment position="start">
                  <LocationOn color="action" />
                </InputAdornment>
              }
              renderValue={(selected) => {
                if (!selected) {
                  return (
                    <em style={{ opacity: 0.6 }}>
                      {loadingSuburbs ? 'Loading suburbs...' : 'Select a suburb'}
                    </em>
                  );
                }
                return selected;
              }}
              MenuProps={{
                slotProps: {
                  paper: {
                    style: {
                      maxHeight: 400,
                    },
                  },
                },
              }}
            >
              {loadingSuburbs ? (
                <MenuItem disabled>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Loading...
                </MenuItem>
              ) : (
                suburbs.map((suburb) => (
                  <MenuItem key={suburb} value={suburb}>
                    {suburb}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Empty State */}
      {!selectedSuburb && !loadingSchedule && (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Info sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Select a suburb to view its schedule
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Choose a suburb from the dropdown above to see collection days,
            time window, and the next scheduled pickup.
          </Typography>
        </Paper>
      )}

      {/* Loading */}
      {loadingSchedule && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Schedule Details */}
      {schedule && !loadingSchedule && (
        <>
          {/* Location Info */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="h6">{schedule.suburb}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {schedule.zone} • {schedule.electorate}
                  </Typography>
                </Box>
                <Chip
                  label={`Next: ${formatDate(schedule.nextCollection)}`}
                  color="primary"
                  icon={<CalendarToday />}
                />
              </Box>
            </CardContent>
          </Card>

          <Grid container spacing={3}>
            {/* Collection Days */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Collection Days
                  </Typography>
                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={1}>
                    {ALL_DAYS.map((day) => {
                      const isCollectionDay = schedule.days.includes(day);
                      return (
                        <Grid size={{ xs: 6, sm: 4 }} key={day}>
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              textAlign: 'center',
                              bgcolor: isCollectionDay
                                ? 'success.light'
                                : 'grey.100',
                              color: isCollectionDay
                                ? 'success.contrastText'
                                : 'text.secondary',
                              border: '2px solid',
                              borderColor: isCollectionDay
                                ? 'success.main'
                                : 'grey.300',
                              transition: 'all 0.2s',
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: isCollectionDay ? 700 : 400,
                              }}
                            >
                              {day}
                            </Typography>
                            {isCollectionDay && (
                              <CheckCircle
                                sx={{ fontSize: 16, mt: 0.5 }}
                                color="inherit"
                              />
                            )}
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Time & Info */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
                  >
                    <AccessTime color="primary" />
                    <Typography variant="h6">Time Window</Typography>
                  </Box>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="h4" color="primary.main">
                    {formatTime(schedule.timeWindow.start)} –{' '}
                    {formatTime(schedule.timeWindow.end)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Collection may occur at any time within this window
                  </Typography>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
                  >
                    <Info color="info" />
                    <Typography variant="h6">Tips</Typography>
                  </Box>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    {schedule.notes}
                  </Typography>
                  <Alert severity="success" sx={{ mt: 2 }}>
                    <Typography variant="caption">
                      ✅ All collections are free for residents
                    </Typography>
                  </Alert>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Info Banner */}
          <Alert severity="info" sx={{ mt: 3 }} icon={<Info />}>
            <Typography variant="body2">
              <strong>Can't find your suburb?</strong> Your area might not be
              covered yet. Contact our hotline at <strong>1900-WASTE</strong>{' '}
              for assistance.
            </Typography>
          </Alert>
        </>
      )}
    </Container>
  );
};

export default ScheduleLookup;