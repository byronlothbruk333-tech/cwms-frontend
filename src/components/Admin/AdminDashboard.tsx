import React, { useState } from 'react';
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
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  Speed,
  CheckCircle,
  DirectionsCar,
  Refresh,
  Download,
  Warning,
  People,
  Route as RouteIcon,
  AccessTime,
  Schedule,
  AssignmentLate,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Timer,
  BarChart,
  Star,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { KPI } from '../../Services/types';

// Mock KPI data
const mockKPIs: KPI = {
  completionRate: 87,
  fuelEfficiency: 92,
  punctuality: 78,
  totalCollections: 1247,
  citizenSatisfaction: 84,
};

// Mock truck data
const mockTrucks = [
  { id: 'T-001', driver: 'John Doe', zone: 'Zone A', status: 'active', completion: 100 },
  { id: 'T-002', driver: 'Jane Smith', zone: 'Zone B', status: 'active', completion: 75 },
  { id: 'T-003', driver: 'Bob Johnson', zone: 'Zone A', status: 'delayed', completion: 40 },
  { id: 'T-004', driver: 'Alice Brown', zone: 'Zone C', status: 'inactive', completion: 0 },
  { id: 'T-005', driver: 'Charlie Davis', zone: 'Zone B', status: 'active', completion: 95 },
];

// Mock Route Performance Data
const routePerformanceData = [
  { id: 1, route: 'Zone A - Morning', driver: 'John Doe', duration: '3.5 hrs', stops: 12, completed: 12, efficiency: 95, status: 'completed' },
  { id: 2, route: 'Zone B - Morning', driver: 'Jane Smith', duration: '4.2 hrs', stops: 10, completed: 8, efficiency: 80, status: 'completed' },
  { id: 3, route: 'Zone A - Afternoon', driver: 'Bob Johnson', duration: '2.8 hrs', stops: 8, completed: 5, efficiency: 62, status: 'in-progress' },
  { id: 4, route: 'Zone C - Morning', driver: 'Alice Brown', duration: '0 hrs', stops: 6, completed: 0, efficiency: 0, status: 'pending' },
  { id: 5, route: 'Zone B - Afternoon', driver: 'Charlie Davis', duration: '3.0 hrs', stops: 9, completed: 8, efficiency: 89, status: 'completed' },
];

// Mock Complaints Data
const mockComplaints = [
  { 
    id: 'C-001', 
    citizen: 'John Citizen', 
    type: 'Missed Collection', 
    status: 'pending', 
    date: '2024-01-15',
    address: '123 Main St',
    description: 'Waste was not collected on scheduled day',
    priority: 'high',
  },
  { 
    id: 'C-002', 
    citizen: 'Mary Resident', 
    type: 'Illegal Dumping', 
    status: 'in-progress', 
    date: '2024-01-14',
    address: '45 Park Ave',
    description: 'Someone dumped construction waste on the street',
    priority: 'critical',
  },
  { 
    id: 'C-003', 
    citizen: 'Peter Smith', 
    type: 'Overflowing Bin', 
    status: 'resolved', 
    date: '2024-01-13',
    address: '78 Beach Rd',
    description: 'Bin has been overflowing for 3 days',
    priority: 'medium',
  },
  { 
    id: 'C-004', 
    citizen: 'Sarah Johnson', 
    type: 'Missed Collection', 
    status: 'pending', 
    date: '2024-01-15',
    address: '22 Hill St',
    description: 'Recycling bin was not emptied',
    priority: 'medium',
  },
];

