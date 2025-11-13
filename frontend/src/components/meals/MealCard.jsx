import { Card, CardContent, Typography, Box, Chip, useTheme } from '@mui/material';

/**
 * MealCard - Reusable component for displaying a meal card
 * 
 * @param {Object} meal - Meal object with id, name, imageUrl, categoryName, kcal
 * @param {function} onClick - Optional click handler
 */
const MealCard = ({ meal, onClick }) => {
  const theme = useTheme();
  return (
    <Card
      onClick={onClick}
      sx={{
        borderRadius: theme.custom.borderRadius.card,
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        transition: "0.25s",
        boxShadow: theme.custom.shadows.card,
        "&:hover": onClick ? { boxShadow: theme.custom.shadows.cardHover } : {},
      }}
    >
      <Box
        sx={{
          height: 150,
          backgroundImage: `url(${meal.imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <Chip
          label={meal.categoryName}
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            bgcolor: theme.palette.primary.light,
            color: "white",
            fontWeight: theme.custom.typography.fontWeight.semibold,
            borderRadius: theme.custom.borderRadius.medium,
          }}
        />
      </Box>

      <CardContent>
        <Typography sx={{ fontWeight: theme.custom.typography.fontWeight.bold }}>{meal.name}</Typography>
        <Typography color="text.secondary">
          {meal.kcal} kcal
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MealCard;

