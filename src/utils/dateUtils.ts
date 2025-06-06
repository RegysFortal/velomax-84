
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Converts a Date object to ISO date string (YYYY-MM-DD) without timezone issues
 */
export function toISODateString(date: Date): string {
  // Garantir que usamos os valores exatos da data sem conversão de timezone
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  const result = `${year}-${month}-${day}`;
  console.log(`Data original: ${date.toString()}, Convertida para: ${result}`);
  return result;
}

/**
 * Converts an ISO date string to a Date object at noon to avoid timezone issues
 */
export function fromISODateString(dateString: string): Date {
  // Parse the date parts and create at noon to avoid timezone issues
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0); // hora 12h
}

/**
 * Formats a date string for display
 */
export function formatDateForDisplay(dateString: string): string {
  if (!dateString) return '';
  
  try {
    const date = fromISODateString(dateString);
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
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  
  return new Date(year, month, day, 12, 0, 0); // hora 12h
};

/**
 * Format a date to a locale format (YYYY-MM-DD) - FIXED VERSION
 */
export const formatToLocaleDate = (date: Date): string => {
  if (!date) return '';
  
  // Use toISODateString to avoid timezone issues
  return toISODateString(date);
};

/**
 * Format a date to a readable format (DD/MM/YYYY)
 */
export const formatToReadableDate = (date: Date | string): string => {
  if (!date) return '';
  
  if (typeof date === 'string') {
    // Parse the date string using our safe method
    try {
      const parsedDate = fromISODateString(date);
      return format(parsedDate, 'dd/MM/yyyy', { locale: ptBR });
    } catch (e) {
      console.error('Error parsing date:', date, e);
      return date;
    }
  }
  
  // If it's already a Date object, use toLocalDate to ensure consistency
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
  
  // Create date at noon to avoid timezone issues
  return new Date(year, month, day, 12, 0, 0); // hora 12h
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

/**
 * Safe date creation - creates date at noon to avoid timezone issues
 */
export const createSafeDate = (year: number, month: number, day: number): Date => {
  return new Date(year, month, day, 12, 0, 0); // hora 12h
};

/**
 * Convert date input to safe ISO string
 */
export const dateInputToISO = (dateInput: string | Date): string => {
  if (!dateInput) return '';
  
  if (typeof dateInput === 'string') {
    // If it's already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
      return dateInput;
    }
    
    // If it's in DD/MM/YYYY format, convert it
    const parsed = parseDateString(dateInput);
    if (parsed) {
      return toISODateString(parsed);
    }
    
    return dateInput;
  }
  
  return toISODateString(dateInput);
};
