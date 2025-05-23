
export const EVENT_TYPES = {
  delivery: {
    label: 'Entrega',
    color: 'bg-blue-500'
  },
  shipment: {
    label: 'Embarque',
    color: 'bg-green-500'
  },
  meeting: {
    label: 'Reunião',
    color: 'bg-purple-500'
  },
  maintenance: {
    label: 'Manutenção',
    color: 'bg-orange-500'
  },
  other: {
    label: 'Outros',
    color: 'bg-gray-500'
  }
} as const;

export const RECURRENCE_TYPES = {
  none: 'Não repetir',
  daily: 'Diariamente',
  weekly: 'Semanalmente',
  monthly: 'Mensalmente',
  yearly: 'Anualmente'
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
  isScheduledDelivery?: boolean;
  scheduledShipmentId?: string;
}
