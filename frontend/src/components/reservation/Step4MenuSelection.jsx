import { Box, Card, Typography, Button, Checkbox, FormControlLabel, CircularProgress } from '@mui/material';
import { menusApi } from '../../api/menusApi';
import { useQuery } from '@tanstack/react-query';

const Step4MenuSelection = ({
  selectedDates,
  selectedRestaurant,
  selectedMenuType,
  selectedMenu,
  selectedMeal,
  appetizer,
  onMenuSelect,
  onAppetizerChange,
}) => {
  // Get the first selected date for menu fetching
  // Note: We use the first date's menu for all reservations
  // The backend will validate that menus exist for all dates
  const firstDate = selectedDates[0]?.date;

  const { data: menus = [], isLoading, error } = useQuery({
    queryKey: ['menus', firstDate, selectedRestaurant?.id, selectedMenuType],
    queryFn: () =>
      menusApi.getMenus(
        firstDate,
        selectedRestaurant?.id,
        selectedMenuType
      ),
    enabled: !!firstDate && !!selectedRestaurant && selectedMenuType !== null,
  });

  // Get meals from the first menu (assuming one menu per date/restaurant/type)
  // Backend uses camelCase, so property is 'meals' not 'Meals'
  const menu = menus[0];
  const meals = menu?.meals || menu?.Meals || [];
  
  console.log("Step 4 Debug:", { 
    menusLength: menus?.length, 
    menu, 
    mealsLength: meals?.length,
    menuType: menu?.menuType,
    selectedMenuType 
  });

  // Check if we have multiple dates and show a warning if needed
  const hasMultipleDates = selectedDates.length > 1;

  const getMenuTypeName = () => {
    return selectedMenuType === 1 ? 'Standart Menü' : 'Özel Menü';
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: '#0A1C59',
          mb: 1,
        }}
      >
        Menü Seçimi
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: '#666',
          mb: 4,
        }}
      >
        {selectedRestaurant?.name} - {getMenuTypeName()}
      </Typography>

      {hasMultipleDates && (
        <Box
          sx={{
            bgcolor: '#E3F2FD',
            borderRadius: '12px',
            p: 2,
            mb: 3,
            border: '1px solid #4A90E2',
          }}
        >
          <Typography sx={{ color: '#0A1C59', fontSize: '14px' }}>
            Not: Seçilen menü tüm seçili tarihler için kullanılacaktır.
          </Typography>
        </Box>
      )}

      {error ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="error">
            Menü yüklenirken bir hata oluştu: {error.message}
          </Typography>
        </Box>
      ) : menus.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary" sx={{ mb: 1 }}>
            Bu tarih ve menü tipi için menü bulunamadı.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
            Lütfen farklı bir menü tipi seçin veya başka bir tarih deneyin.
          </Typography>
        </Box>
      ) : meals.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">
            Bu menüde yemek bulunamadı.
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: 3,
            mb: 4,
          }}
        >
          {meals.map((meal) => {
            // Check if this meal is selected
            const isSelected = selectedMeal?.id === meal.id;

            return (
              <Card
                key={meal.id}
                sx={{
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: isSelected ? '3px solid #0A1C59' : 'none',
                  boxShadow: isSelected
                    ? '0 6px 20px rgba(10, 28, 89, 0.2)'
                    : '0 4px 16px rgba(0,0,0,0.06)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  },
                }}
                onClick={() => {
                  // Store both menu (for menuId) and meal (for display)
                  onMenuSelect(menu, meal);
                }}
              >
                {/* Meal Image */}
                <Box
                  sx={{
                    height: '200px',
                    bgcolor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  {meal.imageUrl ? (
                    <img
                      src={meal.imageUrl}
                      alt={meal.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <Typography color="text.secondary">Resim Yok</Typography>
                  )}
                </Box>

                {/* Meal Info */}
                <Box sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: '#0A1C59',
                      mb: 1,
                    }}
                  >
                    {meal.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#666',
                      mb: 2,
                      minHeight: '40px',
                    }}
                  >
                    {meal.description || 'Açıklama yok'}
                  </Typography>

                  {isSelected && (
                    <Button
                      variant="contained"
                      disabled
                      sx={{
                        borderRadius: '12px',
                        bgcolor: '#0A1C59',
                        color: 'white',
                        textTransform: 'none',
                        fontWeight: 500,
                        px: 3,
                        py: 1,
                        width: '100%',
                        '&.Mui-disabled': {
                          bgcolor: '#0A1C59',
                          color: 'white',
                        },
                      }}
                    >
                      Seçildi
                    </Button>
                  )}
                </Box>
              </Card>
            );
          })}
        </Box>
      )}

      {/* Appetizer Checkbox */}
      <Card
        sx={{
          borderRadius: '20px',
          p: 3,
          bgcolor: '#FFF8E1',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={appetizer}
              onChange={(e) => onAppetizerChange(e.target.checked)}
              sx={{
                color: '#0A1C59',
                '&.Mui-checked': {
                  color: '#0A1C59',
                },
              }}
            />
          }
          label={
            <Typography sx={{ color: '#333', fontSize: '14px' }}>
              Aparetif talebi ekle (Mevsim meze tabağı)
            </Typography>
          }
        />
      </Card>
    </Box>
  );
};

export default Step4MenuSelection;

