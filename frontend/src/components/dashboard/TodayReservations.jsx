import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';

/**
 * TodayReservations - Component for displaying today's reservations grouped by time slot
 * 
 * @param {Array} reservations - Array of today's reservations grouped by time slot
 * @param {boolean} isLoading - Loading state
 */
const TodayReservations = ({ reservations = [], isLoading = false }) => {
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
      <Card sx={{ borderRadius: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', bgcolor: 'white' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', bgcolor: 'white' }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
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
                  borderBottom: index < reservations.length - 1 ? '1px solid #f0f0f0' : 'none',
                }}
              >
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: '#333', mb: 0.5 }}>
                    {getTurkishName(reservation.mealTimeSlotName)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatTimeRange(reservation.startTime, reservation.endTime)} • {reservation.restaurantName}
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1665d8' }}>
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

