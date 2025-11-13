import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { formatDateInTimezone } from '../../utils/timezone';
import { mealTimeSlotsApi } from '../../api/mealTimeSlotsApi';
import { useQuery } from '@tanstack/react-query';

/**
 * ReservationCard - Displays a single reservation card matching the design
 * 
 * @param {Object} reservation - Reservation data
 * @param {string} mealName - Name of the meal (from menu)
 * @param {boolean} isPast - Whether this is a past reservation
 */
const ReservationCard = ({ reservation, mealName, isPast = false }) => {
  const { data: mealTimeSlots = [] } = useQuery({
    queryKey: ['mealTimeSlots'],
    queryFn: () => mealTimeSlotsApi.getMealTimeSlots(),
  });

  // Get meal time slot info
  const mealTimeSlot = mealTimeSlots.find(slot => slot.id === reservation.mealTimeSlotId);
  const timeSlotName = mealTimeSlot?.turkishName || reservation.mealTimeSlotName || '';
  const timeRange = mealTimeSlot?.formattedTimeRange || '';

  // Format date in Turkish: "4 Kasım 2025"
  // Use the localDate if available (already converted), otherwise convert from UTC
  const dateToFormat = reservation.localDate || reservation.date;
  const formattedDate = dateToFormat 
    ? (reservation.localDate && reservation.localDate.isValid()
        ? reservation.localDate.locale('tr').format('D MMMM YYYY')
        : formatDateInTimezone(reservation.date, 'D MMMM YYYY'))
    : '';

  // Format time slot display: "Öğle Yemeği • 12:00 - 14:00"
  const timeSlotDisplay = timeRange 
    ? `${timeSlotName} • ${timeRange}`
    : timeSlotName;

  // Status badge text - handle both numeric and string status values
  // Note: Pending/Confirmed system only affects admin section.
  // Users should see their reservations regardless of status (Pending, Active, etc.)
  const getStatusInfo = () => {
    const status = reservation.status;
    // Handle both numeric (1, 2, 3) and string ("Active", "Pending", "Cancelled") status values
    const isPending = status === 3 || status === 'Pending';
    const isActive = status === 1 || status === 'Active';
    const isCancelled = status === 2 || status === 'Cancelled';
    
    if (isCancelled) {
      return { text: 'İptal Edildi', color: '#757575', show: true };
    } else if (isPending) {
      return { text: 'Beklemede', color: '#1976d2', show: true };
    } else if (isActive && !isPast) {
      return { text: 'Onaylandı', color: '#0A1C59', show: true };
    }
    return { text: '', color: '', show: false };
  };
  
  const statusInfo = getStatusInfo();

  return (
    <Card
      sx={{
        borderRadius: '20px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        bgcolor: 'white',
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ p: 3, flexGrow: 1 }}>
        {/* Status Badge */}
        {statusInfo.show && (
          <Chip
            label={statusInfo.text}
            size="small"
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              bgcolor: statusInfo.color,
              color: 'white',
              fontWeight: 500,
              fontSize: '0.75rem',
              height: 24,
              borderRadius: '12px',
            }}
          />
        )}

        {/* Meal Name */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: '#0A1C59',
            mb: 1,
            pr: statusInfo.show ? 8 : 0, // Make room for status badge
          }}
        >
          {mealName || 'Menü'}
        </Typography>

        {/* Location */}
        <Typography
          variant="body2"
          sx={{
            color: '#9E9E9E',
            mb: 2,
            fontSize: '0.875rem',
          }}
        >
          {reservation.restaurantName || 'Yemekhane'}
        </Typography>

        {/* Date */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <CalendarTodayIcon
            sx={{
              color: '#666',
              fontSize: '18px',
              mr: 1.5,
            }}
          />
          <Typography
            variant="body2"
            sx={{
              color: '#333',
              fontSize: '0.875rem',
            }}
          >
            {formattedDate}
          </Typography>
        </Box>

        {/* Time Slot */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <AccessTimeIcon
            sx={{
              color: '#666',
              fontSize: '18px',
              mr: 1.5,
            }}
          />
          <Typography
            variant="body2"
            sx={{
              color: '#333',
              fontSize: '0.875rem',
            }}
          >
            {timeSlotDisplay}
          </Typography>
        </Box>

        {/* Location */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LocationOnIcon
            sx={{
              color: '#666',
              fontSize: '18px',
              mr: 1.5,
            }}
          />
          <Typography
            variant="body2"
            sx={{
              color: '#333',
              fontSize: '0.875rem',
            }}
          >
            {reservation.restaurantName || 'Yemekhane'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ReservationCard;

