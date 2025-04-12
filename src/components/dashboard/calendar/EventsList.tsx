
import React from 'react';
import { CalendarEvent } from '@/hooks/useCalendarEvents';
import { EventItem } from './EventItem';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Separator } from '@/components/ui/separator';

interface EventsListProps {
  selectedDate: Date | undefined;
  eventsForSelectedDate: CalendarEvent[];
  handleNewEvent: () => void;
  handleEditEvent: (event: CalendarEvent) => void;
  handleDeleteEvent: (id: string) => void;
}

export function EventsList({
  selectedDate,
  eventsForSelectedDate,
  handleEditEvent,
  handleDeleteEvent
}: EventsListProps) {
  // Function to get the week's events
  const getWeekEvents = (events: CalendarEvent[], date: Date) => {
    // Get the start and end of the week
    const start = startOfWeek(date, { locale: ptBR });
    const end = endOfWeek(date, { locale: ptBR });
    
    // Return events that fall within the week
    return events.filter(event => 
      isWithinInterval(new Date(event.date), { 
        start, 
        end 
      })
    );
  };

  // Group events by day for the selected week
  const groupEventsByDay = (events: CalendarEvent[], date: Date) => {
    const start = startOfWeek(date, { locale: ptBR });
    const end = endOfWeek(date, { locale: ptBR });
    
    // Get all days of the week
    const daysOfWeek = eachDayOfInterval({ start, end });
    
    // Create an object with days as keys and events arrays as values
    const groupedEvents: Record<string, CalendarEvent[]> = {};
    
    daysOfWeek.forEach(day => {
      const formattedDay = format(day, 'EEEE, d MMMM', { locale: ptBR });
      const eventsOnDay = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === day.getDate() && 
               eventDate.getMonth() === day.getMonth() && 
               eventDate.getFullYear() === day.getFullYear();
      });
      
      // Only add days that have events
      if (eventsOnDay.length > 0) {
        groupedEvents[formattedDay] = eventsOnDay;
      }
    });
    
    return groupedEvents;
  };

  if (!selectedDate) return null;
  
  // For the current day's events
  const hasEventsToday = eventsForSelectedDate.length > 0;
  
  // For the week's events
  const weekEvents = getWeekEvents(eventsForSelectedDate, selectedDate);
  const hasEventsThisWeek = weekEvents.length > 0;
  const groupedWeekEvents = groupEventsByDay(weekEvents, selectedDate);

  return (
    <div className="flex-1 overflow-auto">
      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-sm">
            {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </h3>
          {hasEventsToday ? (
            <div className="mt-2 space-y-2">
              {eventsForSelectedDate.map(event => (
                <EventItem
                  key={event.id}
                  event={event}
                  onEdit={() => handleEditEvent(event)}
                  onDelete={() => handleDeleteEvent(event.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mt-2">
              Nenhum evento programado para este dia.
            </p>
          )}
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-medium text-sm">Eventos da Semana</h3>
          {hasEventsThisWeek ? (
            <div className="mt-2 space-y-4">
              {Object.entries(groupedWeekEvents).map(([day, events]) => (
                <div key={day} className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground">{day}</h4>
                  {events.map(event => (
                    <EventItem
                      key={event.id}
                      event={event}
                      onEdit={() => handleEditEvent(event)}
                      onDelete={() => handleDeleteEvent(event.id)}
                      compact
                    />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mt-2">
              Nenhum evento programado para esta semana.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
