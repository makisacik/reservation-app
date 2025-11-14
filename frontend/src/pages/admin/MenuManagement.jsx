import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  CircularProgress,
  Snackbar,
  Alert,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mealsApi } from '../../api/mealsApi';
import { restaurantsApi } from '../../api/restaurantsApi';
import { categoriesApi } from '../../api/categoriesApi';
import AdminMealCard from '../../components/menu/AdminMealCard';
import MealModal from '../../components/menu/MealModal';

const MenuManagement = () => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { data: meals = [], isLoading: mealsLoading } = useQuery({
    queryKey: ['admin-meals', selectedRestaurantId],
    queryFn: () => mealsApi.getAdminMeals(selectedRestaurantId || null, null),
    staleTime: 30 * 60 * 1000, // 30 minutes - extend cache for meal data
    gcTime: 60 * 60 * 1000, // 1 hour - keep in cache for 1 hour
  });

  const { data: restaurants = [], isLoading: restaurantsLoading } = useQuery({
    queryKey: ['restaurants'],
    queryFn: () => restaurantsApi.getRestaurants(),
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getCategories(),
  });

  const createMealMutation = useMutation({
    mutationFn: (mealData) => mealsApi.createMeal(mealData),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-meals']);
      setSnackbar({ open: true, message: 'Menü başarıyla oluşturuldu', severity: 'success' });
      setModalOpen(false);
      setEditingMeal(null);
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Menü oluşturulurken bir hata oluştu',
        severity: 'error',
      });
    },
  });

  const updateMealMutation = useMutation({
    mutationFn: ({ id, mealData }) => mealsApi.updateMeal(id, mealData),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-meals']);
      setSnackbar({ open: true, message: 'Menü başarıyla güncellendi', severity: 'success' });
      setModalOpen(false);
      setEditingMeal(null);
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Menü güncellenirken bir hata oluştu',
        severity: 'error',
      });
    },
  });

  const deleteMealMutation = useMutation({
    mutationFn: (id) => mealsApi.deleteMeal(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-meals']);
      setSnackbar({ open: true, message: 'Menü başarıyla silindi', severity: 'success' });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Menü silinirken bir hata oluştu',
        severity: 'error',
      });
    },
  });

  const filteredMeals = useMemo(() => {
    let filtered = [...meals];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((meal) => meal.name.toLowerCase().includes(query));
    }

    if (selectedCategoryTab !== 'all') {
      if (selectedCategoryTab === 'yemekhane') {
        filtered = filtered.filter((meal) => meal.restaurantName === 'Yemekhane');
      } else if (selectedCategoryTab === 'japon') {
        filtered = filtered.filter((meal) => meal.restaurantName === 'Japon Restoran');
      } else if (selectedCategoryTab === 'alakart') {
        filtered = filtered.filter((meal) => meal.categoryName === 'Alakart');
      }
    }

    return filtered;
  }, [meals, searchQuery, selectedCategoryTab]);

  const handleAddNew = () => {
    setEditingMeal(null);
    setModalOpen(true);
  };

  const handleEdit = (meal) => {
    setEditingMeal(meal);
    setModalOpen(true);
  };

  const handleDelete = (meal) => {
    if (window.confirm(`"${meal.name}" menüsünü silmek istediğinize emin misiniz?`)) {
      deleteMealMutation.mutate(meal.id);
    }
  };

  const handleSave = (mealData) => {
    if (editingMeal) {
      updateMealMutation.mutate({ id: editingMeal.id, mealData });
    } else {
      createMealMutation.mutate(mealData);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingMeal(null);
  };

  const isLoading = mealsLoading || restaurantsLoading || categoriesLoading;
  const isSaving = createMealMutation.isPending || updateMealMutation.isPending;

  return (
    <Box sx={{ flexGrow: 1, p: 3, bgcolor: theme.palette.custom.background.page, minHeight: 'calc(100vh - 64px)' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: theme.custom.typography.fontWeight.semibold, color: theme.palette.custom.text.primary, mb: 0.5 }}>
          Menü Yönetimi
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Yemek menülerini düzenleyin ve yönetin
        </Typography>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Q Menü ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: theme.palette.custom.text.quaternary }} />
              </InputAdornment>
            ),
          }}
          sx={{
            flex: 1,
            minWidth: 200,
            '& .MuiOutlinedInput-root': {
              borderRadius: theme.custom.borderRadius.button,
              bgcolor: 'white',
            },
          }}
        />

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Restoran</InputLabel>
          <Select
            value={selectedRestaurantId}
            onChange={(e) => setSelectedRestaurantId(e.target.value)}
            label="Restoran"
            sx={{
              borderRadius: theme.custom.borderRadius.button,
              bgcolor: 'white',
            }}
          >
            <MenuItem value="">Tüm Restoranlar</MenuItem>
            {restaurants.map((restaurant) => (
              <MenuItem key={restaurant.id} value={restaurant.id}>
                {restaurant.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNew}
          sx={{
            bgcolor: theme.palette.primary.main,
            color: 'white',
            borderRadius: '12px',
            textTransform: 'none',
            px: 3,
            '&:hover': {
              bgcolor: theme.palette.primary.dark,
            },
          }}
        >
          + Yeni Menü Ekle
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Tabs
          value={selectedCategoryTab}
          onChange={(e, newValue) => setSelectedCategoryTab(newValue)}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: theme.custom.typography.fontWeight.medium,
              minHeight: 48,
              borderRadius: `${theme.custom.borderRadius.button} ${theme.custom.borderRadius.button} 0 0`,
              mr: 1,
            },
            '& .Mui-selected': {
              color: theme.palette.primary.main,
              fontWeight: theme.custom.typography.fontWeight.semibold,
            },
          }}
        >
          <Tab label="Tümü" value="all" />
          <Tab label="Yemekhane" value="yemekhane" />
          <Tab label="Alakart" value="alakart" />
          <Tab label="Japon" value="japon" />
        </Tabs>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : filteredMeals.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            {searchQuery || selectedCategoryTab !== 'all' || selectedRestaurantId
              ? 'Arama kriterlerinize uygun menü bulunamadı'
              : 'Henüz menü eklenmemiş'}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredMeals.map((meal) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={meal.id}>
              <AdminMealCard
                meal={meal}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <MealModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        meal={editingMeal}
        categories={categories}
        restaurants={restaurants}
        isLoading={isSaving}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MenuManagement;

