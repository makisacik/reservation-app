import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: 'white',
        color: '#0A1C59',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
          {/* Gradient Icon Box */}
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #6B2C91 0%, #C94B4B 50%, #FF6B35 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(107, 44, 145, 0.3)',
            }}
          >
            <RestaurantIcon sx={{ fontSize: 24, color: 'white' }} />
          </Box>
          
          {/* Text Content */}
          <Box>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 'bold', 
                lineHeight: 1.2,
                color: '#0A1C59',
                fontSize: '1.1rem',
              }}
            >
              Yemek Sistemi
            </Typography>
            <Typography 
              variant="caption" 
              component="div" 
              sx={{ 
                fontSize: '0.75rem', 
                color: '#9E9E9E',
                lineHeight: 1.2,
              }}
            >
              Personel Paneli
            </Typography>
          </Box>
        </Box>
        
        {user && (
          <Button
            onClick={handleLogout}
            startIcon={<ExitToAppIcon />}
            sx={{
              color: '#0A1C59',
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.95rem',
              '&:hover': {
                bgcolor: 'rgba(10, 28, 89, 0.05)',
              },
            }}
          >
            Çıkış
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

