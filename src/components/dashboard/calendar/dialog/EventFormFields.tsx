
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock } from 'lucide-react';
import { EventType, RecurrenceType, EVENT_TYPES, RECURRENCE_TYPES } from '@/hooks/calendar/event-types';

interface EventFormFieldsProps {
  eventTitle: string;
  setEventTitle: (title: string) => void;
  eventType: EventType;
  setEventType: (type: EventType) => void;
  eventDescription: string;
  setEventDescription: (description: string) => void;
  isAllDay: boolean;
  setIsAllDay: (isAllDay: boolean) => void;
  eventTime: string;
  setEventTime: (time: string) => void;
  recurrence: RecurrenceType;
  setRecurrence: (recurrence: RecurrenceType) => void;
}

export function EventFormFields({
  eventTitle,
  setEventTitle,
  eventType,
  setEventType,
  eventDescription,
  setEventDescription,
  isAllDay,
  setIsAllDay,
  eventTime,
  setEventTime,
  recurrence,
  setRecurrence
}: EventFormFieldsProps) {
  return (
    <>
      {/* Título */}
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
          placeholder="Digite o título do evento"
        />
      </div>
      
      {/* Tipo de evento */}
      <div className="space-y-2">
        <Label htmlFor="type">Tipo de evento</Label>
        <Select
          value={eventType}
          onValueChange={(value) => setEventType(value as EventType)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(EVENT_TYPES).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${value.color}`} />
                  {value.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Horário */}
      <div className="space-y-3">
        <Label>Horário</Label>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="allDay"
            checked={isAllDay}
            onCheckedChange={setIsAllDay}
          />
          <Label htmlFor="allDay" className="text-sm font-normal">
            Dia inteiro
          </Label>
        </div>
        
        {!isAllDay && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Input
              type="time"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              className="w-32"
            />
          </div>
        )}
      </div>

      {/* Repetição */}
      <div className="space-y-2">
        <Label htmlFor="recurrence">Repetição</Label>
        <Select
          value={recurrence}
          onValueChange={(value) => setRecurrence(value as RecurrenceType)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a repetição" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(RECURRENCE_TYPES).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Descrição */}
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={eventDescription}
          onChange={(e) => setEventDescription(e.target.value)}
          placeholder="Digite uma descrição (opcional)"
          rows={3}
        />
      </div>
    </>
  );
}
