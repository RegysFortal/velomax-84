
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Converts a Date object to ISO date string (YYYY-MM-DD) usando hora local com 12h para evitar erro de fuso
 */
export function toISODateString(date: Date): string {
  if (!date || isNaN(date.getTime())) {
    console.error('Invalid date provided to toISODateString:', date);
    return '';
  }

  // Força a hora para 12h no horário local
  const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);

  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const day = String(localDate.getDate()).padStart(2, '0');

  const result = `${year}-${month}-${day}`;
  console.log(`toISODateString - Data ajustada: ${localDate.toISOString()}, Convertida para: ${result}`);
  return result;
}

/**
 * Converte string ISO para Date no horário local com 12h
 */
export function fromISODateString(dateString: string): Date {
  if (!dateString) {
    console.error('Empty date string provided to fromISODateString');
    return new Date();
  }

  const [year, month, day] = dateString.split('-').map(Number);
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    console.error('Invalid date format in fromISODateString:', dateString);
    return new Date();
  }

  // Cria a data no horário local com 12h
  return new Date(year, month - 1, day, 12, 0, 0);
}

/**
 * Formata string de data ISO para exibição
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
 * Cria data local segura com hora ao meio-dia
 */
export const toLocalDate = (date: Date): Date => {
  if (!date || isNaN(date.getTime())) {
    console.error('Invalid date provided to toLocalDate:', date);
    return new Date();
  }

  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
};

/**
 * Formata uma data no padrão ISO (YYYY-MM-DD)
 */
export const formatToLocaleDate = (date: Date): string => {
  if (!date || isNaN(date.getTime())) {
    console.error('Invalid date provided to formatToLocaleDate:', date);
    return '';
  }

  return toISODateString(date);
};

/**
 * Formata data legível DD/MM/YYYY
 */
export const formatToReadableDate = (date: Date | string): string => {
  if (!date) return '';

  try {
    const parsedDate = typeof date === 'string' ? fromISODateString(date) : toLocalDate(date);
    return format(parsedDate, 'dd/MM/yyyy', { locale: ptBR });
  } catch (e) {
    console.error('Error formatting date:', date, e);
    return String(date);
  }
};

/**
 * Converte string DD/MM/YYYY para objeto Date local com 12h
 */
export const parseDateString = (dateString: string): Date | null => {
  if (!dateString || dateString.length !== 10) return null;

  const [dayStr, monthStr, yearStr] = dateString.split('/');
  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const year = parseInt(yearStr, 10);

  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

  return new Date(year, month, day, 12, 0, 0);
};

/**
 * Formata digitação parcial no estilo DD/MM/YYYY
 */
export const formatPartialDateString = (value: string): string => {
  const cleaned = value.replace(/[^\d]/g, '');
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
 * Cria uma data segura com hora local ao meio-dia
 */
export const createSafeDate = (year: number, month: number, day: number): Date => {
  return new Date(year, month, day, 12, 0, 0);
};

/**
 * Converte entrada para ISO (YYYY-MM-DD)
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
 * Retorna a data de hoje como ISO (local com 12h)
 */
export const getTodayISO = (): string => {
  const today = new Date();
  const safeToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0);
  return toISODateString(safeToday);
};
