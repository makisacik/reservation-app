import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Card,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import { ROUTES } from '../utils/constants';

const drawerWidth = 240;

const menuItems = [
  { text: 'Ana Sayfa', icon: <HomeIcon />, path: ROUTES.DASHBOARD },
  { text: 'Rezervasyon Yap', icon: <CalendarTodayIcon />, path: ROUTES.RESERVATIONS },
  { text: 'Rezervasyonlarım', icon: <HistoryIcon />, path: ROUTES.MY_RESERVATIONS },
  { text: 'Profilim', icon: <PersonIcon />, path: ROUTES.SETTINGS },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        position: 'relative',
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          border: 'none',
          bgcolor: '#F6F7FB',
          position: 'relative',
          height: '100%',
          top: 0,
          marginTop: 0,
        },
      }}
    >
      <Box sx={{ p: 2, pt: 1.5 }}>
        <Card
          sx={{
            borderRadius: '20px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            bgcolor: 'white',
            p: 1,
          }}
        >
          <List sx={{ p: 0 }}>
            {menuItems.map((item) => {
              // Use exact match for active state to prevent multiple items highlighting
              // For MY_RESERVATIONS, check if pathname starts with it (to handle nested routes)
              // For other routes, use exact match
              const isActive = item.path === ROUTES.MY_RESERVATIONS
                ? location.pathname.startsWith(ROUTES.MY_RESERVATIONS)
                : location.pathname === item.path;
              return (
                <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    sx={{
                      borderRadius: '12px',
                      py: 1.5,
                      px: 2,
                      bgcolor: isActive ? '#0A1C59' : 'transparent',
                      color: isActive ? 'white' : '#333',
                      '&:hover': {
                        bgcolor: isActive ? '#0A1C59' : 'rgba(0,0,0,0.04)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: isActive ? 'white' : '#666',
                        minWidth: 40,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 600 : 400,
                        fontSize: '0.95rem',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Card>
      </Box>
    </Drawer>
  );
};

export default Sidebar;

