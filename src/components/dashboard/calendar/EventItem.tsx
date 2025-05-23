
import React from 'react';
import { CalendarEvent, EVENT_TYPES } from '@/hooks/calendar/event-types';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EventItemProps {
  event: CalendarEvent;
  onEdit: () => void;
  onDelete: () => void;
  compact?: boolean;
}

export function EventItem({ event, onEdit, onDelete, compact = false }: EventItemProps) {
  const eventType = EVENT_TYPES[event.type] || EVENT_TYPES.other;
  
  return (
    <div className={cn(
      "border rounded-md p-2 relative group hover:border-primary/50 transition-colors",
      compact ? "text-xs" : "text-sm"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={cn("w-3 h-3 rounded-full mr-2", eventType.color)} />
          <span className="font-medium">{event.title}</span>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onEdit}>
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onDelete}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      
      {!compact && event.description && (
        <div className="mt-1 text-muted-foreground">
          {event.description}
        </div>
      )}
      
      {!compact && (
        <div className="mt-1 text-xs text-muted-foreground">
          {format(new Date(event.date), 'PPP', { locale: ptBR })}
        </div>
      )}
    </div>
  );
}
