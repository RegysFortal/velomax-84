
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Converts a Date object to ISO date string (YYYY-MM-DD) without timezone issues
 */
export function toISODateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Converts an ISO date string to a Date object
 */
export function fromISODateString(dateString: string): Date {
  return new Date(`${dateString}T12:00:00`);
}

/**
 * Formats a date string for display
 */
export function formatDateForDisplay(dateString: string): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(`${dateString}T12:00:00`);
    return date.toLocaleDateString('pt-BR');
  } catch (error) {
    return dateString;
  }
}

/**
 * Create a Date object at noon in the local timezone to avoid timezone issues
 */
export const toLocalDate = (date: Date): Date => {
  if (!date) return new Date();
  
  // Create a date at noon in local timezone to avoid timezone issues
  const localDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    12, 0, 0
  );
  
  return localDate;
};

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
 * Parse a date string in DD/MM/YYYY format to a Date object
 */
export const parseDateString = (dateString: string): Date | null => {
  if (!dateString || dateString.length !== 10) return null;
  
  const parts = dateString.split('/');
  if (parts.length !== 3) return null;
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
  const year = parseInt(parts[2], 10);
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  if (day < 1 || day > 31 || month < 0 || month > 11 || year < 1900) return null;
  
  return new Date(year, month, day, 12, 0, 0);
};

/**
 * Format partial date string as user types (DD/MM/YYYY)
 */
export const formatPartialDateString = (value: string): string => {
  // Remove any non-numeric characters except /
  const cleaned = value.replace(/[^\d]/g, '');
  
  // Add slashes at appropriate positions
  let formatted = cleaned;
  if (cleaned.length >= 2) {
    formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
  }
  if (cleaned.length >= 4) {
    formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + '/' + cleaned.slice(4, 8);
  }
  
  return formatted;
};