// KPI configuration
const kpiConfigs = [
  {
    id: 'completionRate',
    title: 'Collection Rate',
    valueKey: 'completionRate' as keyof KPI,
    suffix: '%',
    icon: CheckCircle,
    color: 'success.main',
    progressColor: 'success' as const,
    trend: '+5%',
    trendDirection: 'up' as const,
  },
  {
    id: 'fuelEfficiency',
    title: 'Fuel Efficiency',
    valueKey: 'fuelEfficiency' as keyof KPI,
    suffix: '%',
    icon: TrendingUp,
    color: 'primary.main',
    progressColor: 'primary' as const,
    trend: '+2%',
    trendDirection: 'up' as const,
  },
  {
    id: 'punctuality',
    title: 'Punctuality',
    valueKey: 'punctuality' as keyof KPI,
    suffix: '%',
    icon: Speed,
    color: 'warning.main',
    progressColor: 'warning' as const,
    trend: '-3%',
    trendDirection: 'down' as const,
  },
  {
    id: 'totalCollections',
    title: 'Total Collections',
    valueKey: 'totalCollections' as keyof KPI,
    suffix: '',
    icon: DirectionsCar,
    color: 'info.main',
    progressColor: undefined,
    showExtraInfo: true,
  },
];

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [kpis] = useState<KPI>(mockKPIs);
  const [trucks] = useState(mockTrucks);
  const [complaints] = useState(mockComplaints);
  const [routeData] = useState(routePerformanceData);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const handleExportReport = () => {
    setExportLoading(true);
    setTimeout(() => {
      const data = {
        kpis: kpis,
        trucks: trucks,
        complaints: complaints,
        routePerformance: routeData,
        exportedAt: new Date().toISOString(),
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dashboard-report-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
      setExportLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'success';
      case 'delayed': return 'warning';
      case 'inactive': return 'error';
      case 'completed': return 'success';
      case 'in-progress': return 'info';
      case 'pending': return 'warning';
      case 'resolved': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getComplaintStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'warning';
      case 'in-progress': return 'info';
      case 'resolved': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Calculate route performance stats
  const totalRoutes = routeData.length;
  const completedRoutes = routeData.filter(r => r.status === 'completed').length;
  const avgEfficiency = Math.round(routeData.reduce((sum, r) => sum + r.efficiency, 0) / totalRoutes);
  const avgDuration = routeData
    .filter(r => r.status === 'completed')
    .reduce((sum, r) => sum + parseFloat(r.duration), 0) / completedRoutes || 0;

  // Calculate complaint stats
  const pendingComplaints = complaints.filter(c => c.status === 'pending').length;
  const inProgressComplaints = complaints.filter(c => c.status === 'in-progress').length;
  const resolvedComplaints = complaints.filter(c => c.status === 'resolved').length;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Dashboard Overview</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={exportLoading ? <CircularProgress size={20} /> : <Download />}
            onClick={handleExportReport}
            disabled={exportLoading}
          >
            {exportLoading ? 'Exporting...' : 'Export Report'}
          </Button>
          <IconButton onClick={handleRefresh} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : <Refresh />}
          </IconButton>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {kpiConfigs.map((config) => {
          const Icon = config.icon;
          const value = kpis[config.valueKey];
          
          return (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={config.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {config.title}
                      </Typography>
                      <Typography variant="h4">
                        {value}{config.suffix}
                      </Typography>
                    </Box>
                    <Icon sx={{ fontSize: 40, color: config.color }} />
                  </Box>
                  
                  {config.progressColor && (
                    <LinearProgress 
                      variant="determinate" 
                      value={typeof value === 'number' ? value : 0} 
                      sx={{ mt: 1, height: 6, borderRadius: 3 }}
                      color={config.progressColor}
                    />
                  )}
                  
                  {config.showExtraInfo && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      +12% from last month
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
          <Tab label={`Complaints (${pendingComplaints})`} />
        </Tabs>
      </Paper>

      {/* Tab 0: Fleet Status */}
      {tabValue === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Fleet Status
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
                      <TableCell>{truck.id}</TableCell>
                      <TableCell>{truck.driver}</TableCell>
                      <TableCell>{truck.zone}</TableCell>
                      <TableCell>
                        <Chip 
                          label={truck.status.toUpperCase()} 
                          color={getStatusColor(truck.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={truck.completion}
                            sx={{ flex: 1, height: 6, borderRadius: 3 }}
                            color={truck.completion >= 80 ? 'success' : truck.completion >= 50 ? 'warning' : 'error'}
                          />
                          <Typography variant="caption">{truck.completion}%</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="small" 
                          variant="outlined"
                          onClick={() => navigate(`/admin/route/${truck.id}`)}
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
          {/* Route Performance Stats */}
          <Grid size={{ xs: 12 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">{totalRoutes}</Typography>
                    <Typography variant="caption" color="text.secondary">Total Routes</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">{completedRoutes}</Typography>
                    <Typography variant="caption" color="text.secondary">Completed</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main">{avgEfficiency}%</Typography>
                    <Typography variant="caption" color="text.secondary">Avg Efficiency</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="info.main">{avgDuration.toFixed(1)}h</Typography>
                    <Typography variant="caption" color="text.secondary">Avg Duration</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          {/* Route Performance Table */}
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
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={route.efficiency}
                                sx={{ flex: 1, height: 6, borderRadius: 3 }}
                                color={route.efficiency >= 80 ? 'success' : route.efficiency >= 50 ? 'warning' : 'error'}
                              />
                              <Typography variant="caption">{route.efficiency}%</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={route.status.toUpperCase()} 
                              color={getStatusColor(route.status) as any}
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
          {/* Complaint Stats */}
          <Grid size={{ xs: 12 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 4 }}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main">{pendingComplaints}</Typography>
                    <Typography variant="caption" color="text.secondary">Pending</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 4 }}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="info.main">{inProgressComplaints}</Typography>
                    <Typography variant="caption" color="text.secondary">In Progress</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 4 }}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">{resolvedComplaints}</Typography>
                    <Typography variant="caption" color="text.secondary">Resolved</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          {/* Complaints List */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  All Complaints
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
                        onClick={() => navigate(`/admin/complaint/${complaint.id}`)}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: getComplaintStatusColor(complaint.status) + '.main' }}>
                            {complaint.status === 'pending' && <PendingIcon />}
                            {complaint.status === 'in-progress' && <Timer />}
                            {complaint.status === 'resolved' && <CheckCircleIcon />}
                            {complaint.status === 'rejected' && <CancelIcon />}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                              <Typography variant="subtitle1">
                                {complaint.type}
                              </Typography>
                              <Chip 
                                label={complaint.status.toUpperCase()} 
                                color={getComplaintStatusColor(complaint.status) as any}
                                size="small"
                              />
                              <Chip 
                                label={complaint.priority.toUpperCase()} 
                                color={getPriorityColor(complaint.priority) as any}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                <strong>{complaint.citizen}</strong> • {complaint.address}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {complaint.description} • {complaint.date}
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
                      {index < complaints.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};