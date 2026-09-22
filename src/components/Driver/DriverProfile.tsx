import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  Divider,
  Alert,
  Snackbar,
  Switch,
  FormControlLabel,
  Paper,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Public as PublicIcon,
  Notifications,
  LocalShipping,
  Route as RouteIcon,
  CheckCircle,
  Timer,
  Pending as PendingIcon,
  Speed,
  TrendingUp,
  Schedule,
} from '@mui/icons-material';
import { useAuth } from '../../Context/AuthContext';

// ============================================
// MOCK DATA (will come from backend later)
// ============================================
const mockAssignedTruck = {
  truckId: 'T-001',
  registrationNumber: 'ABC-123',
  capacity: 100,
  zone: 'Zone A',
  status: 'on-route',
};

const mockTodayStats = {
  totalStops: 5,
  completed: 2,
  inProgress: 1,
  pending: 2,
};

const mockPerformance = {
  completionRate: 95,
  punctuality: 88,
  fuelEfficiency: 92,
};

// ============================================
// COMPONENT
// ============================================
export const DriverProfile: React.FC = () => {
  const { user, updateUser } = useAuth();

  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(
    user?.emailNotifications ?? true
  );
  const [smsNotifications, setSmsNotifications] = useState(
    user?.smsNotifications ?? false
  );

  // Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'error' | 'info' | 'warning'
  >('info');

  // ============================================
  // HANDLERS
  // ============================================
  const showSnackbar = (message: string, severity: typeof snackbarSeverity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleNotificationChange = (type: 'email' | 'sms', value: boolean) => {
    if (type === 'email') {
      setEmailNotifications(value);
      updateUser({ emailNotifications: value });
      showSnackbar(`Email notifications ${value ? 'enabled' : 'disabled'}`, 'info');
    } else {
      setSmsNotifications(value);
      updateUser({ smsNotifications: value });
      showSnackbar(`SMS notifications ${value ? 'enabled' : 'disabled'}`, 'info');
    }
  };

  // ============================================
  // NOT LOGGED IN STATE
  // ============================================
  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">You must be logged in to view your profile.</Alert>
      </Container>
    );
  }

  // ============================================
  // RENDER
  // ============================================
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* ============ INFO BANNER ============ */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Note:</strong> Your profile information is managed by the Administrator. To
          update your details, please contact your supervisor.
        </Typography>
      </Alert>

      {/* ============ HEADER CARD ============ */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              flexWrap: 'wrap',
            }}
          >
            <Avatar
              src={user.avatar}
              sx={{
                width: 100,
                height: 100,
                bgcolor: 'info.main',
                fontSize: 40,
                fontWeight: 600,
              }}
            >
              {user.name?.charAt(0).toUpperCase()}
            </Avatar>

            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" gutterBottom>
                {user.name}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  flexWrap: 'wrap',
                }}
              >
                <Chip
                  icon={<LocalShipping />}
                  label={user.role.toUpperCase()}
                  color="info"
                  size="small"
                />
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* ============ LEFT COLUMN ============ */}
        <Grid size={{ xs: 12, md: 7 }}>
          {/* ---- Personal Information (Read-Only) ---- */}
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Person color="info" />
                <Typography variant="h6">Personal Information</Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <InfoRow icon={<Person />} label="Full Name" value={user.name} />
                <InfoRow icon={<Email />} label="Email" value={user.email} />
                <InfoRow
                  icon={<Phone />}
                  label="Phone"
                  value={user.phone || 'Not provided'}
                />
                <InfoRow
                  icon={<LocationOn />}
                  label="Address"
                  value={user.address || 'Not provided'}
                />
                <InfoRow
                  icon={<PublicIcon />}
                  label="Zone"
                  value={user.zone || 'Not assigned'}
                />
              </Box>
            </CardContent>
          </Card>

          {/* ---- Assigned Truck ---- */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LocalShipping color="info" />
                <Typography variant="h6">Assigned Truck</Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <InfoRow
                  icon={<LocalShipping />}
                  label="Truck ID"
                  value={mockAssignedTruck.truckId}
                />
                <InfoRow
                  icon={<Person />}
                  label="Registration Number"
                  value={mockAssignedTruck.registrationNumber}
                />
                <InfoRow
                  icon={<Schedule />}
                  label="Capacity"
                  value={`${mockAssignedTruck.capacity} units`}
                />
                <InfoRow
                  icon={<PublicIcon />}
                  label="Assigned Zone"
                  value={mockAssignedTruck.zone}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ color: 'text.secondary', mt: 0.5 }}>
                    <CheckCircle />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Status
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Chip
                        label={mockAssignedTruck.status.toUpperCase().replace('-', ' ')}
                        color="info"
                        size="small"
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* ---- Notification Preferences ---- */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Notifications color="info" />
                <Typography variant="h6">Notification Preferences</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Typography variant="caption" color="text.secondary">
                You can control how you receive route and dispatch notifications.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={emailNotifications}
                      onChange={(e) => handleNotificationChange('email', e.target.checked)}
                    />
                  }
                  label="Email notifications (route changes, updates)"
                />
                <br />
                <FormControlLabel
                  control={
                    <Switch
                      checked={smsNotifications}
                      onChange={(e) => handleNotificationChange('sms', e.target.checked)}
                    />
                  }
                  label="SMS notifications (urgent dispatch alerts)"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* ============ RIGHT COLUMN ============ */}
        <Grid size={{ xs: 12, md: 5 }}>
          {/* ---- Today's Route Stats ---- */}
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <RouteIcon color="info" />
                <Typography variant="h6">Today's Route</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      bgcolor: 'info.50',
                    }}
                  >
                    <Typography variant="h4" color="info.main">
                      {mockTodayStats.totalStops}
                    </Typography>
                    <Typography variant="caption">Total Stops</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      <CheckCircle fontSize="small" color="success" />
                      <Typography variant="h4" color="success.main">
                        {mockTodayStats.completed}
                      </Typography>
                    </Box>
                    <Typography variant="caption">Completed</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      <Timer fontSize="small" color="info" />
                      <Typography variant="h4" color="info.main">
                        {mockTodayStats.inProgress}
                      </Typography>
                    </Box>
                    <Typography variant="caption">In Progress</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      <PendingIcon fontSize="small" color="warning" />
                      <Typography variant="h4" color="warning.main">
                        {mockTodayStats.pending}
                      </Typography>
                    </Box>
                    <Typography variant="caption">Pending</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* ---- Performance Metrics ---- */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TrendingUp color="info" />
                <Typography variant="h6">Performance</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <MetricBar
                  icon={<CheckCircle fontSize="small" />}
                  label="Completion Rate"
                  value={mockPerformance.completionRate}
                  color="success"
                />
                <MetricBar
                  icon={<Schedule fontSize="small" />}
                  label="Punctuality"
                  value={mockPerformance.punctuality}
                  color="info"
                />
                <MetricBar
                  icon={<Speed fontSize="small" />}
                  label="Fuel Efficiency"
                  value={mockPerformance.fuelEfficiency}
                  color="warning"
                />
              </Box>
            </CardContent>
          </Card>

          {/* ---- Info Panel ---- */}
          <Paper sx={{ mt: 3, p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              💡 Reminder
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              Only the Administrator can modify your personal information. Contact your
              supervisor for any changes.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* ============ SNACKBAR ============ */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

// ============================================
// HELPERS
// ============================================

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
    <Box sx={{ color: 'text.secondary', mt: 0.5 }}>{icon}</Box>
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">{value}</Typography>
    </Box>
  </Box>
);

interface MetricBarProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: 'success' | 'info' | 'warning' | 'error';
}

const MetricBar: React.FC<MetricBarProps> = ({ icon, label, value, color }) => {
  const colorMap = {
    success: '#4CAF50',
    info: '#2196F3',
    warning: '#FF9800',
    error: '#F44336',
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 0.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ color: colorMap[color], display: 'flex' }}>{icon}</Box>
          <Typography variant="body2">{label}</Typography>
        </Box>
        <Typography variant="body2" fontWeight={600}>
          {value}%
        </Typography>
      </Box>
      <Box
        sx={{
          width: '100%',
          height: 8,
          borderRadius: 4,
          bgcolor: 'grey.200',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            width: `${value}%`,
            height: '100%',
            bgcolor: colorMap[color],
            transition: 'width 0.5s ease',
          }}
        />
      </Box>
    </Box>
  );
};