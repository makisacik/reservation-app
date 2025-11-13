import axiosClient from './axiosClient';

// Turkish name mapping
const TURKISH_NAMES = {
  Breakfast: 'Kahvaltı',
  Lunch: 'Öğle Yemeği',
  Dinner: 'Akşam Yemeği',
};

// Format time range from TimeOnly to HH:mm format
// TimeOnly serializes as "HH:mm:ss" or "HH:mm:ss.fffffff"
const formatTime = (timeOnly) => {
  if (typeof timeOnly === 'string') {
    // Extract HH:mm from formats like "08:00:00" or "08:00:00.0000000"
    return timeOnly.substring(0, 5);
  }
  // If it's already formatted or unexpected format, return as is
  return timeOnly;
};

export const mealTimeSlotsApi = {
  // Get all meal time slots
  getMealTimeSlots: async () => {
    const response = await axiosClient.get('/mealtimes');
    const slots = response.data;
    
    // Map to include Turkish names and formatted time ranges
    return slots.map((slot) => ({
      ...slot,
      turkishName: TURKISH_NAMES[slot.name] || slot.name,
      formattedTimeRange: `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`,
    }));
  },
};

