import { Box, Card, Typography, Button, Chip } from '@mui/material';
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
          borderRadius: '20px',
          p: 4,
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: '#0A1C59',
            mb: 1,
          }}
        >
          Rezervasyon Özeti
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#666',
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
              color: '#666',
              mb: 1.5,
            }}
          >
            Seçilen Tarihler:
          </Typography>
          {selectedDates.map((dateObj) => (
            <Box
              key={dateObj.date}
              sx={{
                bgcolor: '#FFF8E1',
                borderRadius: '12px',
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
                    bgcolor: '#0A1C59',
                    color: 'white',
                    fontWeight: 500,
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
              color: '#666',
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
              color: '#666',
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
              color: '#666',
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
                color: '#666',
                mb: 1.5,
              }}
            >
              Aparetif Talebi:
            </Typography>
            <Box
              sx={{
                bgcolor: '#E3F2FD',
                borderRadius: '12px',
                p: 2,
                border: '2px solid #4A90E2',
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
              borderRadius: '12px',
              px: 4,
              py: 1.5,
              bgcolor: '#0A1C59',
              color: 'white',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                bgcolor: '#0d2569',
              },
              '&:disabled': {
                bgcolor: '#E0E0E0',
                color: '#999',
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

