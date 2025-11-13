import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../utils/constants';
import Login from '../pages/Login';
import HomePage from '../pages/HomePage';
import Dashboard from '../pages/Dashboard';
import MakeReservation from '../pages/MakeReservation';
import MyReservations from '../pages/MyReservations';
import Users from '../pages/Users';
import Profile from '../pages/Profile';
import MenuManagement from '../pages/MenuManagement';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return isAuthenticated ? children : <Navigate to={ROUTES.LOGIN} replace />;
};

// Admin-only route component
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!isAdmin) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
};

// User-only route component (non-admin)
const UserRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (isAdmin) {
    return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
  }

  return children;
};

// Public route component (redirects based on role if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isAuthenticated) {
    return isAdmin ? (
      <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />
    ) : (
      <Navigate to={ROUTES.DASHBOARD} replace />
    );
  }

  return children;
};

// Layout component that wraps protected routes with Navbar and Sidebar
const AppLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box 
        sx={{ 
          display: 'flex', 
          flex: 1, 
          mt: '64px',
          alignItems: 'flex-start', // Align items at the top
        }}
      >
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: 'background.default',
            minHeight: 'calc(100vh - 64px)',
            width: 'calc(100% - 240px)',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path={ROUTES.DASHBOARD}
        element={
          <UserRoute>
            <AppLayout>
              <HomePage />
            </AppLayout>
          </UserRoute>
        }
      />
      <Route
        path={ROUTES.ADMIN_DASHBOARD}
        element={
          <AdminRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </AdminRoute>
        }
      />
      <Route
        path={ROUTES.ADMIN_MENU_MANAGEMENT}
        element={
          <AdminRoute>
            <AppLayout>
              <MenuManagement />
            </AppLayout>
          </AdminRoute>
        }
      />
      <Route
        path={ROUTES.RESERVATIONS}
        element={
          <UserRoute>
            <AppLayout>
              <MakeReservation />
            </AppLayout>
          </UserRoute>
        }
      />
      <Route
        path={ROUTES.MY_RESERVATIONS}
        element={
          <UserRoute>
            <AppLayout>
              <MyReservations />
            </AppLayout>
          </UserRoute>
        }
      />
      <Route
        path={ROUTES.USERS}
        element={
          <UserRoute>
            <AppLayout>
              <Users />
            </AppLayout>
          </UserRoute>
        }
      />
      <Route
        path={ROUTES.ADMIN_USERS}
        element={
          <AdminRoute>
            <AppLayout>
              <Users />
            </AppLayout>
          </AdminRoute>
        }
      />
      <Route
        path={ROUTES.SETTINGS}
        element={
          <ProtectedRoute>
            <AppLayout>
              <Profile />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default AppRouter;

