import { Card, CardContent, Typography, Box, LinearProgress, CircularProgress, useTheme } from '@mui/material';

/**
 * PopularMenus - Component for displaying popular meals with progress bars
 * 
 * @param {Array} popularMeals - Array of popular meals
 * @param {boolean} isLoading - Loading state
 */
const PopularMenus = ({ popularMeals = [], isLoading = false }) => {
  const theme = useTheme();
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

  // Calculate max count for progress bar scaling
  const maxCount = popularMeals.length > 0 
    ? Math.max(...popularMeals.map(m => m.reservationCount))
    : 1;

  return (
    <Card sx={{ borderRadius: theme.custom.borderRadius.card, boxShadow: theme.custom.shadows.card, bgcolor: 'white' }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: theme.custom.typography.fontWeight.semibold, mb: 2, color: theme.palette.custom.text.primary }}>
          En Popüler Menüler
        </Typography>
        {popularMeals.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            Henüz popüler menü bulunmamaktadır.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {popularMeals.map((meal, index) => {
              const progress = (meal.reservationCount / maxCount) * 100;
              return (
                <Box key={meal.mealId || index}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: theme.custom.typography.fontWeight.medium, color: theme.palette.custom.text.primary }}>
                      {meal.mealName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {meal.reservationCount} sipariş
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      height: 8,
                      borderRadius: theme.custom.borderRadius.small,
                      bgcolor: theme.palette.custom.border.default,
                      '& .MuiLinearProgress-bar': {
                        bgcolor: theme.palette.primary.light,
                        borderRadius: theme.custom.borderRadius.small,
                      },
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PopularMenus;

