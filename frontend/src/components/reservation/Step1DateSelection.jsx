import { useState, useEffect } from 'react';
import { Box, Card, Typography, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material';
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
          borderRadius: '20px',
          p: 4,
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CalendarTodayIcon sx={{ color: '#0A1C59', mr: 1.5, fontSize: '28px' }} />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: '#0A1C59',
              fontSize: '20px',
            }}
          >
            Tarih & Öğün Seçimi (Maksimum 2 Gün)
          </Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: '#666',
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
            borderRadius: '20px',
            p: 4,
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            bgcolor: '#FFF8E1',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#0A1C59',
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
                      fontWeight: 500,
                      color: '#333',
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
                      borderRadius: '20px',
                      bgcolor: '#0A1C59',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 600,
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
                              color: '#0A1C59',
                              '&.Mui-checked': {
                                color: '#0A1C59',
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
                          borderRadius: '12px',
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

