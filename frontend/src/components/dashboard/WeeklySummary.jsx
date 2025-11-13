import { Box, Card, CardContent, Typography, CircularProgress, useTheme } from '@mui/material';

/**
 * WeeklySummary - Component for displaying weekly reservation summary (7 days)
 * 
 * @param {Array} dailyData - Array of daily reservation data
 * @param {boolean} isLoading - Loading state
 */
const WeeklySummary = ({ dailyData = [], isLoading = false }) => {
  const theme = useTheme();
  if (isLoading) {
    return (
      <Card sx={{ borderRadius: theme.custom.borderRadius.card, boxShadow: theme.custom.shadows.card, bgcolor: 'white', p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '150px' }}>
          <CircularProgress />
        </Box>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: theme.custom.borderRadius.card, boxShadow: theme.custom.shadows.card, bgcolor: 'white' }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: theme.custom.typography.fontWeight.semibold, mb: 3, color: theme.palette.custom.text.primary }}>
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
                  borderRadius: theme.custom.borderRadius.button,
                  bgcolor: theme.palette.custom.background.inactiveTab,
                  textAlign: 'center',
                  p: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  border: `1px solid ${theme.palette.custom.border.default}`,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: theme.custom.typography.fontWeight.semibold,
                    color: theme.palette.custom.text.secondary,
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
                    color: theme.palette.custom.text.primary,
                    mb: 0.5,
                  }}
                >
                  {day.reservationCount.toLocaleString('tr-TR')}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.custom.text.quaternary,
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

