
export const EVENT_TYPES = {
  birthday: {
    label: 'Aniversário',
    color: 'bg-pink-500'
  },
  meeting: {
    label: 'Reunião',
    color: 'bg-blue-500'
  },
  holiday: {
    label: 'Feriado',
    color: 'bg-green-500'
  },
  other: {
    label: 'Outro',
    color: 'bg-gray-500'
  }
} as const;

export const RECURRENCE_TYPES = {
  none: 'Não se repete',
  daily: 'Todos os dias',
  weekly: 'Todas as semanas',
  monthly: 'Todos os meses',
  yearly: 'Todos os anos'
} as const;

export type EventType = keyof typeof EVENT_TYPES;
export type RecurrenceType = keyof typeof RECURRENCE_TYPES;

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: EventType;
  description?: string;
  recurrence?: RecurrenceType;
  recurrenceEndDate?: Date;
  isAllDay?: boolean;
  time?: string;
  isScheduledDelivery?: boolean;
  scheduledShipmentId?: string;
}
