
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash, Repeat } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { format } from 'date-fns';
import { useCalendarEvents, EVENT_TYPES, RECURRENCE_TYPES, EventType, RecurrenceType, CalendarEvent } from '@/hooks/useCalendarEvents';
import { useAuth } from '@/contexts/auth/AuthContext';

export function EventsCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    date: new Date(),
    type: 'other',
    recurrence: 'none'
  });
  const { toast } = useToast();
  const { events, loading, addEvent, updateEvent, deleteEvent } = useCalendarEvents();
  const { user } = useAuth();

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
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para adicionar eventos.",
        variant: "destructive"
      });
      return;
    }
    
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
  const handleEditEvent = (event: CalendarEvent) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para editar eventos.",
        variant: "destructive"
      });
      return;
    }
    
    setIsEditMode(true);
    setCurrentEventId(event.id);
    setNewEvent({
      ...event,
      date: new Date(event.date)
    });
    setIsDialogOpen(true);
  };

  // Delete an event
  const handleDeleteEvent = async (id: string) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para excluir eventos.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await deleteEvent(id);
      toast({
        title: "Evento excluído",
        description: "O evento foi excluído com sucesso"
      });
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  // Add a new event or update an existing one
  const handleSaveEvent = async () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para salvar eventos.",
        variant: "destructive"
      });
      return;
    }
    
    if (!newEvent.title || !newEvent.date || !newEvent.type) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isEditMode && currentEventId) {
        // Update existing event
        await updateEvent(currentEventId, newEvent);
        toast({
          title: "Evento atualizado",
          description: "O evento foi atualizado com sucesso"
        });
      } else {
        // Add new event
        await addEvent(newEvent as Omit<CalendarEvent, 'id'>);
        toast({
          title: "Evento adicionado",
          description: "O evento foi adicionado com sucesso"
        });
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving event:', error);
    }
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

  // Helper function to add months to a date
  const addMonths = (date: Date, months: number) => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
  };

  if (loading) {
    return (
      <Card className="col-span-12 lg:col-span-6">
        <CardContent className="flex items-center justify-center h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

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
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
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
