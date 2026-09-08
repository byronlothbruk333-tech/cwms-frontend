import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './Styles/Theme';
import { AuthProvider, useAuth } from './Context/AuthContext';
import { HomeNavbar } from './components/common/HomeNavbar';
import { LoginNavbar } from './components/common/LoginNavbar';
import { CitizenPortal } from './components/Citizen/CitizenPortal';
import { DriverPortal } from './components/Driver/DriverPortal';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { Login } from './Pages/Login';
import { Profile } from './Pages/Profile';
import { Dashboard } from './Pages/Dashboard';
import { Home } from './Pages/Home';
import { GoogleOAuthProvider } from '@react-oauth/google'; 
import { AdminNavbar } from './components/common/AdminNavbar';
import { CitizenNavbar } from './components/common/CitizenNavBar';
import { DriverNavbar } from './components/common/DriverNavBar';
import { RouteView } from './components/Admin/ViewRoute';
import { ReportTracking } from './components/Citizen/ReportTracking';
import { ScheduleLookup } from './components/Citizen/scheduleLookup';
// FIX: Remove .tsx extension from imports


// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({
  children,
  allowedRoles = [],
}) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role || '')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Component to conditionally render the correct Navbar
const ConditionalNavbar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const path = location.pathname;

  // Home page
  if (path === '/') {
    return <HomeNavbar />;
  }

  if(path === '/login'){
    return <LoginNavbar />;
  }

  // Role-based navbars
  if (user?.role === 'admin') {
    return <AdminNavbar />;
  }

  if (user?.role === 'driver') {
    return <DriverNavbar />;
  }

   if (user?.role === 'citizen') {
    return <CitizenNavbar/>;
  }
  
  return null;
};

const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <>
      <ConditionalNavbar />
      
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        
        {/* Profile & Dashboard routes */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Citizen Routes */}
        <Route
          path="/citizen/*"
          element={
            <ProtectedRoute allowedRoles={['citizen']}>
              <CitizenPortal />
            </ProtectedRoute>
          }
        />
{/* Citizen Report Tracking Dashboard Route */}
<Route
  path="/citizen/reports"
  element={
    <ProtectedRoute allowedRoles={['citizen']}>
      <ReportTracking />
    </ProtectedRoute>
  }
/>
{/* Citizen Schedule Collection Dashboard Route */}
<Route
  path="/citizen/ScheduleLookup"
  element={
    <ProtectedRoute allowedRoles={['citizen']}>
      <ScheduleLookup />
    </ProtectedRoute>
  }
/>
        {/* Driver Routes */}
        <Route
          path="/driver/*"
          element={
            <ProtectedRoute allowedRoles={['driver']}>
              <DriverPortal />
            </ProtectedRoute>
          }
        />
       
        <Route
          path="/admin/route/:truckId"
          element={
            <ProtectedRoute allowedRoles={['admin', 'management']}>
              <RouteView />
            </ProtectedRoute>
          }
        />
        
        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin', 'management']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

function App() {
  return (
    <GoogleOAuthProvider clientId="570830096474-thi4gc6odm7pmjubi98rsn1ecs0gl5rs.apps.googleusercontent.com">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;