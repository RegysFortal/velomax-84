
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useCalendarEvents, CalendarEvent, RecurrenceType } from '@/hooks/useCalendarEvents';
import { useAuth } from '@/contexts/auth/AuthContext';
import { EventDialog } from './calendar/EventDialog';
import { EventsList } from './calendar/EventsList';
import { EventCalendarView } from './calendar/EventCalendarView';
import { EventLegend } from './calendar/EventLegend';

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
            <EventDialog 
              isEditMode={isEditMode}
              newEvent={newEvent}
              setNewEvent={setNewEvent}
              handleSaveEvent={handleSaveEvent}
              handleRecurrenceChange={handleRecurrenceChange}
            />
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <EventCalendarView 
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            isDayWithEvent={isDayWithEvent}
          />
          <EventsList 
            selectedDate={selectedDate}
            eventsForSelectedDate={eventsForSelectedDate}
            handleNewEvent={handleNewEvent}
            handleEditEvent={handleEditEvent}
            handleDeleteEvent={handleDeleteEvent}
          />
        </div>
      </CardContent>
      <CardFooter>
        <EventLegend />
      </CardFooter>
    </Card>
  );
}
