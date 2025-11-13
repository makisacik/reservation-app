import { useState } from 'react';
import { Box, IconButton, Typography, Grid } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Turkish month and day names
const TURKISH_MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const TURKISH_DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const ENGLISH_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Helper function to format date as YYYY-MM-DD in local timezone
const formatDateToString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const Calendar = ({ selectedDates = [], onDateSelect, maxSelections = 2 }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Get previous month's trailing days
  const prevMonth = new Date(year, month - 1, 0);
  const daysInPrevMonth = prevMonth.getDate();

  const handleDateClick = (date) => {
    const dateStr = formatDateToString(date);
    const isSelected = selectedDates.some(d => d.date === dateStr);

    if (isSelected) {
      // Deselect
      onDateSelect(selectedDates.filter(d => d.date !== dateStr));
    } else {
      // Check if we can select more
      if (selectedDates.length >= maxSelections) {
        return; // Max selections reached
      }
      // Add new selection
      onDateSelect([...selectedDates, { date: dateStr }]);
    }
  };

  const isDateSelected = (date) => {
    const dateStr = formatDateToString(date);
    return selectedDates.some(d => d.date === dateStr);
  };

  const isDateToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isDatePast = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const renderCalendarDays = () => {
    const days = [];

    // Previous month's trailing days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, daysInPrevMonth - i);
      const isSelected = isDateSelected(date);
      
      days.push(
        <Box
          key={`prev-${i}`}
          onClick={() => handleDateClick(date)}
          sx={{
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            cursor: 'pointer',
            color: '#999',
            fontSize: '14px',
            '&:hover': {
              bgcolor: isSelected ? '#4A90E2' : 'rgba(0,0,0,0.04)',
            },
            bgcolor: isSelected ? '#4A90E2' : 'transparent',
            color: isSelected ? 'white' : '#999',
          }}
        >
          {daysInPrevMonth - i}
        </Box>
      );
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelected = isDateSelected(date);
      const isToday = isDateToday(date);
      const isPast = isDatePast(date);

      days.push(
        <Box
          key={day}
          onClick={() => !isPast && handleDateClick(date)}
          sx={{
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            cursor: isPast ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: isToday ? 600 : 400,
            '&:hover': {
              bgcolor: isPast ? 'transparent' : isSelected ? '#0A1C59' : 'rgba(0,0,0,0.04)',
            },
            bgcolor: isSelected ? (isToday ? '#0A1C59' : '#4A90E2') : 'transparent',
            color: isPast ? '#ccc' : isSelected ? 'white' : isToday ? '#0A1C59' : '#333',
            border: isToday && !isSelected ? '2px solid #0A1C59' : 'none',
          }}
        >
          {day}
        </Box>
      );
    }

    // Next month's leading days
    const totalCells = 42; // 6 rows * 7 days
    const remainingCells = totalCells - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(year, month + 1, i);
      const isSelected = isDateSelected(date);
      
      days.push(
        <Box
          key={`next-${i}`}
          onClick={() => handleDateClick(date)}
          sx={{
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            cursor: 'pointer',
            color: '#999',
            fontSize: '14px',
            '&:hover': {
              bgcolor: isSelected ? '#4A90E2' : 'rgba(0,0,0,0.04)',
            },
            bgcolor: isSelected ? '#4A90E2' : 'transparent',
            color: isSelected ? 'white' : '#999',
          }}
        >
          {i}
        </Box>
      );
    }

    return days;
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Month Navigation */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        <IconButton
          onClick={handlePrevMonth}
          size="small"
          sx={{ color: '#333' }}
        >
          <ArrowBackIosIcon fontSize="small" />
        </IconButton>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: '#333',
            fontSize: '18px',
          }}
        >
          {TURKISH_MONTHS[month]} {year}
        </Typography>
        <IconButton
          onClick={handleNextMonth}
          size="small"
          sx={{ color: '#333' }}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Day Headers */}
      <Grid container spacing={0} sx={{ mb: 1 }}>
        {ENGLISH_DAYS.map((day, index) => (
          <Grid item xs={12 / 7} key={index}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 1,
                fontSize: '12px',
                fontWeight: 500,
                color: '#666',
              }}
            >
              {day}
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Calendar Grid */}
      <Grid container spacing={0}>
        {renderCalendarDays().map((day, index) => (
          <Grid
            item
            xs={12 / 7}
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 0.5,
            }}
          >
            {day}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Calendar;

