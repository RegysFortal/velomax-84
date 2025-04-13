
import { format } from 'date-fns';

/**
 * Format a date to a locale format (YYYY-MM-DD)
 */
export const formatToLocaleDate = (date: Date): string => {
  // Use ISO string and split to avoid timezone issues
  return date.toISOString().split('T')[0];
};

/**
 * Format a date to a readable format (DD/MM/YYYY)
 */
export const formatToReadableDate = (date: Date | string): string => {
  if (typeof date === 'string') {
    // Ensure the date string is in a format JavaScript can parse
    date = new Date(date);
    // Set to noon to avoid timezone issues
    date.setHours(12, 0, 0, 0);
  }
  return format(date, 'dd/MM/yyyy');
};

/**
 * Format a date to include time (DD/MM/YYYY HH:mm)
 */
export const formatDateWithTime = (date: Date | string, timeString?: string): string => {
  if (typeof date === 'string') {
    date = new Date(date);
    // Set to noon to avoid timezone issues
    date.setHours(12, 0, 0, 0);
  }
  
  if (timeString) {
    const [hours, minutes] = timeString.split(':');
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
  }
  
  return format(date, 'dd/MM/yyyy HH:mm');
};

/**
 * Convert a Date to ISO date string (YYYY-MM-DD) without timezone issues
 */
export const toISODateString = (date: Date): string => {
  // Use ISO string and split to avoid timezone issues
  return date.toISOString().split('T')[0];
};
