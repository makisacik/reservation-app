import { Card, CardContent, Typography, Box, CircularProgress, useTheme } from '@mui/material';

/**
 * TodayReservations - Component for displaying today's reservations grouped by time slot
 * 
 * @param {Array} reservations - Array of today's reservations grouped by time slot
 * @param {boolean} isLoading - Loading state
 */
const TodayReservations = ({ reservations = [], isLoading = false }) => {
  const theme = useTheme();
  // Turkish name mapping for meal time slots
  const TURKISH_NAMES = {
    Breakfast: 'Kahvaltı',
    Lunch: 'Öğle Yemeği',
    Dinner: 'Akşam Yemeği',
  };

  const getTurkishName = (englishName) => {
    return TURKISH_NAMES[englishName] || englishName;
  };

  const formatTime = (timeSpan) => {
    if (!timeSpan) return '';
    // Handle TimeSpan string format (HH:mm:ss.fffffff or HH:mm:ss)
    if (typeof timeSpan === 'string') {
      const parts = timeSpan.split(':');
      if (parts.length >= 2) {
        return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
      }
      return timeSpan;
    }
    // Handle object format { hours, minutes, seconds }
    if (typeof timeSpan === 'object' && timeSpan !== null) {
      const hours = String(timeSpan.hours || 0).padStart(2, '0');
      const minutes = String(timeSpan.minutes || 0).padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    return '';
  };

  const formatTimeRange = (start, end) => {
    const startTime = formatTime(start);
    const endTime = formatTime(end);
    return `${startTime}-${endTime}`;
  };

  if (isLoading) {
    return (
      <Card sx={{ borderRadius: theme.custom.borderRadius.card, boxShadow: theme.custom.shadows.card, bgcolor: 'white' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: theme.custom.borderRadius.card, boxShadow: theme.custom.shadows.card, bgcolor: 'white' }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: theme.custom.typography.fontWeight.semibold, mb: 2, color: theme.palette.custom.text.primary }}>
          Bugünkü Rezervasyonlar
        </Typography>
        {reservations.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            Bugün için rezervasyon bulunmamaktadır.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {reservations.map((reservation, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 1.5,
                  borderBottom: index < reservations.length - 1 ? `1px solid ${theme.palette.custom.background.lighter}` : 'none',
                }}
              >
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: theme.custom.typography.fontWeight.medium, color: theme.palette.custom.text.primary, mb: 0.5 }}>
                    {getTurkishName(reservation.mealTimeSlotName)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatTimeRange(reservation.startTime, reservation.endTime)} • {reservation.restaurantName}
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: theme.custom.typography.fontWeight.semibold, color: theme.palette.primary.light }}>
                  {reservation.reservationCount}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TodayReservations;

