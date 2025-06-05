
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
