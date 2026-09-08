import React, { useState, useRef } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Alert,
  Snackbar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Avatar,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  LocationOn,
  Send,
  Close,
  Warning,
  CheckCircle,
  PhotoCamera,
  Delete,
  Image as ImageIcon,
  Home as HomeIcon,
  Schedule, // ← ADD THIS IMPORT
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface ReportData {
  location: string;
  issueType: string;
  description: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  photos: File[];
  photoUrls: string[];
}

export const CitizenPortal: React.FC = () => {
  const navigate = useNavigate();
  const [reportData, setReportData] = useState<ReportData>({
    location: '',
    issueType: '',
    description: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    photos: [],
    photoUrls: [],
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const issueTypes = [
    { value: 'missed-collection', label: 'Missed Collection' },
    { value: 'illegal-dumping', label: 'Illegal Dumping' },
    { value: 'overflowing-bin', label: 'Overflowing Bin' },
    { value: 'other', label: 'Other Issue' },
  ];

  const handleInputChange = (field: keyof ReportData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setReportData({
      ...reportData,
      [field]: event.target.value,
    });
  };

  const handleSelectChange = (field: keyof ReportData) => (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setReportData({
      ...reportData,
      [field]: event.target.value as string,
    });
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const currentPhotoCount = reportData.photos.length;
    const remainingSlots = 3 - currentPhotoCount;
    
    if (currentPhotoCount >= 3) {
      setSnackbarMessage('Maximum 3 photos allowed. Please remove some photos first.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    const newFiles = Array.from(files).slice(0, remainingSlots);
    const newPhotoUrls = newFiles.map(file => URL.createObjectURL(file));

    setReportData({
      ...reportData,
      photos: [...reportData.photos, ...newFiles],
      photoUrls: [...reportData.photoUrls, ...newPhotoUrls],
    });

    if (files.length > remainingSlots) {
      setSnackbarMessage(`Only ${remainingSlots} photo(s) remaining. Max 3 photos allowed.`);
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = (index: number) => {
    URL.revokeObjectURL(reportData.photoUrls[index]);
    
    const newPhotos = [...reportData.photos];
    const newPhotoUrls = [...reportData.photoUrls];
    newPhotos.splice(index, 1);
    newPhotoUrls.splice(index, 1);

    setReportData({
      ...reportData,
      photos: newPhotos,
      photoUrls: newPhotoUrls,
    });
  };

  const handleSubmit = async () => {
    if (!reportData.location.trim()) {
      setSnackbarMessage('Please enter a location');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    if (!reportData.issueType) {
      setSnackbarMessage('Please select an issue type');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    if (!reportData.description.trim()) {
      setSnackbarMessage('Please provide a description');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('location', reportData.location);
      formData.append('issueType', reportData.issueType);
      formData.append('description', reportData.description);
      formData.append('contactName', reportData.contactName);
      formData.append('contactPhone', reportData.contactPhone);
      formData.append('contactEmail', reportData.contactEmail);
      
      reportData.photos.forEach((photo, index) => {
        formData.append(`photo_${index}`, photo);
      });

      console.log('Report submitted with photos:', {
        ...reportData,
        photos: reportData.photos.map(f => f.name),
      });
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSnackbarMessage(`Report submitted successfully with ${reportData.photos.length} photo(s)!`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      setReportData({
        location: '',
        issueType: '',
        description: '',
        contactName: '',
        contactPhone: '',
        contactEmail: '',
        photos: [],
        photoUrls: [],
      });

      setTimeout(() => {
        navigate('/citizen/reports');
      }, 2000);
      
    } catch (error) {
      setSnackbarMessage('Failed to submit report. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setSnackbarMessage('Geolocation is not supported by your browser');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setReportData({
          ...reportData,
          location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        });
        setSnackbarMessage('Location detected successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      },
      (error) => {
        setSnackbarMessage(`Error getting location: ${error.message}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    );
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
</Breadcrumbs>

      <Grid container spacing={3}>
        {/* Header */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Warning sx={{ fontSize: 30 }} />
              <Box>
                <Typography variant="h5" component="h1">
                  Report a Waste Management Issue
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }} component="p">
                  Help us keep your community clean by reporting any waste-related issues
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Main Form */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom component="h2">
                Report Details
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                {/* Location */}
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <TextField
                      fullWidth
                      label="Location *"
                      placeholder="Enter address or coordinates"
                      value={reportData.location}
                      onChange={handleInputChange('location')}
                      required
                      helperText="Enter a street address or coordinates"
                      InputProps={{
                        startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleUseCurrentLocation}
                      sx={{ minWidth: '120px', mt: 1 }}
                      startIcon={<LocationOn />}
                    >
                      My Location
                    </Button>
                  </Box>
                </Grid>

                {/* Issue Type */}
                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth required>
                    <InputLabel>Issue Type *</InputLabel>
                    <Select
                      value={reportData.issueType}
                      onChange={handleSelectChange('issueType')}
                      label="Issue Type *"
                    >
                      {issueTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Description */}
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Description *"
                    placeholder="Please describe the issue in detail..."
                    value={reportData.description}
                    onChange={handleInputChange('description')}
                    required
                    multiline
                    rows={4}
                  />
                </Grid>

                {/* Photo Upload Section */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" gutterBottom component="p">
                    Attach Photos (Optional)
                  </Typography>
                  <Typography variant="caption" color="text.secondary" component="p" sx={{ mb: 2 }}>
                    Upload up to 3 photos to help us better understand the issue
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<PhotoCamera />}
                        disabled={reportData.photos.length >= 3}
                      >
                        Add Photos ({reportData.photos.length}/3)
                      </Button>
                    </label>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                      Max 3 photos (JPG, PNG, GIF)
                    </Typography>
                    {reportData.photos.length >= 3 && (
                      <Alert severity="info" sx={{ mt: 1 }} size="small">
                        Maximum 3 photos reached. Remove some to add more.
                      </Alert>
                    )}
                  </Box>

                  {/* Photo Preview Grid */}
                  {reportData.photoUrls.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                      {reportData.photoUrls.map((url, index) => (
                        <Box
                          key={index}
                          sx={{
                            position: 'relative',
                            width: 120,
                            height: 120,
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            overflow: 'hidden',
                          }}
                        >
                          <img
                            src={url}
                            alt={`Photo ${index + 1}`}
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
                              top: 4,
                              right: 4,
                              bgcolor: 'rgba(0,0,0,0.6)',
                              color: 'white',
                              '&:hover': {
                                bgcolor: 'rgba(0,0,0,0.8)',
                              },
                            }}
                            onClick={() => handleRemovePhoto(index)}
                          >
                            <Delete sx={{ fontSize: 16 }} />
                          </IconButton>
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              bgcolor: 'rgba(0,0,0,0.5)',
                              color: 'white',
                              px: 1,
                              py: 0.5,
                              fontSize: '0.75rem',
                              textAlign: 'center',
                            }}
                          >
                            Photo {index + 1}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Grid>

                {/* Contact Information */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" gutterBottom component="p">
                    Contact Information (Optional)
                  </Typography>
                  <Typography variant="caption" color="text.secondary" component="p" sx={{ mb: 2 }}>
                    We may contact you for follow-up or clarification
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    label="Name"
                    placeholder="Your full name"
                    value={reportData.contactName}
                    onChange={handleInputChange('contactName')}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    label="Phone"
                    placeholder="Phone number"
                    value={reportData.contactPhone}
                    onChange={handleInputChange('contactPhone')}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    placeholder="Email address"
                    value={reportData.contactEmail}
                    onChange={handleInputChange('contactEmail')}
                  />
                </Grid>
              </Grid>

              {/* Submit Button */}
              <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <span>Submitting...</span> : <Send />}
                  sx={{ minWidth: 200 }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => {
                    reportData.photoUrls.forEach(url => URL.revokeObjectURL(url));
                    setReportData({
                      location: '',
                      issueType: '',
                      description: '',
                      contactName: '',
                      contactPhone: '',
                      contactEmail: '',
                      photos: [],
                      photoUrls: [],
                    });
                  }}
                >
                  Clear Form
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Info Panel */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom component="h2">
                How It Works
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" component="p">
                  <strong>1. Describe the Issue</strong>
                </Typography>
                <Typography variant="caption" color="text.secondary" component="p">
                  Provide location, issue type, and description
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" component="p">
                  <strong>2. Submit Report</strong>
                </Typography>
                <Typography variant="caption" color="text.secondary" component="p">
                  Click submit and we'll route it to the right team
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" component="p">
                  <strong>3. Follow Up</strong>
                </Typography>
                <Typography variant="caption" color="text.secondary" component="p">
                  Track your report status and get updates
                </Typography>
              </Box>

              {/* View Your Reports Button */}
              <Button
                variant="outlined"
                fullWidth
                startIcon={<CheckCircle />}
                onClick={() => navigate('/citizen/reports')}
                sx={{ mt: 2 }}
              >
                View Your Reports
              </Button>

              {/* View Collection Schedule Button - NEW */}
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Schedule />}
                onClick={() => navigate('/citizen/ScheduleLookup')}
                sx={{ mt: 1 }}
              >
                View Collection Schedule
              </Button>

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="caption" component="div">
                  <strong>Pro Tip:</strong> For urgent issues like illegal dumping or overflowing bins, 
                  please also call our hotline at <strong>1900-WASTE</strong>
                </Typography>
              </Alert>

              <Alert severity="success" sx={{ mt: 2 }}>
                <Typography variant="caption" component="div">
                  <CheckCircle sx={{ fontSize: 16, verticalAlign: 'middle', mr: 1 }} />
                  All reports are reviewed within 24 hours
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
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

export default CitizenPortal;