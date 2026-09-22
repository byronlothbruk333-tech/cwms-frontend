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
import { DriverProfile } from './components/Driver/DriverProfile';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { Login } from './Pages/Login';
import { CitizenProfile } from './components/Citizen/CitizenProfile';
import { Dashboard } from './Pages/Dashboard';
import { Home } from './Pages/Home';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AdminNavbar } from './components/common/AdminNavbar';
import { CitizenNavbar } from './components/common/CitizenNavBar';
import { DriverNavbar } from './components/common/DriverNavBar';
import { RouteView } from './components/Admin/ViewRoute';
import { ReportTracking } from './components/Citizen/ReportTracking';
import { ScheduleLookup } from './components/Citizen/scheduleLookup';
import { TruckRegistry } from './components/Admin/TruckRegistry';
import { LiveMap } from './components/Admin/LiveMap';
import { ComplaintDetail } from './components/Admin/ComplaintDetail';

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

  if (path === '/login') {
    return <LoginNavbar />;
  }

  // Admin & Management share the same navbar
  if (user?.role === 'admin' || user?.role === 'management') {
    return <AdminNavbar />;
  }

  if (user?.role === 'driver') {
    return <DriverNavbar />;
  }

  if (user?.role === 'citizen') {
    return <CitizenNavbar />;
  }

  return null;
};

const AppContent: React.FC = () => {
  return (
    <>
      <ConditionalNavbar />

      <Routes>
        {/* ==================== PUBLIC ROUTES ==================== */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* ==================== CITIZEN ROUTES ==================== */}
        {/* ✅ Specific routes FIRST, then catch-all */}
        <Route
          path="/citizen/profile"
          element={
            <ProtectedRoute allowedRoles={['citizen']}>
              <CitizenProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen/reports"
          element={
            <ProtectedRoute allowedRoles={['citizen']}>
              <ReportTracking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen/ScheduleLookup"
          element={
            <ProtectedRoute allowedRoles={['citizen']}>
              <ScheduleLookup />
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen/*"
          element={
            <ProtectedRoute allowedRoles={['citizen']}>
              <CitizenPortal />
            </ProtectedRoute>
          }
        />

       {/* ==================== DRIVER ROUTES ==================== */}
<Route
  path="/driver/profile"
  element={
    <ProtectedRoute allowedRoles={['driver']}>
      <DriverProfile />
    </ProtectedRoute>
  }
/>
<Route
  path="/driver/*"
  element={
    <ProtectedRoute allowedRoles={['driver']}>
      <DriverPortal />
    </ProtectedRoute>
  }
/>

        {/* ==================== ADMIN ROUTES ==================== */}
        {/* ✅ Specific routes FIRST, then catch-all */}
        <Route
          path="/admin/trucks"
          element={
            <ProtectedRoute allowedRoles={['admin', 'management']}>
              <TruckRegistry />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/map"
          element={
            <ProtectedRoute allowedRoles={['admin', 'management']}>
              <LiveMap />
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
        <Route
          path="/admin/complaint/:id"
          element={
            <ProtectedRoute allowedRoles={['admin', 'management']}>
              <ComplaintDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin', 'management']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* ==================== FALLBACK ==================== */}
        <Route path="*" element={<Navigate to="/" replace />} />
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