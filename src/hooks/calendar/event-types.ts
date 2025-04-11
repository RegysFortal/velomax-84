
import { addDays, addWeeks, addMonths, addYears } from 'date-fns';

// Event types with corresponding colors
export const EVENT_TYPES = {
  'birthday': { label: 'Aniversário', color: 'bg-pink-500' },
  'delivery': { label: 'Entrega', color: 'bg-blue-500' },
  'holiday': { label: 'Feriado', color: 'bg-purple-500' },
  'meeting': { label: 'Reunião', color: 'bg-amber-500' },
  'other': { label: 'Outro', color: 'bg-gray-500' }
};

// Recurrence types
export const RECURRENCE_TYPES = {
  'none': { label: 'Sem repetição', getValue: (date: Date) => null },
  'daily': { label: 'Diariamente', getValue: (date: Date) => addDays(date, 1) },
  'weekly': { label: 'Semanalmente', getValue: (date: Date) => addWeeks(date, 1) },
  'monthly': { label: 'Mensalmente', getValue: (date: Date) => addMonths(date, 1) },
  'yearly': { label: 'Anualmente', getValue: (date: Date) => addYears(date, 1) }
};

export type EventType = keyof typeof EVENT_TYPES;
export type RecurrenceType = keyof typeof RECURRENCE_TYPES;

export interface CalendarEvent {
  id: string;
  date: Date;
  title: string;
  type: EventType;
  description?: string;
  recurrence?: RecurrenceType;
  recurrenceEndDate?: Date;
}
