
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EventItem } from './EventItem';
import { CalendarEvent } from '@/hooks/useCalendarEvents';

interface EventsListProps {
  selectedDate: Date | undefined;
  eventsForSelectedDate: CalendarEvent[];
  handleNewEvent: () => void;
  handleEditEvent: (event: CalendarEvent) => void;
  handleDeleteEvent: (id: string) => Promise<void>;
}

export function EventsList({
  selectedDate,
  eventsForSelectedDate,
  handleNewEvent,
  handleEditEvent,
  handleDeleteEvent
}: EventsListProps) {
  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">
          {selectedDate ? (
            <span>
              Eventos em {selectedDate.getDate()}/
              {selectedDate.getMonth() + 1}/
              {selectedDate.getFullYear()}
            </span>
          ) : 'Nenhuma data selecionada'}
        </h3>
        {selectedDate && (
          <Button size="sm" variant="outline" onClick={handleNewEvent}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar
          </Button>
        )}
      </div>
      
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {eventsForSelectedDate.length > 0 ? (
          eventsForSelectedDate.map(event => (
            <EventItem 
              key={event.id} 
              event={event}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
            />
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            Nenhum evento encontrado para esta data.
          </p>
        )}
      </div>
    </div>
  );
}
