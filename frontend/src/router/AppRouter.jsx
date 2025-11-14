import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../utils/constants';
import { Login, Onboarding } from '../pages/auth';
import { HomePage, MakeReservation, MyReservations, Profile } from '../pages/user';
import { Dashboard, AdminReservations, MenuManagement, Users, Settings } from '../pages/admin';
import { Navbar, Sidebar } from '../components/layout';

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

const AppLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
        <Box 
        sx={{ 
          display: 'flex', 
          flex: 1, 
          mt: '64px',
          alignItems: 'flex-start',
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
        path={ROUTES.ONBOARDING}
        element={<Onboarding />}
      />
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
        path={ROUTES.ADMIN_RESERVATIONS}
        element={
          <AdminRoute>
            <AppLayout>
              <AdminReservations />
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
      <Route
        path={ROUTES.ADMIN_SETTINGS}
        element={
          <AdminRoute>
            <AppLayout>
              <Settings />
            </AppLayout>
          </AdminRoute>
        }
      />
      <Route path="*" element={<Navigate to={ROUTES.ONBOARDING} replace />} />
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

