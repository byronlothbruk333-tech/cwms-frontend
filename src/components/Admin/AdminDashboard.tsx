import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  Speed,
  CheckCircle,
  DirectionsCar,
  Refresh,
  Download,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Timer,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  kpiService,
  type KPIs,
  type FleetTruck,
  type RoutePerformance,
} from '../../Services/kpiService';
import { reportService, type Report } from '../../Services/reportService';

// ============================================
// COMPONENT
// ============================================
export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [trucks, setTrucks] = useState<FleetTruck[]>([]);
  const [routeData, setRouteData] = useState<RoutePerformance[]>([]);
  const [routeStats, setRouteStats] = useState({
    totalRoutes: 0,
    completedRoutes: 0,
    avgEfficiency: 0,
    avgDuration: 0,
  });
  const [complaints, setComplaints] = useState<Report[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exportLoading, setExportLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // ============================================
  // FETCH DASHBOARD DATA
  // ============================================
  const fetchData = async () => {
    setLoading(true);
    setError('');

    try {
      const [kpisData, fleetData, routeData, complaintsData] = await Promise.all([
        kpiService.getKPIs(),
        kpiService.getFleetStatus(),
        kpiService.getRoutePerformance(),
        reportService.getAllReports({ limit: 10 }),
      ]);

      setKpis(kpisData.kpis);
      setTrucks(fleetData.fleet);
      setRouteData(routeData.routes);
      setRouteStats(routeData.stats);
      setComplaints(complaintsData.reports);
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string; error?: string } };
      };
      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          'Failed to load dashboard data. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError('');

        const [kpisData, fleetData, routeData, complaintsData] = await Promise.all([
          kpiService.getKPIs(),
          kpiService.getFleetStatus(),
          kpiService.getRoutePerformance(),
          reportService.getAllReports({ limit: 10 }),
        ]);

        if (isMounted) {
          setKpis(kpisData.kpis);
          setTrucks(fleetData.fleet);
          setRouteData(routeData.routes);
          setRouteStats(routeData.stats);
          setComplaints(complaintsData.reports);
        }
      } catch (err: unknown) {
        const error = err as {
          response?: { data?: { message?: string; error?: string } };
        };
        if (isMounted) {
          setError(
            error.response?.data?.message ||
              error.response?.data?.error ||
              'Failed to load dashboard data. Please try again.'
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
  // HELPERS
  // ============================================
  const getStatusColor = (
    status: string
  ): 'success' | 'warning' | 'error' | 'info' | 'default' => {
    switch (status) {
      case 'active':
      case 'available':
      case 'completed':
      case 'resolved':
        return 'success';
      case 'delayed':
      case 'pending':
        return 'warning';
      case 'inactive':
      case 'offline':
      case 'rejected':
        return 'error';
      case 'in-progress':
      case 'on-route':
      case 'maintenance':
        return 'info';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (
    priority: string
  ): 'error' | 'warning' | 'info' | 'success' | 'default' => {
    switch (priority) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleExportReport = () => {
    setExportLoading(true);
    setTimeout(() => {
      const data = {
        kpis,
        trucks,
        complaints,
        routePerformance: routeData,
        exportedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cleantrack-dashboard-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
      setExportLoading(false);
    }, 500);
  };

  // ============================================
  // KPI CONFIG
  // ============================================
  const kpiConfigs = kpis
    ? [
        {
          id: 'completionRate',
          title: 'Collection Rate',
          value: kpis.completionRate,
          suffix: '%',
          icon: CheckCircle,
          color: 'success.main',
          progressColor: 'success' as const,
        },
        {
          id: 'fuelEfficiency',
          title: 'Fuel Efficiency',
          value: kpis.fuelEfficiency,
          suffix: '%',
          icon: TrendingUp,
          color: 'primary.main',
          progressColor: 'primary' as const,
        },
        {
          id: 'punctuality',
          title: 'Punctuality',
          value: kpis.punctuality,
          suffix: '%',
          icon: Speed,
          color: 'warning.main',
          progressColor: 'warning' as const,
        },
        {
          id: 'totalCollections',
          title: 'Total Collections',
          value: kpis.totalCollections,
          suffix: '',
          icon: DirectionsCar,
          color: 'info.main',
          progressColor: undefined,
        },
      ]
    : [];

  // ============================================
  // LOADING
  // ============================================
  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // ============================================
  // ERROR
  // ============================================
  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchData}>
          Retry
        </Button>
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
        }}
      >
        <Typography variant="h4">Dashboard Overview</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={
              exportLoading ? <CircularProgress size={20} /> : <Download />
            }
            onClick={handleExportReport}
            disabled={exportLoading}
          >
            {exportLoading ? 'Exporting...' : 'Export Report'}
          </Button>
          <IconButton onClick={fetchData} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : <Refresh />}
          </IconButton>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {kpiConfigs.map((config) => {
          const Icon = config.icon;

          return (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={config.id}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {config.title}
                      </Typography>
                      <Typography variant="h4">
                        {config.value}
                        {config.suffix}
                      </Typography>
                    </Box>
                    <Icon sx={{ fontSize: 40, color: config.color }} />
                  </Box>

                  {config.progressColor && (
                    <LinearProgress
                      variant="determinate"
                      value={typeof config.value === 'number' ? config.value : 0}
                      sx={{ mt: 1, height: 6, borderRadius: 3 }}
                      color={config.progressColor}
                    />
                  )}

                  {config.id === 'totalCollections' && kpis && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {kpis.resolvedReports} resolved / {kpis.totalReports} total
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Fleet Status" />
          <Tab label="Route Performance" />
          <Tab label={`Complaints (${complaints.length})`} />
        </Tabs>
      </Paper>

      {/* Tab 0: Fleet Status */}
      {tabValue === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Fleet Status ({trucks.length} trucks)
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Truck ID</TableCell>
                    <TableCell>Driver</TableCell>
                    <TableCell>Zone</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Completion</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {trucks.map((truck) => (
                    <TableRow key={truck.id}>
                      <TableCell>{truck.truckId}</TableCell>
                      <TableCell>{truck.driverName}</TableCell>
                      <TableCell>{truck.zone}</TableCell>
                      <TableCell>
                        <Chip
                          label={truck.status.toUpperCase().replace('-', ' ')}
                          color={getStatusColor(truck.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <LinearProgress
                            variant="determinate"
                            value={truck.completion}
                            sx={{ flex: 1, height: 6, borderRadius: 3 }}
                            color={
                              truck.completion >= 80
                                ? 'success'
                                : truck.completion >= 50
                                ? 'warning'
                                : 'error'
                            }
                          />
                          <Typography variant="caption">
                            {truck.completion}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() =>
                            navigate(`/admin/route/${truck.truckId}`)
                          }
                        >
                          View Route
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Tab 1: Route Performance */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {routeStats.totalRoutes}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total Routes
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      {routeStats.completedRoutes}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Completed
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main">
                      {routeStats.avgEfficiency}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Avg Efficiency
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="info.main">
                      {routeStats.avgDuration.toFixed(1)}h
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Avg Duration
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Route Performance Details
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Route</TableCell>
                        <TableCell>Driver</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Stops</TableCell>
                        <TableCell>Completed</TableCell>
                        <TableCell>Efficiency</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {routeData.map((route) => (
                        <TableRow key={route.id}>
                          <TableCell>{route.route}</TableCell>
                          <TableCell>{route.driver}</TableCell>
                          <TableCell>{route.duration}</TableCell>
                          <TableCell>{route.stops}</TableCell>
                          <TableCell>{route.completed}</TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              <LinearProgress
                                variant="determinate"
                                value={route.efficiency}
                                sx={{ flex: 1, height: 6, borderRadius: 3 }}
                                color={
                                  route.efficiency >= 80
                                    ? 'success'
                                    : route.efficiency >= 50
                                    ? 'warning'
                                    : 'error'
                                }
                              />
                              <Typography variant="caption">
                                {route.efficiency}%
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={route.status.toUpperCase().replace('-', ' ')}
                              color={getStatusColor(route.status)}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tab 2: Complaints */}
      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 4 }}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main">
                      {kpis?.pendingReports || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Pending
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 4 }}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="info.main">
                      {kpis?.inProgressReports || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      In Progress
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 4 }}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      {kpis?.resolvedReports || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Resolved
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Complaints
                </Typography>
                <List>
                  {complaints.map((complaint, index) => (
                    <React.Fragment key={complaint.id}>
                      <ListItem
                        sx={{
                          py: 2,
                          '&:hover': { bgcolor: 'action.hover' },
                          cursor: 'pointer',
                        }}
                        onClick={() =>
                          navigate(`/admin/complaint/${complaint.id}`)
                        }
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor:
                                getStatusColor(complaint.status) + '.main',
                            }}
                          >
                            {complaint.status === 'pending' && <PendingIcon />}
                            {complaint.status === 'in-progress' && <Timer />}
                            {complaint.status === 'resolved' && (
                              <CheckCircleIcon />
                            )}
                            {complaint.status === 'rejected' && <CancelIcon />}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                flexWrap: 'wrap',
                              }}
                            >
                              <Typography variant="subtitle1">
                                {complaint.issueType
                                  .split('-')
                                  .map(
                                    (word) =>
                                      word.charAt(0).toUpperCase() +
                                      word.slice(1)
                                  )
                                  .join(' ')}
                              </Typography>
                              <Chip
                                label={complaint.status
                                  .toUpperCase()
                                  .replace('-', ' ')}
                                color={getStatusColor(complaint.status)}
                                size="small"
                              />
                              <Chip
                                label={complaint.priority.toUpperCase()}
                                color={getPriorityColor(complaint.priority)}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                <strong>
                                  {complaint.citizen?.name || 'Unknown'}
                                </strong>{' '}
                                • {complaint.address}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {complaint.description}
                              </Typography>
                            </Box>
                          }
                        />
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/complaint/${complaint.id}`);
                          }}
                        >
                          View
                        </Button>
                      </ListItem>
                      {index < complaints.length - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </React.Fragment>
                  ))}
                  {complaints.length === 0 && (
                    <ListItem>
                      <ListItemText
                        primary="No complaints"
                        secondary="No reports have been submitted yet"
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default AdminDashboard;