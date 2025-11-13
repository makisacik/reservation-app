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
 * For date-only values (midnight UTC), we preserve the date part to avoid day shifts
 * @param {string|Date|dayjs.Dayjs} date - UTC date from backend
 * @returns {dayjs.Dayjs} Date in application timezone
 */
export const convertUtcToLocal = (date) => {
  if (!date) return null;
  
  // Try parsing as UTC first
  let utcDate = dayjs.utc(date);
  
  // If that fails, try parsing as regular date and then converting to UTC
  if (!utcDate.isValid()) {
    const parsed = dayjs(date);
    if (parsed.isValid()) {
      utcDate = parsed.utc();
    } else {
      console.warn('Invalid date format:', date);
      return null;
    }
  }
  
  // Check if the parsed date is valid
  if (!utcDate.isValid()) {
    console.warn('Invalid UTC date after parsing:', date);
    return null;
  }
  
  // For reservation dates, they are stored as date-only (midnight UTC)
  // We need to preserve the date components to avoid day shifts when converting timezones
  // Extract year, month, day from UTC date and create a date in local timezone with same components
  // This ensures "2025-11-13T00:00:00Z" displays as "13 Kasım 2025" not "12 Kasım 2025"
  const year = utcDate.year();
  const month = utcDate.month(); // dayjs months are 0-indexed
  const day = utcDate.date();
  
  // Validate extracted values
  if (isNaN(year) || isNaN(month) || isNaN(day) || year < 1900 || year > 2100) {
    console.warn('Invalid date components:', { year, month, day }, 'from date:', date);
    return null;
  }
  
  // Create a date string in YYYY-MM-DD format
  // Format: month + 1 because dayjs months are 0-indexed but we need 1-indexed for the string
  const monthStr = String(month + 1).padStart(2, '0');
  const dayStr = String(day).padStart(2, '0');
  const dateString = `${year}-${monthStr}-${dayStr}`;
  
  // Parse the date string as a local date (not UTC) in the application timezone
  // Using dayjs() constructor with timezone ensures it's treated as that calendar date in Istanbul
  let localDate = dayjs.tz(dateString + 'T00:00:00', APPLICATION_TIMEZONE);
  
  // If that doesn't work, try alternative parsing methods
  if (!localDate.isValid()) {
    // Try parsing as a date string directly
    localDate = dayjs(dateString).tz(APPLICATION_TIMEZONE);
  }
  
  if (!localDate.isValid()) {
    // Final fallback: create using dayjs constructor with explicit values
    // Create a new dayjs object in the target timezone
    const now = dayjs().tz(APPLICATION_TIMEZONE);
    localDate = now.year(year).month(month).date(day).hour(0).minute(0).second(0).millisecond(0);
  }
  
  // Validate the created date
  if (!localDate.isValid()) {
    console.warn('Failed to create local date from UTC:', date, { year, month, day, dateString });
    return null;
  }
  
  return localDate;
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

