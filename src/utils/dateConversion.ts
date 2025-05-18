
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
 * Convert a Date to ISO date string (YYYY-MM-DD) without timezone issues
 * Fixed to ensure the correct date is used regardless of timezone
 */
export const toISODateString = (date: Date): string => {
  if (!date) return '';
  
  // Ensure we're using the date as-is without timezone adjustments
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  console.log(`Original date: ${date.toString()}`);
  console.log(`Converted to: ${year}-${month}-${day}`);
  
  return `${year}-${month}-${day}`;
};
