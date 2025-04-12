
import React from 'react';
import { CalendarEvent } from '@/hooks/useCalendarEvents';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const eventTypeColors = {
  birthday: "bg-pink-500 hover:bg-pink-600",
  delivery: "bg-blue-500 hover:bg-blue-600",
  holiday: "bg-green-500 hover:bg-green-600",
  meeting: "bg-purple-500 hover:bg-purple-600",
  reminder: "bg-orange-500 hover:bg-orange-600",
  other: "bg-gray-500 hover:bg-gray-600",
};

const getEventTypeLabel = (type: string) => {
  switch (type) {
    case 'birthday': return 'Aniversário';
    case 'delivery': return 'Entrega';
    case 'holiday': return 'Feriado';
    case 'meeting': return 'Reunião';
    case 'reminder': return 'Lembrete';
    case 'other': return 'Outro';
    default: return type;
  }
};

interface EventItemProps {
  event: CalendarEvent;
  onEdit: () => void;
  onDelete: () => void;
  compact?: boolean;
}

export function EventItem({ event, onEdit, onDelete, compact = false }: EventItemProps) {
  const eventColor = (eventTypeColors as any)[event.type] || eventTypeColors.other;
  const typeLabel = getEventTypeLabel(event.type);
  
  if (compact) {
    return (
      <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
        <div className="flex flex-1 items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${eventColor.split(' ')[0]}`} />
          <span className="text-xs font-medium truncate">{event.title}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={onEdit}>
            <Pencil className="h-3 w-3" />
          </Button>
          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={onDelete}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Badge className={eventColor}>{typeLabel}</Badge>
              {event.recurrence !== 'none' && (
                <Badge variant="outline">Recorrente</Badge>
              )}
            </div>
            <h4 className="font-semibold">{event.title}</h4>
            <div className="flex flex-col text-xs text-muted-foreground">
              <span>
                {format(new Date(event.date), "dd/MM/yyyy", { locale: ptBR })}
                {event.time && ` às ${event.time}`}
              </span>
              {event.location && <span>Local: {event.location}</span>}
            </div>
            {event.description && (
              <p className="text-sm mt-1">{event.description}</p>
            )}
          </div>
          <div className="flex space-x-1">
            <Button size="icon" variant="ghost" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
