
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from 'lucide-react';
import { CalendarEvent } from '@/hooks/calendar/event-types';

interface EventDialogHeaderProps {
  selectedEvent: CalendarEvent | undefined;
}

export function EventDialogHeader({ selectedEvent }: EventDialogHeaderProps) {
  return (
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2">
        <Calendar className="h-5 w-5" />
        {selectedEvent ? 'Editar Evento' : 'Novo Evento'}
      </DialogTitle>
    </DialogHeader>
  );
}
