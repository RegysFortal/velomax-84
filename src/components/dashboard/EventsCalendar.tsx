
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash, Repeat } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { addDays, addWeeks, addMonths, addYears, format } from 'date-fns';

// Event types with corresponding colors
const EVENT_TYPES = {
  'birthday': { label: 'Aniversário', color: 'bg-pink-500' },
  'delivery': { label: 'Entrega', color: 'bg-blue-500' },
  'holiday': { label: 'Feriado', color: 'bg-purple-500' },
  'meeting': { label: 'Reunião', color: 'bg-amber-500' },
  'other': { label: 'Outro', color: 'bg-gray-500' }
};

// Recurrence types
const RECURRENCE_TYPES = {
  'none': { label: 'Sem repetição', getValue: (date: Date) => null },
  'daily': { label: 'Diariamente', getValue: (date: Date) => addDays(date, 1) },
  'weekly': { label: 'Semanalmente', getValue: (date: Date) => addWeeks(date, 1) },
  'monthly': { label: 'Mensalmente', getValue: (date: Date) => addMonths(date, 1) },
  'yearly': { label: 'Anualmente', getValue: (date: Date) => addYears(date, 1) }
};

type EventType = keyof typeof EVENT_TYPES;
type RecurrenceType = keyof typeof RECURRENCE_TYPES;

interface Event {
  id: string;
  date: Date;
  title: string;
  type: EventType;
  description?: string;
  recurrence?: RecurrenceType;
  recurrenceEndDate?: Date;
}

export function EventsCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    date: new Date(),
    type: 'other',
    recurrence: 'none'
  });
  const { toast } = useToast();

  // Load events from localStorage when component mounts
  useEffect(() => {
    const storedEvents = localStorage.getItem('velomax_calendar_events');
    if (storedEvents) {
      try {
        // Need to convert string dates back to Date objects
        const parsedEvents = JSON.parse(storedEvents, (key, value) => {
          if (key === 'date' || key === 'recurrenceEndDate') {
            return new Date(value);
          }
          return value;
        });
        setEvents(parsedEvents);
      } catch (error) {
        console.error('Error parsing stored events:', error);
        toast({
          title: "Erro ao carregar eventos",
          description: "Não foi possível carregar os eventos salvos",
          variant: "destructive"
        });
      }
    } else {
      // Default events if nothing in storage
      setEvents([
        { id: '1', date: new Date(), title: 'Reunião com Cliente', type: 'meeting', description: 'Reunião com cliente ABC para discutir próximas entregas', recurrence: 'none' },
        { id: '2', date: new Date(new Date().setDate(new Date().getDate() + 2)), title: 'Aniversário João', type: 'birthday', description: 'Aniversário do motorista João', recurrence: 'yearly' },
        { id: '3', date: new Date(new Date().setDate(new Date().getDate() + 5)), title: 'Feriado Municipal', type: 'holiday', recurrence: 'yearly' },
      ]);
    }
  }, [toast]);

  // Save events to localStorage whenever they change
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem('velomax_calendar_events', JSON.stringify(events));
    }
  }, [events]);

  // Filter events for the selected date
  const eventsForSelectedDate = selectedDate 
    ? events.filter(event => 
        event.date.getDate() === selectedDate.getDate() && 
        event.date.getMonth() === selectedDate.getMonth() && 
        event.date.getFullYear() === selectedDate.getFullYear())
    : [];

  // Function to highlight dates with events
  const isDayWithEvent = (day: Date) => {
    return events.some(event => 
      event.date.getDate() === day.getDate() && 
      event.date.getMonth() === day.getMonth() && 
      event.date.getFullYear() === day.getFullYear()
    );
  };

  // Open the dialog for creating a new event
  const handleNewEvent = () => {
    setIsEditMode(false);
    setCurrentEventId(null);
    setNewEvent({
      date: selectedDate || new Date(),
      type: 'other',
      recurrence: 'none'
    });
    setIsDialogOpen(true);
  };

  // Open the dialog for editing an existing event
  const handleEditEvent = (event: Event) => {
    setIsEditMode(true);
    setCurrentEventId(event.id);
    setNewEvent({
      ...event,
      date: new Date(event.date)
    });
    setIsDialogOpen(true);
  };

  // Delete an event
  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
    toast({
      title: "Evento excluído",
      description: "O evento foi excluído com sucesso"
    });
  };

  // Add a new event or update an existing one
  const handleSaveEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.type) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    if (isEditMode && currentEventId) {
      // Update existing event
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === currentEventId 
            ? { 
                ...event, 
                ...newEvent, 
                date: newEvent.date as Date,
                type: newEvent.type as EventType,
                recurrence: newEvent.recurrence as RecurrenceType
              } 
            : event
        )
      );
      toast({
        title: "Evento atualizado",
        description: "O evento foi atualizado com sucesso"
      });
    } else {
      // Add new event
      const event: Event = {
        id: Date.now().toString(),
        date: newEvent.date!,
        title: newEvent.title!,
        type: newEvent.type as EventType,
        description: newEvent.description,
        recurrence: newEvent.recurrence as RecurrenceType,
        recurrenceEndDate: newEvent.recurrenceEndDate
      };

      setEvents([...events, event]);
      toast({
        title: "Evento adicionado",
        description: "O evento foi adicionado com sucesso"
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  // Reset the form
  const resetForm = () => {
    setNewEvent({
      date: selectedDate || new Date(),
      type: 'other',
      recurrence: 'none'
    });
    setIsEditMode(false);
    setCurrentEventId(null);
  };

  // Handle recurrence type change
  const handleRecurrenceChange = (recurrence: RecurrenceType) => {
    setNewEvent({
      ...newEvent,
      recurrence,
      recurrenceEndDate: recurrence !== 'none' ? 
        addMonths(newEvent.date || new Date(), 6) : undefined
    });
  };

  return (
    <Card className="col-span-12 lg:col-span-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Calendário de Eventos</CardTitle>
            <CardDescription>Aniversários, Entregas, Feriados e mais</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="shrink-0" onClick={handleNewEvent}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Evento
              </Button>
            </DialogTrigger>
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
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleSaveEvent}>{isEditMode ? 'Atualizar' : 'Adicionar'}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border w-full"
              locale={ptBR}
              modifiersClassNames={{
                selected: "bg-primary text-primary-foreground",
                today: "bg-secondary text-secondary-foreground"
              }}
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
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">
                {selectedDate ? (
                  <span>
                    Eventos em {selectedDate.getDate()}/
                    {selectedDate.getMonth() + 1}/
                    {selectedDate.getFullYear()}
                  </span>
                ) : 'Nenhuma data selecionada'}
              </h3>
              {selectedDate && (
                <Button size="sm" variant="outline" onClick={handleNewEvent}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar
                </Button>
              )}
            </div>
            
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {eventsForSelectedDate.length > 0 ? (
                eventsForSelectedDate.map(event => (
                  <div key={event.id} className="p-3 border rounded-md">
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
                        onClick={() => handleEditEvent(event)}
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
                            <AlertDialogAction onClick={() => handleDeleteEvent(event.id)}>
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhum evento encontrado para esta data.
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between flex-wrap gap-2">
        <div className="flex flex-wrap gap-2">
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
      </CardFooter>
    </Card>
  );
}
