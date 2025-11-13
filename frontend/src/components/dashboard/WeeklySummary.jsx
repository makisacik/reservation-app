import { Box, Card, CardContent, Typography, CircularProgress } from '@mui/material';

/**
 * WeeklySummary - Component for displaying weekly reservation summary (7 days)
 * 
 * @param {Array} dailyData - Array of daily reservation data
 * @param {boolean} isLoading - Loading state
 */
const WeeklySummary = ({ dailyData = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <Card sx={{ borderRadius: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', bgcolor: 'white', p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '150px' }}>
          <CircularProgress />
        </Box>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', bgcolor: 'white' }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#333' }}>
          Haftalık Rezervasyon Özeti
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
          }}
        >
          {dailyData.map((day, index) => (
            <Box
              key={index}
              sx={{
                flex: { xs: '1 1 calc(50% - 8px)', sm: '1 1 0' },
                minWidth: { xs: 'calc(50% - 8px)', sm: '0' },
              }}
            >
              <Card
                sx={{
                  borderRadius: '12px',
                  bgcolor: '#f8f9fa',
                  textAlign: 'center',
                  p: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  border: '1px solid #e0e0e0',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: '#666',
                    mb: 1,
                    fontSize: '0.875rem',
                  }}
                >
                  {day.dayAbbreviation}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: '#333',
                    mb: 0.5,
                  }}
                >
                  {day.reservationCount.toLocaleString('tr-TR')}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#999',
                    fontSize: '0.75rem',
                  }}
                >
                  Rezervasyon
                </Typography>
              </Card>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default WeeklySummary;

