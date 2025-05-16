
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Create a Date object at noon in the local timezone to avoid timezone issues
 */
export const toLocalDate = (date: Date): Date => {
  if (!date) return new Date();
  
  // Create a date at noon in local timezone
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

/**
 * Convert a Date to ISO date string (YYYY-MM-DD) without timezone issues
 */
export const toISODateString = (date: Date): string => {
  if (!date) return '';
  
  // Ensure we're using a local date
  const localDate = toLocalDate(date);
  
  // Create a correct date string by manually extracting year, month, day
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0'); // +1 porque mês começa em 0
  const day = String(localDate.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Parse a date string in DD/MM/YYYY format to a Date object
 */
export const parseDateString = (dateString: string): Date | null => {
  // If empty, return null
  if (!dateString) return null;
  
  // Clean up the input - remove any character that is not a number or slash
  const cleanDateString = dateString.replace(/[^\d\/]/g, '');
  
  // Check if it's in DD/MM/YYYY format with complete values
  if (cleanDateString.includes('/') && cleanDateString.length >= 10) {
    const parts = cleanDateString.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      let year = parseInt(parts[2], 10);
      
      // Handle 2-digit years
      if (year < 100) {
        year += year < 50 ? 2000 : 1900;
      }
      
      if (!isNaN(day) && !isNaN(month) && !isNaN(year) && day >= 1 && day <= 31 && month >= 1 && month <= 12) {
        // Create date at noon to avoid timezone issues
        const date = new Date(year, month - 1, day, 12, 0, 0);
        if (!isNaN(date.getTime()) && date.getDate() === day) { // This checks if it's a valid date
          return date;
        }
      }
    }
  }
  
  // Check if it's already in ISO format (YYYY-MM-DD)
  if (cleanDateString.includes('-') && cleanDateString.split('-')[0].length === 4) {
    const date = new Date(`${cleanDateString}T12:00:00`);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  
  // Try to parse directly if the format is ambiguous
  try {
    const parts = cleanDateString.split(/[-\/]/);
    if (parts.length >= 3) {
      // Try to guess the format based on the values
      let day, month, year;
      
      // Determine if first part is day or year
      if (parseInt(parts[0]) > 31) {
        // Likely YYYY-MM-DD format
        year = parseInt(parts[0]);
        month = parseInt(parts[1]);
        day = parseInt(parts[2]);
      } else {
        // Likely DD/MM/YYYY format
        day = parseInt(parts[0]);
        month = parseInt(parts[1]);
        year = parseInt(parts[2]);
        
        // Handle 2-digit years
        if (year < 100) {
          year += year < 50 ? 2000 : 1900;
        }
      }
      
      if (!isNaN(day) && !isNaN(month) && !isNaN(year) && day >= 1 && day <= 31 && month >= 1 && month <= 12) {
        const date = new Date(year, month - 1, day, 12, 0, 0);
        if (!isNaN(date.getTime()) && date.getDate() === day) { // Valid date check
          return date;
        }
      }
    }
  } catch (e) {
    console.error('Error parsing ambiguous date string:', cleanDateString, e);
  }
  
  console.error('Could not parse date string:', dateString);
  return null;
};

// Format partial or incomplete date string as user types
export const formatPartialDateString = (value: string): string => {
  // Remove non-numeric and non-slash characters
  let formatted = value.replace(/[^\d\/]/g, '');
  
  // Handle automatic slash insertion
  if (formatted.length === 2 && !formatted.includes('/')) {
    formatted += '/';
  } else if (formatted.length === 5 && formatted.indexOf('/', 3) === -1) {
    formatted += '/';
  }
  
  // Limit to 10 characters (DD/MM/YYYY)
  return formatted.substring(0, 10);
};
