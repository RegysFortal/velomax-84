
import { format } from 'date-fns';

/**
 * Format a date to a locale format (YYYY-MM-DD)
 */
export const formatToLocaleDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * Format a date to a readable format (DD/MM/YYYY)
 */
export const formatToReadableDate = (date: Date | string): string => {
  if (typeof date === 'string') {
    // Ensure the date string is in a format JavaScript can parse
    date = new Date(date);
  }
  return format(date, 'dd/MM/yyyy');
};

/**
 * Format a date to include time (DD/MM/YYYY HH:mm)
 */
export const formatDateWithTime = (date: Date | string, timeString?: string): string => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  if (timeString) {
    const [hours, minutes] = timeString.split(':');
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
  }
  
  return format(date, 'dd/MM/yyyy HH:mm');
};
