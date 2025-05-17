
import { toLocalDate } from './dateConversion';

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
