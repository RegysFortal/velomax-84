
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toLocalDate } from './dateConversion';

/**
 * Format a date to a locale format (YYYY-MM-DD)
 */
export const formatToLocaleDate = (date: Date): string => {
  // Create a local date at noon to avoid timezone issues
  const localDate = toLocalDate(date);
  
  // Format to ISO and take only the date part
  return localDate.toISOString().split('T')[0];
};

/**
 * Format a date to a readable format (DD/MM/YYYY)
 */
export const formatToReadableDate = (date: Date | string): string => {
  if (!date) return '';
  
  if (typeof date === 'string') {
    // Parse the date string
    try {
      // If it's already in ISO format (YYYY-MM-DD)
      if (date.includes('-')) {
        return format(new Date(`${date}T12:00:00`), 'dd/MM/yyyy', { locale: ptBR });
      } else {
        // If it might be in a different format, try to parse with parseISO
        return format(parseISO(date), 'dd/MM/yyyy', { locale: ptBR });
      }
    } catch (e) {
      console.error('Error parsing date:', date, e);
      // Fallback to a generic approach
      const parsedDate = new Date(date);
      return format(toLocalDate(parsedDate), 'dd/MM/yyyy', { locale: ptBR });
    }
  }
  
  // If it's already a Date object, ensure we're using noon to avoid timezone issues
  return format(toLocalDate(date), 'dd/MM/yyyy', { locale: ptBR });
};

/**
 * Format a date to include time (DD/MM/YYYY HH:mm)
 */
export const formatDateWithTime = (date: Date | string, timeString?: string): string => {
  if (!date) return '';
  
  let localDate: Date;
  
  if (typeof date === 'string') {
    // Create date at noon to avoid timezone issues
    localDate = new Date(`${date}T12:00:00`);
  } else {
    localDate = toLocalDate(date);
  }
  
  if (timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    if (!isNaN(hours) && !isNaN(minutes)) {
      localDate.setHours(hours, minutes);
    }
  }
  
  return format(localDate, 'dd/MM/yyyy HH:mm', { locale: ptBR });
};
