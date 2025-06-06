
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Trash, Calendar, Clock } from 'lucide-react';
import { CalendarEvent, EventType, RecurrenceType, EVENT_TYPES, RECURRENCE_TYPES } from '@/hooks/calendar/event-types';
import { Shipment } from '@/types';

interface EventDialogProps {
  showEventDialog: boolean;
  setShowEventDialog: (show: boolean) => void;
  selectedEvent: CalendarEvent | undefined;
  eventTitle: string;
  setEventTitle: (title: string) => void;
  eventType: EventType;
  setEventType: (type: EventType) => void;
  eventDescription: string;
  setEventDescription: (description: string) => void;
  isScheduledDelivery: boolean;
  setIsScheduledDelivery: (isScheduled: boolean) => void;
  scheduledShipmentId: string;
  setScheduledShipmentId: (id: string) => void;
  shipments: Shipment[];
  handleSaveEvent: () => void;
  handleDeleteEvent: () => void;
  resetForm: () => void;
  eventDate: Date | undefined;
  setEventDate: (date: Date | undefined) => void;
  isAllDay: boolean;
  setIsAllDay: (isAllDay: boolean) => void;
  eventTime: string;
  setEventTime: (time: string) => void;
  recurrence: RecurrenceType;
  setRecurrence: (recurrence: RecurrenceType) => void;
}

export function EventDialog({
  showEventDialog,
  setShowEventDialog,
  selectedEvent,
  eventTitle,
  setEventTitle,
  eventType,
  setEventType,
  eventDescription,
  setEventDescription,
  isScheduledDelivery,
  setIsScheduledDelivery,
  scheduledShipmentId,
  setScheduledShipmentId,
  shipments,
  handleSaveEvent,
  handleDeleteEvent,
  resetForm,
  eventDate,
  setEventDate,
  isAllDay,
  setIsAllDay,
  eventTime,
  setEventTime,
  recurrence,
  setRecurrence
}: EventDialogProps) {
  const formatDateForInput = (date: Date | undefined) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (dateString: string) => {
    if (dateString) {
      setEventDate(new Date(dateString));
    } else {
      setEventDate(undefined);
    }
  };

  return (
    <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {selectedEvent ? 'Editar Evento' : 'Novo Evento'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Data do evento */}
          <div className="space-y-2">
            <Label htmlFor="eventDate">Data do evento</Label>
            <Input
              id="eventDate"
              type="date"
              value={formatDateForInput(eventDate)}
              onChange={(e) => handleDateChange(e.target.value)}
            />
          </div>

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
          
          {/* Checkbox para entrega agendada - mantido para compatibilidade */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isScheduledDelivery"
              checked={isScheduledDelivery}
              onCheckedChange={setIsScheduledDelivery}
            />
            <Label htmlFor="isScheduledDelivery" className="text-sm font-normal">
              É uma entrega agendada
            </Label>
          </div>
          
          {isScheduledDelivery && shipments.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="shipment">Embarque</Label>
              <Select 
                value={scheduledShipmentId} 
                onValueChange={setScheduledShipmentId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o embarque" />
                </SelectTrigger>
                <SelectContent>
                  {shipments.map((shipment) => (
                    <SelectItem key={shipment.id} value={shipment.id}>
                      {shipment.trackingNumber} - {shipment.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
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
        </div>
        
        <DialogFooter className="flex justify-between">
          {selectedEvent && (
            <Button 
              variant="destructive" 
              onClick={handleDeleteEvent}
              type="button"
            >
              <Trash className="h-4 w-4 mr-1" />
              Excluir
            </Button>
          )}
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowEventDialog(false);
                resetForm();
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleSaveEvent}>
              {selectedEvent ? (
                <>
                  <Edit className="h-4 w-4 mr-1" />
                  Atualizar
                </>
              ) : 'Salvar'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
