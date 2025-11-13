import { AppBar, Toolbar, Typography, Button, Box, useTheme } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Navbar = () => {
  const theme = useTheme();
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
        color: theme.palette.primary.main,
        boxShadow: theme.custom.shadows.input,
        borderBottom: `1px solid ${theme.palette.custom.border.default}`,
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
          {/* Gradient Icon Box */}
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: theme.custom.borderRadius.medium,
              background: theme.palette.custom.gradients.loginIcon,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: theme.custom.shadows.icon,
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
                fontWeight: theme.custom.typography.fontWeight.bold, 
                lineHeight: 1.2,
                color: theme.palette.primary.main,
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
                color: theme.palette.custom.text.tertiary,
                lineHeight: 1.2,
              }}
            >
              {user?.role === 'Admin' || user?.role === 1 ? 'Admin Paneli' : 'Personel Paneli'}
            </Typography>
          </Box>
        </Box>
        
        {user && (
          <Button
            onClick={handleLogout}
            startIcon={<ExitToAppIcon />}
            sx={{
              color: theme.palette.primary.main,
              textTransform: 'none',
              fontWeight: theme.custom.typography.fontWeight.medium,
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

