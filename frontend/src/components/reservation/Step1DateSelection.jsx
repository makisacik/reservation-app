import { useState, useEffect } from 'react';
import { Box, Card, Typography, Radio, RadioGroup, FormControlLabel, FormControl, useTheme } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Calendar from './Calendar';
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

const Step1DateSelection = ({ selectedDates, onDatesChange }) => {
  const theme = useTheme();
  const { data: mealTimeSlots = [] } = useQuery({
    queryKey: ['mealTimeSlots'],
    queryFn: () => mealTimeSlotsApi.getMealTimeSlots(),
  });

  const handleDateSelect = (dates) => {
    // Initialize meal time slot for new dates
    const updatedDates = dates.map((dateObj) => {
      const existing = selectedDates.find((d) => d.date === dateObj.date);
      return existing || { ...dateObj, mealTimeSlotId: null };
    });
    onDatesChange(updatedDates);
  };

  const handleMealTimeSlotChange = (dateStr, mealTimeSlotId) => {
    const updatedDates = selectedDates.map((d) =>
      d.date === dateStr ? { ...d, mealTimeSlotId: parseInt(mealTimeSlotId) } : d
    );
    onDatesChange(updatedDates);
  };

  const getCurrentDateSelection = () => {
    // Find the first date without a meal time slot selected
    return selectedDates.find((d) => !d.mealTimeSlotId) || selectedDates[0];
  };

  const currentDateSelection = getCurrentDateSelection();

  return (
    <Box>
      <Card
        sx={{
          borderRadius: theme.custom.borderRadius.card,
          p: 4,
          boxShadow: theme.custom.shadows.card,
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CalendarTodayIcon sx={{ color: theme.palette.primary.main, mr: 1.5, fontSize: '28px' }} />
          <Typography
            variant="h5"
            sx={{
              fontWeight: theme.custom.typography.fontWeight.semibold,
              color: theme.palette.primary.main,
              fontSize: '20px',
            }}
          >
            Tarih & Öğün Seçimi (Maksimum 2 Gün)
          </Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.custom.text.secondary,
            mb: 3,
            ml: 5,
          }}
        >
          Haftalık menü için istediğiniz günleri seçin
        </Typography>

        <Calendar
          selectedDates={selectedDates}
          onDateSelect={handleDateSelect}
          maxSelections={2}
        />
      </Card>

      {selectedDates.length > 0 && (
        <Card
          sx={{
            borderRadius: theme.custom.borderRadius.card,
            p: 4,
            boxShadow: theme.custom.shadows.card,
            bgcolor: theme.palette.warning.main,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: theme.palette.primary.main,
              mb: 3,
            }}
          >
            Seçilen Günler için Öğün Seçin
          </Typography>

          {selectedDates.map((dateObj, index) => {
            const dateStr = dateObj.date;
            const selectedMealTimeSlotId = dateObj.mealTimeSlotId;

            return (
              <Box key={dateStr} sx={{ mb: index < selectedDates.length - 1 ? 3 : 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: theme.custom.typography.fontWeight.medium,
                      color: theme.palette.custom.text.primary,
                      fontSize: '16px',
                    }}
                  >
                    {formatDateTurkish(dateStr)}
                  </Typography>
                  <Box
                    sx={{
                      ml: 2,
                      px: 2,
                      py: 0.5,
                      borderRadius: theme.custom.borderRadius.card,
                      bgcolor: theme.palette.primary.main,
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: theme.custom.typography.fontWeight.semibold,
                    }}
                  >
                    {index + 1}. Gün
                  </Box>
                </Box>

                <FormControl component="fieldset">
                  <RadioGroup
                    value={selectedMealTimeSlotId?.toString() || ''}
                    onChange={(e) => handleMealTimeSlotChange(dateStr, e.target.value)}
                  >
                    {mealTimeSlots.map((slot) => (
                      <FormControlLabel
                        key={slot.id}
                        value={slot.id.toString()}
                        control={
                          <Radio
                            sx={{
                              color: theme.palette.primary.main,
                              '&.Mui-checked': {
                                color: theme.palette.primary.main,
                              },
                            }}
                          />
                        }
                        label={
                          <Typography sx={{ color: '#333', fontSize: '14px' }}>
                            {slot.turkishName} ({slot.formattedTimeRange})
                          </Typography>
                        }
                        sx={{
                          mb: 1.5,
                          bgcolor: 'white',
                          borderRadius: theme.custom.borderRadius.button,
                          px: 2,
                          py: 1.5,
                          '&:hover': {
                            bgcolor: 'rgba(10, 28, 89, 0.04)',
                          },
                        }}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Box>
            );
          })}
        </Card>
      )}
    </Box>
  );
};

export default Step1DateSelection;

