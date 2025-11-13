import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { useAuth } from '../context/AuthContext';
import { ROUTES, STORAGE_KEYS } from '../utils/constants';

const Login = () => {
  const theme = useTheme();
  const [role, setRole] = useState('personel');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, setAuthState } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (event, newRole) => {
    if (newRole) setRole(newRole);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Lütfen email ve şifre girin');
      return;
    }

    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success && result.user && result.token) {
        const userData = result.user;
        const userRole = userData?.role;
        const isUserAdmin = userRole === 'Admin' || userRole === 1;
        const selectedIsAdmin = role === 'admin';

        // Check if selected role matches user's actual role BEFORE setting auth state
        if (isUserAdmin && !selectedIsAdmin) {
          // Clear the token that was temporarily set
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          setError('Bu hesap Admin hesabıdır. Admin bölümünden giriş yapmalısınız.');
          setLoading(false);
          return;
        } else if (!isUserAdmin && selectedIsAdmin) {
          // Clear the token that was temporarily set
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          setError('Bu hesap Personel hesabıdır. Personel bölümünden giriş yapmalısınız.');
          setLoading(false);
          return;
        }

        // Roles match - set auth state and navigate
        setAuthState(result.token, userData);

        if (isUserAdmin) {
          navigate(ROUTES.ADMIN_DASHBOARD);
        } else {
          navigate(ROUTES.DASHBOARD);
        }
      } else {
        setError(result.error || 'Giriş başarısız. Email ve şifrenizi kontrol edin.');
      }
    } catch (err) {
      console.error('Login exception:', err);
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(135deg, #f5f7fa, #e6ecf5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: theme.custom.borderRadius.large,
            textAlign: 'center',
            width: '100%',
            maxWidth: 480,
          }}
        >
          {/* App Icon */}
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: theme.custom.borderRadius.button,
              background: theme.palette.custom.gradients.loginIcon,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: theme.custom.shadows.icon,
              mb: 2,
              mx: 'auto',
            }}
          >
            <RestaurantIcon sx={{ fontSize: 32, color: 'white' }} />
          </Box>

          <Typography variant="h6" fontWeight={theme.custom.typography.fontWeight.semibold} color="primary" gutterBottom>
            Yemek Rezervasyon Sistemi
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Lütfen giriş yapmak için bilgilerinizi girin
          </Typography>

          {/* Toggle between Personel & Admin */}
          <ToggleButtonGroup
            value={role}
            exclusive
            onChange={handleRoleChange}
            fullWidth
            sx={{
              mb: 3,
              backgroundColor: theme.palette.custom.background.tan,
              borderRadius: theme.custom.borderRadius.medium,
              '& .MuiToggleButton-root': {
                textTransform: 'none',
                fontWeight: theme.custom.typography.fontWeight.medium,
                border: 'none',
                flex: 1,
              },
              '& .Mui-selected': {
                backgroundColor: '#fff',
                color: '#000',
                boxShadow: theme.custom.shadows.input,
              },
            }}
          >
            <ToggleButton value="personel">Personel</ToggleButton>
            <ToggleButton value="admin">Admin</ToggleButton>
          </ToggleButtonGroup>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              placeholder="ornek@sirket.com"
              type="email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              placeholder="Şifre"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                bgcolor: theme.palette.custom.onboarding.primary,
                color: 'white',
                textTransform: 'none',
                py: 1.2,
                borderRadius: theme.custom.borderRadius.medium,
                '&:hover': { bgcolor: theme.palette.custom.onboarding.primaryDark },
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : `${role === 'personel' ? 'Personel Girişi' : 'Admin Girişi'}`}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
