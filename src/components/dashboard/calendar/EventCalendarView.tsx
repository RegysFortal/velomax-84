
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { ptBR } from 'date-fns/locale';
import { CalendarEvent } from '@/hooks/useCalendarEvents';
import { format } from 'date-fns';
import { EVENT_TYPES } from '@/hooks/calendar/event-types';
import { DayContentProps } from 'react-day-picker';

interface EventCalendarViewProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  events: CalendarEvent[];
}

export function EventCalendarView({
  selectedDate,
  onSelectDate,
  events
}: EventCalendarViewProps) {
  // Create a map of dates that have events
  const eventDatesWithTypes = React.useMemo(() => {
    const eventMap = new Map<string, string[]>();
    
    events.forEach(event => {
      if (!event.date) return;
      
      try {
        const dateKey = format(new Date(event.date), 'yyyy-MM-dd');
        if (!eventMap.has(dateKey)) {
          eventMap.set(dateKey, []);
        }
        // Add event type to the array for this date
        eventMap.get(dateKey)?.push(event.type);
      } catch (error) {
        console.error('Error processing event date:', error);
      }
    });
    
    return eventMap;
  }, [events]);

  // Function to check if a day has events
  const isDayWithEvent = (date: Date): boolean => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return eventDatesWithTypes.has(dateKey);
  };

  // Function to get event types for a specific day
  const getEventTypesForDay = (date: Date): string[] => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return eventDatesWithTypes.get(dateKey) || [];
  };

  // Custom day rendering to show colored dots for events
  const renderDayContent = (props: DayContentProps) => {
    const { date, activeModifiers } = props;
    const eventTypes = getEventTypesForDay(date);
    
    return (
      <div className="relative flex items-center justify-center w-full h-full">
        <div className="absolute inset-0 flex items-center justify-center text-foreground">
          {/* Display the day number directly instead of using props.children */}
          {date.getDate()}
        </div>
        
        {eventTypes.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-0.5 mb-1">
            {eventTypes.slice(0, 3).map((type, i) => (
              <span 
                key={`${format(date, 'yyyy-MM-dd')}-${i}`} 
                className={`w-1.5 h-1.5 rounded-full ${EVENT_TYPES[type as keyof typeof EVENT_TYPES]?.color || 'bg-gray-400'}`}
              />
            ))}
            {eventTypes.length > 3 && (
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onSelectDate}
        className="rounded-md border w-full"
        locale={ptBR}
        modifiersClassNames={{
          selected: "bg-primary text-primary-foreground",
          today: "bg-secondary text-secondary-foreground"
        }}
        // Mark days that have events
        modifiers={{
          hasEvent: (date) => isDayWithEvent(date)
        }}
        modifiersStyles={{
          hasEvent: { 
            fontWeight: 'bold',
            borderBottom: '2px solid var(--primary)'
          }
        }}
        components={{
          DayContent: renderDayContent
        }}
      />
    </div>
  );
}
