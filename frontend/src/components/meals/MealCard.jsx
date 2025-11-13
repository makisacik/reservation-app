import { Card, CardContent, Typography, Box, Chip } from '@mui/material';

/**
 * MealCard - Reusable component for displaying a meal card
 * 
 * @param {Object} meal - Meal object with id, name, imageUrl, categoryName, kcal
 * @param {function} onClick - Optional click handler
 */
const MealCard = ({ meal, onClick }) => {
  return (
    <Card
      onClick={onClick}
      sx={{
        borderRadius: "20px",
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        transition: "0.25s",
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        "&:hover": onClick ? { boxShadow: "0 8px 20px rgba(0,0,0,0.10)" } : {},
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
            bgcolor: "#1665d8",
            color: "white",
            fontWeight: 600,
            borderRadius: "8px",
          }}
        />
      </Box>

      <CardContent>
        <Typography sx={{ fontWeight: "bold" }}>{meal.name}</Typography>
        <Typography color="text.secondary">
          {meal.kcal} kcal
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MealCard;

