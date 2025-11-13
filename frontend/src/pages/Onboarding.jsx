import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import StoreIcon from '@mui/icons-material/Store';
import { ROUTES } from '../utils/constants';

const Onboarding = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate(ROUTES.LOGIN);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(180deg, #E8F4F8 0%, #F5F9FC 50%, #FFFFFF 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        px: 2,
        py: { xs: 3, md: 6 },
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          width: { xs: 70, sm: 80 },
          height: { xs: 70, sm: 80 },
          borderRadius: '12px',
          backgroundColor: '#0A1445',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
          mt: { xs: 2, md: 4 },
        }}
      >
        <Typography
          sx={{
            color: '#FFFFFF',
            fontSize: { xs: '28px', sm: '32px' },
            fontWeight: 700,
            letterSpacing: '1px',
          }}
        >
          ISS
        </Typography>
      </Box>

      {/* Main Title */}
      <Typography
        sx={{
          fontSize: { xs: '28px', sm: '38px', md: '44px', lg: '48px' },
          fontWeight: 700,
          color: '#0A1445',
          textAlign: 'center',
          mb: 2,
          lineHeight: 1.2,
          px: 2,
        }}
      >
        ISS Yemek Rezervasyon Sistemi
      </Typography>

      {/* Description */}
      <Typography
        sx={{
          fontSize: { xs: '14px', sm: '15px', md: '16px' },
          color: '#666666',
          textAlign: 'center',
          mb: 0.5,
          maxWidth: '700px',
          px: 2,
        }}
      >
        Toyota çalışanları için haftalık yemek planlama ve rezervasyon sistemi.
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: '14px', sm: '15px', md: '16px' },
          color: '#666666',
          textAlign: 'center',
          mb: { xs: 3, md: 4 },
          maxWidth: '700px',
          px: 2,
        }}
      >
        Alakart ve Japon restoranlarından seçim yapın.
      </Typography>

      {/* Get Started Button */}
      <Button
        onClick={handleGetStarted}
        variant="contained"
        endIcon={<ArrowForwardIcon sx={{ fontSize: '20px' }} />}
        sx={{
          backgroundColor: '#0A1445',
          color: '#FFFFFF',
          borderRadius: '12px',
          px: { xs: 3, sm: 4 },
          py: 1.5,
          fontSize: { xs: '15px', sm: '16px' },
          fontWeight: 600,
          textTransform: 'none',
          mb: { xs: 4, md: 6 },
          boxShadow: '0 4px 12px rgba(10, 20, 69, 0.25)',
          '&:hover': {
            backgroundColor: '#091234',
            boxShadow: '0 6px 16px rgba(10, 20, 69, 0.35)',
          },
        }}
      >
        Giriş Yap
      </Button>

      {/* Feature Cards */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 2, md: 3 },
          maxWidth: '1200px',
          width: '100%',
          px: 2,
          mb: { xs: 4, md: 6 },
        }}
      >
        {/* Card 1: Haftalık Rezervasyon */}
        <Card
          sx={{
            flex: 1,
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            backgroundColor: '#FFFFFF',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
            },
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Box
              sx={{
                width: { xs: 50, md: 56 },
                height: { xs: 50, md: 56 },
                borderRadius: '12px',
                backgroundColor: '#9C27B0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <CalendarTodayIcon sx={{ fontSize: { xs: 26, md: 28 }, color: '#FFFFFF' }} />
            </Box>
            <Typography
              sx={{
                fontSize: { xs: '18px', md: '20px' },
                fontWeight: 700,
                color: '#0A1445',
                mb: 1,
              }}
            >
              Haftalık Rezervasyon
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '13px', md: '14px' },
                color: '#666666',
                lineHeight: 1.6,
              }}
            >
              Maksimum 2 günlük rezervasyon yapın, menü ve restoran seçiminizi kolayca yapın
            </Typography>
          </CardContent>
        </Card>

        {/* Card 2: Menü Çeşitleri */}
        <Card
          sx={{
            flex: 1,
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            backgroundColor: '#FFFFFF',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
            },
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Box
              sx={{
                width: { xs: 50, md: 56 },
                height: { xs: 50, md: 56 },
                borderRadius: '12px',
                backgroundColor: '#03A9F4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <RestaurantMenuIcon sx={{ fontSize: { xs: 26, md: 28 }, color: '#FFFFFF' }} />
            </Box>
            <Typography
              sx={{
                fontSize: { xs: '18px', md: '20px' },
                fontWeight: 700,
                color: '#0A1445',
                mb: 1,
              }}
            >
              Menü Çeşitleri
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '13px', md: '14px' },
                color: '#666666',
                lineHeight: 1.6,
              }}
            >
              Standart menü, özel menü ve aparetif seçenekleri ile zengin alternatifler
            </Typography>
          </CardContent>
        </Card>

        {/* Card 3: İki Restoran Seçeneği */}
        <Card
          sx={{
            flex: 1,
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            backgroundColor: '#FFFFFF',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
            },
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Box
              sx={{
                width: { xs: 50, md: 56 },
                height: { xs: 50, md: 56 },
                borderRadius: '12px',
                backgroundColor: '#00BCD4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <StoreIcon sx={{ fontSize: { xs: 26, md: 28 }, color: '#FFFFFF' }} />
            </Box>
            <Typography
              sx={{
                fontSize: { xs: '18px', md: '20px' },
                fontWeight: 700,
                color: '#0A1445',
                mb: 1,
              }}
            >
              İki Restoran Seçeneği
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '13px', md: '14px' },
                color: '#666666',
                lineHeight: 1.6,
              }}
            >
              Alakart Restoran ve Japon Restoran'dan tercihinize göre seçim yapın
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Onboarding;

