
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { ptBR } from 'date-fns/locale';

interface EventCalendarViewProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  isDayWithEvent: (date: Date) => boolean;
}

export function EventCalendarView({
  selectedDate,
  onSelectDate,
  isDayWithEvent
}: EventCalendarViewProps) {
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
        // Usando apenas isDayWithEvent para marcar dias com eventos
        modifiers={{
          hasEvent: (date) => isDayWithEvent(date)
        }}
        modifiersStyles={{
          hasEvent: { 
            fontWeight: 'bold', 
            textDecoration: 'underline', 
            color: 'var(--primary)' 
          }
        }}
      />
    </div>
  );
}
