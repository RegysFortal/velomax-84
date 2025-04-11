
import React from 'react';
import { format } from 'date-fns';
import { PlusCircle } from 'lucide-react';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { ptBR } from 'date-fns/locale';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarEvent, EVENT_TYPES, RECURRENCE_TYPES, EventType, RecurrenceType } from '@/hooks/useCalendarEvents';

interface EventDialogProps {
  isEditMode: boolean;
  newEvent: Partial<CalendarEvent>;
  setNewEvent: React.Dispatch<React.SetStateAction<Partial<CalendarEvent>>>;
  handleSaveEvent: () => Promise<void>;
  handleRecurrenceChange: (recurrence: RecurrenceType) => void;
}

export function EventDialog({
  isEditMode,
  newEvent,
  setNewEvent,
  handleSaveEvent,
  handleRecurrenceChange
}: EventDialogProps) {
  // Helper function to add months to a date
  const addMonths = (date: Date, months: number) => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{isEditMode ? 'Editar Evento' : 'Adicionar Novo Evento'}</DialogTitle>
      </DialogHeader>
      <ScrollArea className="max-h-[60vh] pr-3">
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="event-title">Título do Evento</Label>
            <Input 
              id="event-title" 
              value={newEvent.title || ''} 
              onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              placeholder="Ex: Reunião com cliente" 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="event-type">Tipo de Evento</Label>
            <Select 
              value={newEvent.type} 
              onValueChange={(value: EventType) => setNewEvent({...newEvent, type: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de evento" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(EVENT_TYPES).map(([key, value]) => (
                  <SelectItem key={key} value={key}>{value.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Data do Evento</Label>
            <Calendar
              mode="single"
              selected={newEvent.date}
              onSelect={(date) => setNewEvent({...newEvent, date})}
              locale={ptBR}
              className="rounded-md border mx-auto"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="event-recurrence">Repetição</Label>
            <RadioGroup 
              value={newEvent.recurrence || 'none'} 
              onValueChange={(value: RecurrenceType) => handleRecurrenceChange(value)}
            >
              {Object.entries(RECURRENCE_TYPES).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <RadioGroupItem value={key} id={`recurrence-${key}`} />
                  <Label htmlFor={`recurrence-${key}`}>{value.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          {newEvent.recurrence && newEvent.recurrence !== 'none' && (
            <div className="grid gap-2">
              <Label>Data Final da Repetição (opcional)</Label>
              <Calendar
                mode="single"
                selected={newEvent.recurrenceEndDate}
                onSelect={(date) => setNewEvent({...newEvent, recurrenceEndDate: date})}
                locale={ptBR}
                disabled={(date) => date < (newEvent.date || new Date())}
                className="rounded-md border mx-auto"
              />
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="event-description">Descrição (opcional)</Label>
            <Input 
              id="event-description" 
              value={newEvent.description || ''} 
              onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
              placeholder="Descrição do evento" 
            />
          </div>
        </div>
      </ScrollArea>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancelar</Button>
        </DialogClose>
        <Button onClick={handleSaveEvent}>{isEditMode ? 'Atualizar' : 'Adicionar'}</Button>
      </DialogFooter>
    </DialogContent>
  );
}
