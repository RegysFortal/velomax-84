
import React from 'react';
import { CalendarEvent } from '@/hooks/useCalendarEvents';
import { EventsList } from './EventsList';

interface EventListSectionProps {
  selectedDate: Date | undefined;
  eventsForSelectedDate: CalendarEvent[];
  handleNewEvent: () => void;
  handleEditEvent: (event: CalendarEvent) => void;
  handleDeleteEvent: (id: string) => void;
}

export const EventListSection = ({
  selectedDate,
  eventsForSelectedDate,
  handleNewEvent,
  handleEditEvent,
  handleDeleteEvent
}: EventListSectionProps) => {
  return (
    <div className="border rounded-md p-4">
      <EventsList
        selectedDate={selectedDate}
        eventsForSelectedDate={eventsForSelectedDate}
        handleNewEvent={handleNewEvent}
        handleEditEvent={handleEditEvent}
        handleDeleteEvent={handleDeleteEvent}
      />
    </div>
  );
};
