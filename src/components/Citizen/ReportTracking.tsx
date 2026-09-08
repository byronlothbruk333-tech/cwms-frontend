import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  Tooltip,
  Button,
  Breadcrumbs,
  Link,
  Tab,
  Tabs,
  Badge,
} from '@mui/material';
import {
  CheckCircle,
  Pending,
  Warning,
  Cancel,
  Refresh,
  Home as HomeIcon,
  BarChart,
  List as ListIcon,
  Assessment,
  DoneAll,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Report {
  id: number;
  location: string;
  issueType: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
  createdAt: string;
  updatedAt?: string;
}

// Mock data - will be replaced with API calls
const mockReports: Report[] = [
  {
    id: 1,
    location: '123 Main St, Central City',
    issueType: 'Missed Collection',
    description: 'Waste was not collected on scheduled day',
    status: 'pending',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    location: '45 Park Ave, Northside',
    issueType: 'Illegal Dumping',
    description: 'Someone dumped construction waste on the corner',
    status: 'in-progress',
    createdAt: '2024-01-14T14:20:00Z',
  },
  {
    id: 3,
    location: '78 Beach Rd, Southside',
    issueType: 'Overflowing Bin',
    description: 'Public bin is overflowing and needs emptying',
    status: 'resolved',
    createdAt: '2024-01-12T09:15:00Z',
    updatedAt: '2024-01-13T16:45:00Z',
  },
  {
    id: 4,
    location: '22 Hill St, Eastside',
    issueType: 'Damaged Bin',
    description: 'Recycling bin has a broken lid',
    status: 'rejected',
    createdAt: '2024-01-10T11:00:00Z',
    updatedAt: '2024-01-11T08:30:00Z',
  },
  {
    id: 5,
    location: '90 Valley Blvd, Westside',
    issueType: 'Missed Collection',
    description: 'Garbage was not picked up for two weeks',
    status: 'pending',
    createdAt: '2024-01-16T09:00:00Z',
  },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`report-tabpanel-${index}`}
      aria-labelledby={`report-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export const ReportTracking: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setReports(mockReports);
        setLoading(false);
      } catch (err) {
        setError('Failed to load reports');
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending':
        return 'warning' as const;
      case 'in-progress':
        return 'info' as const;
      case 'resolved':
        return 'success' as const;
      case 'rejected':
        return 'error' as const;
      default:
        return 'default' as const;
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending':
        return <Pending />;
      case 'in-progress':
        return <Pending />;
      case 'resolved':
        return <CheckCircle />;
      case 'rejected':
        return <Cancel />;
      default:
        return <Warning />;
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStats = () => {
    const total = reports.length;
    const pending = reports.filter(r => r.status === 'pending').length;
    const inProgress = reports.filter(r => r.status === 'in-progress').length;
    const resolved = reports.filter(r => r.status === 'resolved').length;
    const rejected = reports.filter(r => r.status === 'rejected').length;

    return { total, pending, inProgress, resolved, rejected };
  };

  const getFilteredReports = () => {
    switch(tabValue) {
      case 0:
        return reports;
      case 1:
        return reports.filter(r => r.status === 'pending');
      case 2:
        return reports.filter(r => r.status === 'in-progress');
      case 3:
        return reports.filter(r => r.status === 'resolved');
      case 4:
        return reports.filter(r => r.status === 'rejected');
      default:
        return reports;
    }
  };

  const stats = getStats();
  const filteredReports = getFilteredReports();

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

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
        <Typography color="text.primary">Report Tracking</Typography>
      </Breadcrumbs>

      <Grid container spacing={3}>
        {/* Header */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h5" component="h1">
                  Report Tracking Dashboard
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Track and manage all your submitted reports
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Tooltip title="Refresh">
                  <IconButton 
                    color="inherit" 
                    onClick={() => window.location.reload()}
                  >
                    <Refresh />
                  </IconButton>
                </Tooltip>
                <Button 
                  variant="outlined" 
                  sx={{ color: 'white', borderColor: 'white' }}
                  onClick={() => navigate('/citizen')}
                >
                  Report New Issue
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Statistics Cards */}
        <Grid size={{ xs: 12 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 2.4 }}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {stats.total}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, sm: 2.4 }}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main">
                    {stats.pending}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Pending
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, sm: 2.4 }}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main">
                    {stats.inProgress}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    In Progress
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, sm: 2.4 }}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    {stats.resolved}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Resolved
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, sm: 2.4 }}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="error.main">
                    {stats.rejected}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Rejected
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Tabs and Table */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                  value={tabValue} 
                  onChange={(e, newValue) => setTabValue(newValue)}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab label="All Reports" icon={<ListIcon />} iconPosition="start" />
                  <Tab 
                    label="Pending" 
                    icon={<Badge badgeContent={stats.pending} color="warning"><Pending /></Badge>} 
                    iconPosition="start" 
                  />
                  <Tab 
                    label="In Progress" 
                    icon={<Badge badgeContent={stats.inProgress} color="info"><Pending /></Badge>} 
                    iconPosition="start" 
                  />
                  <Tab 
                    label="Resolved" 
                    icon={<Badge badgeContent={stats.resolved} color="success"><CheckCircle /></Badge>} 
                    iconPosition="start" 
                  />
                  <Tab 
                    label="Rejected" 
                    icon={<Badge badgeContent={stats.rejected} color="error"><Cancel /></Badge>} 
                    iconPosition="start" 
                  />
                </Tabs>
              </Box>

              <TabPanel value={tabValue} index={0}>
                {renderTable(filteredReports, 'No reports found. Submit your first report!')}
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                {renderTable(filteredReports, 'No pending reports.')}
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                {renderTable(filteredReports, 'No reports in progress.')}
              </TabPanel>
              <TabPanel value={tabValue} index={3}>
                {renderTable(filteredReports, 'No resolved reports yet.')}
              </TabPanel>
              <TabPanel value={tabValue} index={4}>
                {renderTable(filteredReports, 'No rejected reports.')}
              </TabPanel>
            </CardContent>
          </Card>
        </Grid>

        {/* Status Legend */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              <strong>Status Legend:</strong>
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Chip icon={<Pending />} label="Pending - Waiting for review" size="small" color="warning" />
              <Chip icon={<Pending />} label="In Progress - Being addressed" size="small" color="info" />
              <Chip icon={<CheckCircle />} label="Resolved - Issue resolved" size="small" color="success" />
              <Chip icon={<Cancel />} label="Rejected - Cannot be resolved" size="small" color="error" />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );

  function renderTable(data: Report[], emptyMessage: string) {
    if (data.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Assessment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {emptyMessage}
          </Typography>
          {tabValue === 0 && (
            <Button 
              variant="contained" 
              onClick={() => navigate('/citizen')}
              sx={{ mt: 2 }}
            >
              Submit a Report
            </Button>
          )}
        </Box>
      );
    }

    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Location</strong></TableCell>
              <TableCell><strong>Issue Type</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Submitted</strong></TableCell>
              <TableCell><strong>Last Updated</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((report) => (
              <TableRow key={report.id} hover>
                <TableCell>#{report.id}</TableCell>
                <TableCell>{report.location}</TableCell>
                <TableCell>{report.issueType}</TableCell>
                <TableCell>
                  <Chip
                    icon={getStatusIcon(report.status)}
                    label={getStatusLabel(report.status)}
                    color={getStatusColor(report.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatDate(report.createdAt)}</TableCell>
                <TableCell>
                  {report.updatedAt ? formatDate(report.updatedAt) : '—'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
};

export default ReportTracking;