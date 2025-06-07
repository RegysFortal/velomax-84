
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Converts a Date object to ISO date string (YYYY-MM-DD) using Brazilian timezone
 */
export function toISODateString(date: Date): string {
  if (!date || isNaN(date.getTime())) {
    console.error('Invalid date provided to toISODateString:', date);
    return '';
  }
  
  // Use Brazilian timezone to ensure correct date conversion
  const dataLocal = new Date(date.toLocaleString("pt-BR", { timeZone: "America/Fortaleza" }));
  
  const year = dataLocal.getFullYear();
  const month = String(dataLocal.getMonth() + 1).padStart(2, '0');
  const day = String(dataLocal.getDate()).padStart(2, '0');
  
  const result = `${year}-${month}-${day}`;
  console.log(`toISODateString - Data original: ${date.toDateString()}, Convertida para: ${result}`);
  return result;
}

/**
 * Converts an ISO date string to a Date object in Brazilian timezone
 */
export function fromISODateString(dateString: string): Date {
  if (!dateString) {
    console.error('Empty date string provided to fromISODateString');
    return new Date();
  }
  
  // Parse the date parts manually and create with Brazilian timezone
  const [year, month, day] = dateString.split('-').map(Number);
  
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    console.error('Invalid date format in fromISODateString:', dateString);
    return new Date();
  }
  
  // Create the date and ensure it's in Brazilian timezone
  const tempDate = new Date(year, month - 1, day, 12, 0, 0, 0);
  const dataLocal = new Date(tempDate.toLocaleString("pt-BR", { timeZone: "America/Fortaleza" }));
  
  console.log(`fromISODateString - String: ${dateString}, Convertida para: ${dataLocal.toDateString()}`);
  return dataLocal;
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
    console.error('Error formatting date for display:', error);
    return dateString;
  }
}

/**
 * Create a Date object in the Brazilian timezone
 */
export const toLocalDate = (date: Date): Date => {
  if (!date || isNaN(date.getTime())) {
    console.error('Invalid date provided to toLocalDate:', date);
    return new Date();
  }
  
  // Use Brazilian timezone for consistency
  const dataLocal = new Date(date.toLocaleString("pt-BR", { timeZone: "America/Fortaleza" }));
  return dataLocal;
};

/**
 * Format a date to a locale format (YYYY-MM-DD) using Brazilian timezone
 */
export const formatToLocaleDate = (date: Date): string => {
  if (!date || isNaN(date.getTime())) {
    console.error('Invalid date provided to formatToLocaleDate:', date);
    return '';
  }
  
  return toISODateString(date);
};

/**
 * Format a date to a readable format (DD/MM/YYYY)
 */
export const formatToReadableDate = (date: Date | string): string => {
  if (!date) return '';
  
  if (typeof date === 'string') {
    try {
      const parsedDate = fromISODateString(date);
      return format(parsedDate, 'dd/MM/yyyy', { locale: ptBR });
    } catch (e) {
      console.error('Error parsing date:', date, e);
      return date;
    }
  }
  
  try {
    return format(toLocalDate(date), 'dd/MM/yyyy', { locale: ptBR });
  } catch (e) {
    console.error('Error formatting date:', date, e);
    return '';
  }
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
  
  // Create date in Brazilian timezone
  const tempDate = new Date(year, month, day, 12, 0, 0, 0);
  return new Date(tempDate.toLocaleString("pt-BR", { timeZone: "America/Fortaleza" }));
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
 * Safe date creation using Brazilian timezone
 */
export const createSafeDate = (year: number, month: number, day: number): Date => {
  const tempDate = new Date(year, month, day, 12, 0, 0, 0);
  return new Date(tempDate.toLocaleString("pt-BR", { timeZone: "America/Fortaleza" }));
};

/**
 * Convert date input to safe ISO string
 */
export const dateInputToISO = (dateInput: string | Date): string => {
  if (!dateInput) return '';
  
  if (typeof dateInput === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
      return dateInput;
    }
    
    const parsed = parseDateString(dateInput);
    if (parsed) {
      return toISODateString(parsed);
    }
    
    return dateInput;
  }
  
  return toISODateString(dateInput);
};

/**
 * Get today's date as ISO string in Brazilian timezone
 */
export const getTodayISO = (): string => {
  const today = new Date();
  const todayBrazil = new Date(today.toLocaleString("pt-BR", { timeZone: "America/Fortaleza" }));
  return toISODateString(todayBrazil);
};
