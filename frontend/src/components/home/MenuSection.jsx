import { Card, CardContent, Typography } from '@mui/material';
import CategoryTabs from '../common/CategoryTabs';
import MealGrid from '../meals/MealGrid';
import ReservationButton from '../common/ReservationButton';

const RADIUS = "20px";

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
  return (
    <Card sx={{ borderRadius: RADIUS, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
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

