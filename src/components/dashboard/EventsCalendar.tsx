import { useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Delivery, Shipment } from '@/types';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCalendarEvents, EVENT_TYPES, CalendarEvent, EventType } from '@/hooks/useCalendarEvents';
import { Plus, Edit, Trash } from 'lucide-react';

interface EventsCalendarProps {
  deliveries: Delivery[];
  shipments?: Shipment[];
}

export const EventsCalendar = ({
  deliveries,
  shipments = []
}: EventsCalendarProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { events, loading, addEvent, updateEvent, deleteEvent } = useCalendarEvents();
  
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>(undefined);
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState<EventType>('other');
  const [eventDescription, setEventDescription] = useState('');
  
  const calendarData = useMemo(() => {
    const eventsMap = new Map<string, { events: CalendarEvent[], deliveries: number }>();
    
    events.forEach(event => {
      try {
        if (!event.date) return;
        
        const dateKey = format(event.date, 'yyyy-MM-dd');
        const existing = eventsMap.get(dateKey) || { events: [], deliveries: 0 };
        existing.events.push(event);
        eventsMap.set(dateKey, existing);
      } catch (error) {
        console.error('Error processing event date:', error);
      }
    });
    
    deliveries.forEach(delivery => {
      try {
        if (!delivery.deliveryDate) return;
        
        const deliveryDate = parseISO(delivery.deliveryDate);
        if (!isValid(deliveryDate)) return;
        
        const dateKey = format(deliveryDate, 'yyyy-MM-dd');
        const existing = eventsMap.get(dateKey) || { events: [], deliveries: 0 };
        eventsMap.set(dateKey, { ...existing, deliveries: existing.deliveries + 1 });
      } catch (error) {
        console.error('Error processing delivery date:', error);
      }
    });
    
    return eventsMap;
  }, [deliveries, events]);
  
  const modifierDates = useMemo(() => {
    const modifiers = {
      delivery: [] as Date[],
      event: [] as Date[]
    };
    
    Array.from(calendarData.entries()).forEach(([dateStr, data]) => {
      const date = parseISO(dateStr);
      if (data.events.length > 0) {
        modifiers.event.push(date);
      } else if (data.deliveries > 0) {
        modifiers.delivery.push(date);
      }
    });
    
    return modifiers;
  }, [calendarData]);
  
  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const eventsForDate = calendarData.get(dateStr);
    
    setSelectedDate(date);
    
    if (eventsForDate?.events.length === 1) {
      const event = eventsForDate.events[0];
      setSelectedEvent(event);
      setEventTitle(event.title);
      setEventType(event.type);
      setEventDescription(event.description || '');
      setShowEventDialog(true);
    } else {
      setSelectedEvent(undefined);
      setEventTitle('');
      setEventType('other');
      setEventDescription('');
      setShowEventDialog(true);
    }
  };
  
  const handleSaveEvent = () => {
    if (!selectedDate) return;
    
    try {
      if (!eventTitle.trim()) {
        toast({
          title: "Erro",
          description: "O título do evento é obrigatório.",
          variant: "destructive"
        });
        return;
      }
      
      if (selectedEvent) {
        updateEvent({
          ...selectedEvent,
          title: eventTitle,
          type: eventType,
          description: eventDescription
        });
        toast({
          title: "Evento atualizado",
          description: "O evento foi atualizado com sucesso."
        });
      } else {
        addEvent({
          date: selectedDate,
          title: eventTitle,
          type: eventType,
          description: eventDescription || undefined
        });
        toast({
          title: "Evento criado",
          description: "O evento foi criado com sucesso."
        });
      }
      
      setShowEventDialog(false);
      resetForm();
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o evento.",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteEvent = () => {
    if (!selectedEvent) return;
    
    try {
      deleteEvent(selectedEvent.id);
      toast({
        title: "Evento excluído",
        description: "O evento foi excluído com sucesso."
      });
      setShowEventDialog(false);
      resetForm();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o evento.",
        variant: "destructive"
      });
    }
  };
  
  const resetForm = () => {
    setSelectedEvent(undefined);
    setEventTitle('');
    setEventType('other');
    setEventDescription('');
  };
  
  const modifierStyles = {
    delivery: { backgroundColor: '#10b981', color: 'white', borderRadius: '100%' },
    event: { backgroundColor: '#3b82f6', color: 'white', borderRadius: '100%' }
  };
  
  return (
    <>
      <Card className="col-span-2 lg:col-span-3">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Calendário de Eventos</CardTitle>
          <Button size="sm" variant="outline" onClick={() => {
            setSelectedDate(new Date());
            setShowEventDialog(true);
          }}>
            <Plus className="h-4 w-4 mr-1" />
            Novo Evento
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <Calendar
              mode="single"
              onSelect={handleSelect}
              modifiers={modifierDates}
              modifiersStyles={modifierStyles}
              className="w-full rounded-md border p-2"
              locale={ptBR}
            />
            <div className="mt-4 flex items-center justify-center gap-4 text-sm flex-wrap">
              <div className="flex items-center">
                <div className="mr-1 h-3 w-3 rounded-full bg-blue-500" />
                <span>Eventos</span>
              </div>
              <div className="flex items-center">
                <div className="mr-1 h-3 w-3 rounded-full bg-green-500" />
                <span>Entregas</span>
              </div>
              {Object.entries(EVENT_TYPES).map(([key, value]) => (
                <div key={key} className="flex items-center">
                  <div className={`mr-1 h-3 w-3 rounded-full ${value.color}`} />
                  <span>{value.label}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
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
    </>
  );
};
