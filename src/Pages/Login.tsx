import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  CircularProgress,
  Divider,
} from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

// ============================================
// TYPES
// ============================================
interface GoogleCredentialResponse {
  credential?: string;
  clientId?: string;
  select_by?: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
}

export const Login: React.FC = () => {
  const { login, loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If user is already logged in, redirect to dashboard
  React.useEffect(() => {
    if (user) {
      navigate(`/${user.role}`, { replace: true });
    }
  }, [user, navigate]);

  // ============================================
  // EMAIL/PASSWORD LOGIN
  // ============================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // The useEffect above will handle the redirect
    } catch (err) {
      const response = (err as ApiError)?.response?.data;
      setError(
        response?.message ||
          response?.error ||
          'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // GOOGLE LOGIN SUCCESS
  // ✅ Pass the credential STRING to the backend
  // ============================================
  const handleGoogleSuccess = async (
    credentialResponse: GoogleCredentialResponse
  ) => {
    try {
      setError('');

      // Ensure we have a credential string
      if (!credentialResponse?.credential) {
        setError('Google sign-in failed. No credential received.');
        return;
      }

      // ✅ Pass ONLY the credential JWT string to the backend
      await loginWithGoogle(credentialResponse.credential);
      // The useEffect above will handle the redirect
    } catch (err) {
      const response = (err as ApiError)?.response?.data;
      setError(
        response?.message ||
          response?.error ||
          'Google sign-in failed. Please try again.'
      );
    }
  };

  // ============================================
  // GOOGLE LOGIN FAILURE
  // ============================================
  const handleGoogleError = () => {
    setError('Google sign-in failed. Please try again.');
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            🌍 CleanTrack
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to access your dashboard
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Google Sign-In Button */}
        <Box sx={{ mb: 3 }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="outline"
            size="large"
            width="100%"
            text="signin_with"
            shape="rectangular"
            logo_alignment="center"
          />
        </Box>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>

        {/* Email/Password Login Form */}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            autoFocus
            autoComplete="email"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};