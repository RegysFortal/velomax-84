
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash } from 'lucide-react';
import { CalendarEvent, EventType, EVENT_TYPES } from '@/hooks/useCalendarEvents';
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
  resetForm
}: EventDialogProps) {
  return (
    <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {selectedEvent ? 'Editar Evento' : 'Novo Evento'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="Digite o título do evento"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Evento</Label>
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
                    {value.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isScheduledDelivery"
              checked={isScheduledDelivery}
              onChange={(e) => setIsScheduledDelivery(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
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
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              placeholder="Digite uma descrição (opcional)"
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
