
import { useState } from 'react';
import { CalendarEvent } from '@/hooks/useCalendarEvents';
import { EventType, RecurrenceType } from '@/hooks/calendar/event-types';
import { useDateUtils } from './useDateUtils';

export const useEventFormState = () => {
  const { createNormalizedDate } = useDateUtils();
  
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState<EventType>('other');
  const [eventDescription, setEventDescription] = useState('');
  const [isScheduledDelivery, setIsScheduledDelivery] = useState(false);
  const [scheduledShipmentId, setScheduledShipmentId] = useState('');
  const [eventDate, setEventDate] = useState<Date | undefined>(new Date());
  const [isAllDay, setIsAllDay] = useState(true);
  const [eventTime, setEventTime] = useState('09:00');
  const [recurrence, setRecurrence] = useState<RecurrenceType>('none');

  const resetForm = () => {
    setEventTitle('');
    setEventType('other');
    setEventDescription('');
    setIsScheduledDelivery(false);
    setScheduledShipmentId('');
    setEventDate(createNormalizedDate(new Date()));
    setIsAllDay(true);
    setEventTime('09:00');
    setRecurrence('none');
  };

  const populateFormFromEvent = (event: CalendarEvent) => {
    const normalizedEventDate = createNormalizedDate(new Date(event.date));
    
    setEventTitle(event.title);
    setEventType(event.type);
    setEventDescription(event.description || '');
    setIsScheduledDelivery(event.isScheduledDelivery || false);
    setScheduledShipmentId(event.scheduledShipmentId || '');
    setEventDate(normalizedEventDate);
    setIsAllDay(event.isAllDay !== undefined ? event.isAllDay : true);
    setEventTime(event.time || '09:00');
    setRecurrence(event.recurrence || 'none');
  };

  return {
    eventTitle,
    setEventTitle,
    eventType,
    setEventType,
    eventDescription,
    setEventDescription,
    isScheduledDelivery,
    setIsScheduledDelivery,
    scheduledShipmentId,
    setScheduledShipmentId,
    eventDate,
    setEventDate,
    isAllDay,
    setIsAllDay,
    eventTime,
    setEventTime,
    recurrence,
    setRecurrence,
    resetForm,
    populateFormFromEvent
  };
};
