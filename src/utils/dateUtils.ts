
import { format, parseISO } from 'date-fns';

/**
 * Format a date to a locale format (YYYY-MM-DD)
 */
export const formatToLocaleDate = (date: Date): string => {
  // Create a local copy of the date and set it to noon to avoid timezone issues
  const localDate = new Date(date);
  localDate.setHours(12, 0, 0, 0);
  
  // Format to ISO and take only the date part
  return localDate.toISOString().split('T')[0];
};

/**
 * Format a date to a readable format (DD/MM/YYYY)
 */
export const formatToReadableDate = (date: Date | string): string => {
  if (typeof date === 'string') {
    // Parse the date string
    try {
      // If it's already in ISO format (YYYY-MM-DD)
      if (date.includes('-')) {
        return format(new Date(`${date}T12:00:00`), 'dd/MM/yyyy');
      } else {
        // If it might be in a different format, try to parse with parseISO
        return format(parseISO(date), 'dd/MM/yyyy');
      }
    } catch (e) {
      console.error('Error parsing date:', date, e);
      // Fallback to a generic approach
      const parsedDate = new Date(date);
      parsedDate.setHours(12, 0, 0, 0);
      return format(parsedDate, 'dd/MM/yyyy');
    }
  }
  
  // If it's already a Date object, ensure we're using noon to avoid timezone issues
  const localDate = new Date(date);
  localDate.setHours(12, 0, 0, 0);
  return format(localDate, 'dd/MM/yyyy');
};

/**
 * Format a date to include time (DD/MM/YYYY HH:mm)
 */
export const formatDateWithTime = (date: Date | string, timeString?: string): string => {
  let localDate: Date;
  
  if (typeof date === 'string') {
    // Create date at noon to avoid timezone issues
    localDate = new Date(`${date}T12:00:00`);
  } else {
    localDate = new Date(date);
    localDate.setHours(12, 0, 0, 0);
  }
  
  if (timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    if (!isNaN(hours) && !isNaN(minutes)) {
      localDate.setHours(hours, minutes);
    }
  }
  
  return format(localDate, 'dd/MM/yyyy HH:mm');
};

/**
 * Convert a Date to ISO date string (YYYY-MM-DD) without timezone issues
 */
export const toISODateString = (date: Date): string => {
  // Create a local copy of the date and set it to noon to avoid timezone issues
  const localDate = new Date(date);
  localDate.setHours(12, 0, 0, 0);
  return localDate.toISOString().split('T')[0];
};

/**
 * Parse a date string in DD/MM/YYYY format to a Date object
 */
export const parseDateString = (dateString: string): Date | null => {
  // If empty, return null
  if (!dateString) return null;
  
  // Check if it's already in ISO format (YYYY-MM-DD)
  if (dateString.includes('-') && dateString.split('-')[0].length === 4) {
    const date = new Date(`${dateString}T12:00:00`);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  
  // Check if it's in DD/MM/YYYY format
  if (dateString.includes('/')) {
    const [day, month, year] = dateString.split('/').map(Number);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      // Month is 0-indexed in JS Date
      const date = new Date(year, month - 1, day, 12, 0, 0);
      if (date.getDate() === day) { // This checks if it's a valid date
        return date;
      }
    }
  }
  
  console.error('Could not parse date string:', dateString);
  return null;
};
