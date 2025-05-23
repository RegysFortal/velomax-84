
import React from 'react';
import { EventCalendarView } from './EventCalendarView';
import { EVENT_TYPES } from '@/hooks/useCalendarEvents';

interface EventCalendarSectionProps {
  selectedDate: Date | undefined;
  events: any[];
  onSelectDate: (date: Date | undefined) => void;
}

export const EventCalendarSection = ({
  selectedDate,
  events,
  onSelectDate
}: EventCalendarSectionProps) => {
  return (
    <div className="md:col-span-2">
      <EventCalendarView
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
        events={events}
      />
      <div className="mt-4 flex items-center justify-center gap-4 text-sm flex-wrap">
        {Object.entries(EVENT_TYPES).map(([key, value]) => (
          <div key={key} className="flex items-center">
            <div className={`mr-1 h-3 w-3 rounded-full ${value.color}`} />
            <span>{value.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
