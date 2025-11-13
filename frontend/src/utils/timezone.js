import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/tr'; // Turkish locale

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Application timezone (matches backend default)
const APPLICATION_TIMEZONE = 'Europe/Istanbul';

/**
 * Converts a UTC date from the backend to the application timezone
 * @param {string|Date|dayjs.Dayjs} date - UTC date from backend
 * @returns {dayjs.Dayjs} Date in application timezone
 */
export const convertUtcToLocal = (date) => {
  if (!date) return null;
  
  // Parse the date and ensure it's treated as UTC
  const utcDate = dayjs.utc(date);
  
  // Convert to application timezone
  return utcDate.tz(APPLICATION_TIMEZONE);
};

/**
 * Formats a date in the application timezone with Turkish locale
 * @param {string|Date|dayjs.Dayjs} date - Date to format
 * @param {string} format - Format string (default: 'D MMMM YYYY' for Turkish format like "4 Kasım 2025")
 * @returns {string} Formatted date string
 */
export const formatDateInTimezone = (date, format = 'D MMMM YYYY') => {
  if (!date) return '';
  
  const localDate = convertUtcToLocal(date);
  if (!localDate || !localDate.isValid()) return '';
  
  return localDate.locale('tr').format(format);
};

/**
 * Gets today's date in the application timezone (for comparisons)
 * @returns {dayjs.Dayjs} Today's date in application timezone
 */
export const getTodayInTimezone = () => {
  return dayjs().tz(APPLICATION_TIMEZONE).startOf('day');
};

/**
 * Compares a date with today in the application timezone
 * @param {string|Date|dayjs.Dayjs} date - Date to compare
 * @returns {number} -1 if date is before today, 0 if same day, 1 if after today
 */
export const compareWithToday = (date) => {
  if (!date) return 0;
  
  const localDate = convertUtcToLocal(date).startOf('day');
  const today = getTodayInTimezone();
  
  if (localDate.isBefore(today)) return -1;
  if (localDate.isAfter(today)) return 1;
  return 0;
};

/**
 * Checks if a date is today in the application timezone
 * @param {string|Date|dayjs.Dayjs} date - Date to check
 * @returns {boolean}
 */
export const isToday = (date) => {
  return compareWithToday(date) === 0;
};

/**
 * Checks if a date is in the past (before today) in the application timezone
 * @param {string|Date|dayjs.Dayjs} date - Date to check
 * @returns {boolean}
 */
export const isPast = (date) => {
  return compareWithToday(date) < 0;
};

/**
 * Checks if a date is in the future (after today) in the application timezone
 * @param {string|Date|dayjs.Dayjs} date - Date to check
 * @returns {boolean}
 */
export const isFuture = (date) => {
  return compareWithToday(date) > 0;
};

