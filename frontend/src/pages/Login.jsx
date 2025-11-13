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
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../utils/constants';

const Login = () => {
  const [role, setRole] = useState('personel');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
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
      if (result.success) {
        navigate(ROUTES.DASHBOARD);
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
            borderRadius: 3,
            textAlign: 'center',
            width: '100%',
            maxWidth: 480,
          }}
        >
          {/* App Icon */}
          <Box
            component="img"
            src="/icon.png"
            alt="App Icon"
            sx={{ width: 60, height: 60, borderRadius: 2, mb: 2, mx: 'auto' }}
          />

          <Typography variant="h6" fontWeight={600} color="primary" gutterBottom>
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
              backgroundColor: '#f5f2ef',
              borderRadius: 2,
              '& .MuiToggleButton-root': {
                textTransform: 'none',
                fontWeight: 500,
                border: 'none',
                flex: 1,
              },
              '& .Mui-selected': {
                backgroundColor: '#fff',
                color: '#000',
                boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
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
                bgcolor: '#0A1445',
                color: 'white',
                textTransform: 'none',
                py: 1.2,
                borderRadius: 2,
                '&:hover': { bgcolor: '#091234' },
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
