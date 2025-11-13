import { Card, CardContent, Typography, Box, LinearProgress, CircularProgress } from '@mui/material';

/**
 * PopularMenus - Component for displaying popular meals with progress bars
 * 
 * @param {Array} popularMeals - Array of popular meals
 * @param {boolean} isLoading - Loading state
 */
const PopularMenus = ({ popularMeals = [], isLoading = false }) => {
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

  // Calculate max count for progress bar scaling
  const maxCount = popularMeals.length > 0 
    ? Math.max(...popularMeals.map(m => m.reservationCount))
    : 1;

  return (
    <Card sx={{ borderRadius: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', bgcolor: 'white' }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
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
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#333' }}>
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
                      borderRadius: 4,
                      bgcolor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#1665d8',
                        borderRadius: 4,
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

