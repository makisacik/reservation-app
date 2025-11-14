import { useState, useMemo, useEffect } from 'react';
import { Box, useTheme } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { menusApi } from '../../api/menusApi';
import { mealsApi } from '../../api/mealsApi';
import { categoriesApi } from '../../api/categoriesApi';
import { homeApi } from '../../api/homeApi';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { generateAlertMessage, filterMealsByCategory } from '../../utils/homePageUtils';
import UserHeaderCard from '../../components/home/UserHeaderCard';
import StatsSection from '../../components/home/StatsSection';
import MenuSection from '../../components/home/MenuSection';

const HomePage = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getCategories(),
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["home", "stats"],
    queryFn: () => homeApi.getStats(),
    staleTime: 0, // Always consider data stale, so it refetches when component mounts
    gcTime: 1 * 60 * 1000, // Keep in cache for 1 minute
    refetchOnMount: true, // Refetch when component mounts
  });

  const { data: menus, isLoading: menusLoading } = useQuery({
    queryKey: ["menus", "today"],
    queryFn: () => menusApi.getTodayMenu(),
    staleTime: 30 * 60 * 1000, // 30 minutes - extend cache for menu data
    gcTime: 60 * 60 * 1000, // 1 hour - keep in cache for 1 hour
  });

  const { data: allMeals, isLoading: mealsLoading } = useQuery({
    queryKey: ["meals"],
    queryFn: () => mealsApi.getMeals(),
    staleTime: 30 * 60 * 1000, // 30 minutes - extend cache for meal data
    gcTime: 60 * 60 * 1000,
  });

  const defaultCategory = useMemo(() => {
    if (categories && categories.length > 0) {
      return categories.find(c => c.name === "Aylık Menü")?.name || categories[0].name;
    }
    return "";
  }, [categories]);

  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    if (defaultCategory && !selectedCategory) {
      setSelectedCategory(defaultCategory);
    }
  }, [defaultCategory, selectedCategory]);

  const todayMenu = menus?.[0];
  const menuMeals = todayMenu?.meals || todayMenu?.Meals || [];

  const alertMessage = generateAlertMessage(menuMeals);

  const displayedMeals = filterMealsByCategory(
    selectedCategory,
    allMeals || [],
    menuMeals,
    categories || []
  );

  const categoryNames = useMemo(() => {
    if (!categories) return [];
    return categories.map(c => c.name);
  }, [categories]);

  const handleReservationClick = () => {
    navigate(ROUTES.RESERVATIONS);
  };

  return (
    <Box sx={{ bgcolor: theme.palette.custom.background.page, minHeight: "100vh", p: 3 }}>
      <Box sx={{ maxWidth: "1300px", margin: "0 auto" }}>
        <UserHeaderCard user={user} alertMessage={alertMessage} />
        
        <StatsSection stats={stats} isLoading={statsLoading} />

        <MenuSection
          categories={categoryNames}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          meals={displayedMeals}
          isLoading={menusLoading || mealsLoading || categoriesLoading}
          onReservationClick={handleReservationClick}
        />
      </Box>
    </Box>
  );
};

export default HomePage;
