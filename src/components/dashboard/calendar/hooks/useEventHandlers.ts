
import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarEvent } from '@/hooks/useCalendarEvents';
import { useDateUtils } from './useDateUtils';

export const useEventHandlers = (
  events: CalendarEvent[],
  populateFormFromEvent: (event: CalendarEvent) => void,
  resetForm: () => void
) => {
  const { createNormalizedDate } = useDateUtils();
  
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>(undefined);

  // Handle selecting a date on the calendar
  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const normalizedSelectedDate = createNormalizedDate(date);
    
    const eventsForDate = events.filter(event => {
      const eventDate = createNormalizedDate(new Date(event.date));
      return eventDate.toDateString() === normalizedSelectedDate.toDateString();
    });
    
    setSelectedDate(normalizedSelectedDate);
    
    if (eventsForDate.length === 1) {
      const event = eventsForDate[0];
      setSelectedEvent(event);
      populateFormFromEvent(event);
      setShowEventDialog(true);
    } else {
      setSelectedEvent(undefined);
      resetForm();
    }
  };

  const getEventsForSelectedDate = () => {
    return selectedDate 
      ? events.filter(event => {
          const eventDate = createNormalizedDate(new Date(event.date));
          const selectedDateNormalized = createNormalizedDate(selectedDate);
          return eventDate.toDateString() === selectedDateNormalized.toDateString();
        })
      : [];
  };
    
  const handleEditEvent = (event: CalendarEvent) => {
    const normalizedEventDate = createNormalizedDate(new Date(event.date));
    
    setSelectedEvent(event);
    setSelectedDate(normalizedEventDate);
    populateFormFromEvent(event);
    setShowEventDialog(true);
  };

  const handleNewEvent = () => {
    const today = createNormalizedDate(new Date());
    setSelectedDate(today);
    setSelectedEvent(undefined);
    resetForm();
    setShowEventDialog(true);
  };

  return {
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
  };
};
