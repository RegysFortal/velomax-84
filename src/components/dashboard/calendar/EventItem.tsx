
import React from 'react';
import { format } from 'date-fns';
import { Edit, Trash, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { CalendarEvent, EVENT_TYPES, RECURRENCE_TYPES } from '@/hooks/useCalendarEvents';

interface EventItemProps {
  event: CalendarEvent;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (id: string) => Promise<void>;
}

export function EventItem({ event, onEdit, onDelete }: EventItemProps) {
  const handleDelete = async () => {
    try {
      await onDelete(event.id);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div className="p-3 border rounded-md">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <h4 className="font-medium">{event.title}</h4>
          {event.recurrence && event.recurrence !== 'none' && (
            <Repeat size={14} className="text-muted-foreground" />
          )}
        </div>
        <Badge 
          className={`${EVENT_TYPES[event.type].color} text-white`}
        >
          {EVENT_TYPES[event.type].label}
        </Badge>
      </div>
      {event.description && (
        <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
      )}
      {event.recurrence && event.recurrence !== 'none' && (
        <p className="text-xs text-muted-foreground mb-2">
          Repete: {RECURRENCE_TYPES[event.recurrence].label}
          {event.recurrenceEndDate && (
            <> até {format(event.recurrenceEndDate, 'dd/MM/yyyy')}</>
          )}
        </p>
      )}
      <div className="flex justify-end gap-2 mt-1">
        <Button 
          size="sm" 
          variant="outline" 
          className="h-8 px-2" 
          onClick={() => onEdit(event)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              size="sm" 
              variant="destructive" 
              className="h-8 px-2"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Evento</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
