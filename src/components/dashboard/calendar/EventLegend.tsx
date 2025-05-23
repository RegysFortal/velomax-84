
import React from 'react';
import { Repeat } from 'lucide-react';
import { EVENT_TYPES } from '@/hooks/calendar/event-types';

export function EventLegend() {
  return (
    <div className="border-t pt-4 flex justify-between flex-wrap gap-2">
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-1 text-sm">
          <span className="bg-green-500 w-3 h-3 rounded-full inline-block"></span>
          <span>Entrega Agendada</span>
        </div>
        {Object.entries(EVENT_TYPES).map(([key, value]) => (
          <div key={key} className="flex items-center gap-1 text-sm">
            <span className={`${value.color} w-3 h-3 rounded-full inline-block`}></span>
            <span>{value.label}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 text-sm">
        <Repeat size={14} className="text-muted-foreground" />
        <span>Evento recorrente</span>
      </div>
    </div>
  );
}
