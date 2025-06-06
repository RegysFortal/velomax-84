
import { CalendarEvent } from '@/hooks/useCalendarEvents';
import { useEventFormState } from './useEventFormState';
import { useEventOperations } from './useEventOperations';
import { useEventHandlers } from './useEventHandlers';

export const useEventState = (
  events: CalendarEvent[],
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void,
  updateEvent: (id: string, event: Partial<CalendarEvent>) => void,
  deleteEvent: (id: string) => void
) => {
  const {
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
  } = useEventFormState();

  const { saveEvent, handleDeleteEvent } = useEventOperations(addEvent, updateEvent, deleteEvent);

  const {
    showEventDialog,
    setShowEventDialog,
    selectedDate,
    setSelectedDate,
    selectedEvent,
    setSelectedEvent,
    handleSelect,
    getEventsForSelectedDate,
    handleEditEvent,
    handleNewEvent
  } = useEventHandlers(events, populateFormFromEvent, resetForm);

  const handleSaveEvent = () => {
    const success = saveEvent(selectedEvent, {
      eventDate,
      eventTitle,
      eventType,
      eventDescription,
      isScheduledDelivery,
      scheduledShipmentId,
      isAllDay,
      eventTime,
      recurrence
    });
    
    if (success) {
      setShowEventDialog(false);
      resetForm();
    }
  };

  const handleDeleteEventWithDialog = () => {
    const success = handleDeleteEvent(selectedEvent);
    if (success) {
      setShowEventDialog(false);
      resetForm();
    }
  };
  
  return {
    showEventDialog,
    setShowEventDialog,
    selectedDate,
    setSelectedDate,
    selectedEvent,
    setSelectedEvent,
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
    handleSelect,
    handleSaveEvent,
    handleDeleteEvent: handleDeleteEventWithDialog,
    resetForm,
    getEventsForSelectedDate,
    handleEditEvent,
    handleNewEvent
  };
};
