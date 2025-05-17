
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
 * Convert a Date to ISO date string (YYYY-MM-DD) without timezone issues
 * Esta função foi melhorada para garantir que a data YYYY-MM-DD seja exata
 * baseada na data local, sem ser afetada pelo fuso horário UTC.
 */
export const toISODateString = (date: Date): string => {
  if (!date) return '';
  
  // Ensure we're using a local date at noon
  const localDate = toLocalDate(date);
  
  // Create a correct date string by manually extracting year, month, day
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0'); // +1 porque mês começa em 0
  const day = String(localDate.getDate()).padStart(2, '0');
  
  console.log(`Data convertida: ${year}-${month}-${day} (Original: ${date.toString()})`);
  
  return `${year}-${month}-${day}`;
};
