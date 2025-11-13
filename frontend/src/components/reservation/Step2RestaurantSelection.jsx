import { Box, Card, Typography, Button } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { restaurantsApi } from '../../api/restaurantsApi';
import { useQuery } from '@tanstack/react-query';

const Step2RestaurantSelection = ({ selectedRestaurant, onRestaurantSelect }) => {
  const { data: restaurants = [], isLoading } = useQuery({
    queryKey: ['restaurants'],
    queryFn: () => restaurantsApi.getRestaurants(),
  });

  // Default colors for restaurant cards (can be customized)
  const restaurantColors = [
    { bg: '#2ECC71', name: 'green' }, // Green
    { bg: '#3498DB', name: 'blue' },  // Blue
  ];

  if (isLoading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography>Yükleniyor...</Typography>
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
        Restoran Seçimi
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: '#666',
          mb: 4,
        }}
      >
        Yemek yemek istediğiniz restoranı seçin
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
          gap: 3,
        }}
      >
        {restaurants.map((restaurant, index) => {
          const isSelected = selectedRestaurant?.id === restaurant.id;
          const color = restaurantColors[index % restaurantColors.length];

          return (
            <Card
              key={restaurant.id}
              onClick={() => onRestaurantSelect(restaurant)}
              sx={{
                borderRadius: '20px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: isSelected ? '3px solid #0A1C59' : 'none',
                boxShadow: isSelected
                  ? '0 6px 20px rgba(10, 28, 89, 0.2)'
                  : '0 4px 16px rgba(0,0,0,0.06)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                },
              }}
            >
              {/* Icon Section */}
              <Box
                sx={{
                  bgcolor: color.bg,
                  height: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <RestaurantIcon
                  sx={{
                    fontSize: '80px',
                    color: 'white',
                  }}
                />
              </Box>

              {/* Restaurant Name */}
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: '#0A1C59',
                    mb: 2,
                  }}
                >
                  {restaurant.name}
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
    </Box>
  );
};

export default Step2RestaurantSelection;

