import { Card, CardContent, Typography, useTheme } from '@mui/material';
import CategoryTabs from '../common/CategoryTabs';
import MealGrid from '../meals/MealGrid';
import ReservationButton from '../common/ReservationButton';

/**
 * MenuSection - Component for displaying menu with categories and meals
 * 
 * @param {Object} props
 * @param {string[]} categories - Available categories
 * @param {string} selectedCategory - Currently selected category
 * @param {function} onCategoryChange - Category change handler
 * @param {Array} meals - Array of meals to display
 * @param {boolean} isLoading - Loading state
 * @param {function} onReservationClick - Reservation button click handler
 */
const MenuSection = ({
  categories,
  selectedCategory,
  onCategoryChange,
  meals,
  isLoading,
  onReservationClick,
}) => {
  const theme = useTheme();
  return (
    <Card sx={{ borderRadius: theme.custom.borderRadius.card, boxShadow: theme.custom.shadows.card }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: theme.custom.typography.fontWeight.bold }}>
          Bugünün Menüsü
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 2 }}>
          Restoran rezervasyonu ve yemekhane menüsü
        </Typography>

        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
        />

        <MealGrid meals={meals} isLoading={isLoading} maxItems={4} />

        <ReservationButton onClick={onReservationClick} />
      </CardContent>
    </Card>
  );
};

export default MenuSection;

