import { Box, Card, Typography, Button, Chip, useTheme } from '@mui/material';
import { mealTimeSlotsApi } from '../../api/mealTimeSlotsApi';
import { useQuery } from '@tanstack/react-query';

// Turkish day names
const TURKISH_DAYS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
const TURKISH_MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const formatDateTurkish = (dateStr) => {
  const date = new Date(dateStr + 'T00:00:00');
  const day = date.getDate();
  const month = TURKISH_MONTHS[date.getMonth()];
  const dayName = TURKISH_DAYS[date.getDay()];
  return `${day} ${month} ${dayName}`;
};

const Step5Confirmation = ({
  selectedDates,
  selectedRestaurant,
  selectedMenuType,
  selectedMenu,
  selectedMeal,
  appetizer,
  onSubmit,
  isSubmitting,
}) => {
  const theme = useTheme();
  const { data: mealTimeSlots = [] } = useQuery({
    queryKey: ['mealTimeSlots'],
    queryFn: () => mealTimeSlotsApi.getMealTimeSlots(),
  });

  const getMealTimeSlotName = (mealTimeSlotId) => {
    const slot = mealTimeSlots.find((s) => s.id === mealTimeSlotId);
    return slot?.turkishName || '';
  };

  const getMenuTypeName = () => {
    return selectedMenuType === 1 ? 'Standart Menü' : 'Özel Menü';
  };

  return (
    <Box>
      <Card
        sx={{
          borderRadius: theme.custom.borderRadius.card,
          p: 4,
          boxShadow: theme.custom.shadows.card,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: theme.custom.typography.fontWeight.semibold,
            color: theme.palette.primary.main,
            mb: 1,
          }}
        >
          Rezervasyon Özeti
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.custom.text.secondary,
            mb: 4,
          }}
        >
          Lütfen bilgilerinizi kontrol edin
        </Typography>

        {/* Selected Dates */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: theme.palette.custom.text.secondary,
              mb: 1.5,
            }}
          >
            Seçilen Tarihler:
          </Typography>
          {selectedDates.map((dateObj) => (
            <Box
              key={dateObj.date}
              sx={{
                bgcolor: theme.palette.warning.light,
                borderRadius: theme.custom.borderRadius.button,
                p: 2,
                mb: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography sx={{ color: '#333', fontSize: '14px' }}>
                {formatDateTurkish(dateObj.date)}
              </Typography>
              {dateObj.mealTimeSlotId && (
                <Chip
                  label={getMealTimeSlotName(dateObj.mealTimeSlotId)}
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: 'white',
                    fontWeight: theme.custom.typography.fontWeight.medium,
                    fontSize: '12px',
                  }}
                />
              )}
            </Box>
          ))}
        </Box>

        {/* Restaurant */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: theme.palette.custom.text.secondary,
              mb: 1.5,
            }}
          >
            Restoran:
          </Typography>
          <Box
            sx={{
              bgcolor: '#FFF8E1',
              borderRadius: '12px',
              p: 2,
            }}
          >
            <Typography sx={{ color: '#333', fontSize: '14px' }}>
              {selectedRestaurant?.name}
            </Typography>
          </Box>
        </Box>

        {/* Menu Type */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: theme.palette.custom.text.secondary,
              mb: 1.5,
            }}
          >
            Menü Tipi:
          </Typography>
          <Box
            sx={{
              bgcolor: '#FFF8E1',
              borderRadius: '12px',
              p: 2,
            }}
          >
            <Typography sx={{ color: '#333', fontSize: '14px' }}>
              {getMenuTypeName()}
            </Typography>
          </Box>
        </Box>

        {/* Selected Menu */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: theme.palette.custom.text.secondary,
              mb: 1.5,
            }}
          >
            Seçilen Menü:
          </Typography>
          <Box
            sx={{
              bgcolor: '#FFF8E1',
              borderRadius: '12px',
              p: 2,
            }}
          >
            <Typography sx={{ color: '#333', fontSize: '14px' }}>
              {selectedMeal?.name || selectedMenu?.name || 'Menü seçilmedi'}
            </Typography>
          </Box>
        </Box>

        {/* Appetizer Request */}
        {appetizer && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: theme.palette.custom.text.secondary,
                mb: 1.5,
              }}
            >
              Aparetif Talebi:
            </Typography>
            <Box
              sx={{
                bgcolor: theme.palette.info.light,
                borderRadius: theme.custom.borderRadius.button,
                p: 2,
                border: `2px solid ${theme.palette.info.main}`,
              }}
            >
              <Typography sx={{ color: '#333', fontSize: '14px' }}>
                Mevsim meze tabağı
              </Typography>
            </Box>
          </Box>
        )}

        {/* Submit Button */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            variant="contained"
            sx={{
              borderRadius: theme.custom.borderRadius.button,
              px: 4,
              py: 1.5,
              bgcolor: theme.palette.primary.main,
              color: 'white',
              textTransform: 'none',
              fontWeight: theme.custom.typography.fontWeight.medium,
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
              },
              '&:disabled': {
                bgcolor: theme.palette.custom.border.default,
                color: theme.palette.custom.text.quaternary,
              },
            }}
          >
            {isSubmitting ? 'İşleniyor...' : 'Rezervasyonu Onayla'}
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default Step5Confirmation;

