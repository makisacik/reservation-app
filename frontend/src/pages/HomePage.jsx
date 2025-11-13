import { useState } from 'react';
import { Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { menusApi } from '../api/menusApi';
import { mealsApi } from '../api/mealsApi';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import { CATEGORIES, DEFAULT_CATEGORY } from '../constants/homePageConstants';
import { generateAlertMessage, calculateStats, filterMealsByCategory } from '../utils/homePageUtils';
import UserHeaderCard from '../components/home/UserHeaderCard';
import StatsSection from '../components/home/StatsSection';
import MenuSection from '../components/home/MenuSection';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY);

  const { data: menus, isLoading: menusLoading } = useQuery({
    queryKey: ["menus", "today"],
    queryFn: () => menusApi.getTodayMenu(),
  });

  const { data: allMeals, isLoading: mealsLoading } = useQuery({
    queryKey: ["meals"],
    queryFn: () => mealsApi.getMeals(),
  });

  const todayMenu = menus?.[0];
  const menuMeals = todayMenu?.meals || todayMenu?.Meals || [];

  // Calculate stats and generate alert message
  const stats = calculateStats(allMeals || [], menuMeals);
  const alertMessage = generateAlertMessage(menuMeals);

  // Filter meals based on selected category
  const displayedMeals = filterMealsByCategory(
    selectedCategory,
    allMeals || [],
    menuMeals
  );

  const handleReservationClick = () => {
    navigate(ROUTES.RESERVATIONS);
  };

  return (
    <Box sx={{ bgcolor: "#F6F7FB", minHeight: "100vh", p: 3 }}>
      <Box sx={{ maxWidth: "1300px", margin: "0 auto" }}>
        <UserHeaderCard user={user} alertMessage={alertMessage} />
        
        <StatsSection stats={stats} />

        <MenuSection
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          meals={displayedMeals}
          isLoading={menusLoading || mealsLoading}
          onReservationClick={handleReservationClick}
        />
      </Box>
    </Box>
  );
};

export default HomePage;
