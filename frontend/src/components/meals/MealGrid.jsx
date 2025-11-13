import { Grid, Box, CircularProgress, Typography } from '@mui/material';
import MealCard from './MealCard';

/**
 * MealGrid - Reusable component for displaying a grid of meals
 * 
 * @param {Array} meals - Array of meal objects
 * @param {boolean} isLoading - Loading state
 * @param {function} onMealClick - Optional click handler for meals
 * @param {number} maxItems - Maximum number of items to display (default: all)
 */
const MealGrid = ({ meals = [], isLoading = false, onMealClick, maxItems }) => {
  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!meals || meals.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography color="text.secondary">Henüz yemek bulunmamaktadır.</Typography>
      </Box>
    );
  }

  const displayMeals = maxItems ? meals.slice(0, maxItems) : meals;

  return (
    <Grid container spacing={2}>
      {displayMeals.map((meal) => (
        <Grid item xs={12} sm={6} md={3} key={meal.id}>
          <MealCard meal={meal} onClick={onMealClick} />
        </Grid>
      ))}
    </Grid>
  );
};

export default MealGrid;

