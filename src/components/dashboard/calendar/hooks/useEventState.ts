
import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarEvent, EventType } from '@/hooks/useCalendarEvents';
import { useToast } from '@/hooks/use-toast';

export const useEventState = (
  events: CalendarEvent[],
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void,
  updateEvent: (id: string, event: Partial<CalendarEvent>) => void,
  deleteEvent: (id: string) => void
) => {
  const { toast } = useToast();
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>(undefined);
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState<EventType>('other');
  const [eventDescription, setEventDescription] = useState('');
  const [isScheduledDelivery, setIsScheduledDelivery] = useState(false);
  const [scheduledShipmentId, setScheduledShipmentId] = useState('');
  
  // Handle selecting a date on the calendar
  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const eventsForDate = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
    
    setSelectedDate(date);
    
    if (eventsForDate.length === 1) {
      const event = eventsForDate[0];
      setSelectedEvent(event);
      setEventTitle(event.title);
      setEventType(event.type);
      setEventDescription(event.description || '');
      setIsScheduledDelivery(event.isScheduledDelivery || false);
      setScheduledShipmentId(event.scheduledShipmentId || '');
      setShowEventDialog(true);
    } else {
      setSelectedEvent(undefined);
      setEventTitle('');
      setEventType('other');
      setEventDescription('');
      setIsScheduledDelivery(false);
      setScheduledShipmentId('');
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
        updateEvent(selectedEvent.id, {
          title: eventTitle,
          type: eventType,
          description: eventDescription,
          isScheduledDelivery,
          ...(isScheduledDelivery && { scheduledShipmentId })
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
          description: eventDescription || undefined,
          isScheduledDelivery,
          ...(isScheduledDelivery && { scheduledShipmentId })
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
    setIsScheduledDelivery(false);
    setScheduledShipmentId('');
  };

  const getEventsForSelectedDate = () => {
    return selectedDate 
      ? events.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate.toDateString() === selectedDate.toDateString();
        })
      : [];
  };
    
  const handleEditEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setEventTitle(event.title);
    setEventType(event.type);
    setEventDescription(event.description || '');
    setIsScheduledDelivery(event.isScheduledDelivery || false);
    setScheduledShipmentId(event.scheduledShipmentId || '');
    setShowEventDialog(true);
  };

  const handleNewEvent = () => {
    setSelectedDate(new Date());
    setShowEventDialog(true);
  };
  
  return {
    showEventDialog,
    setShowEventDialog,
    selectedDate,
    setSelectedDate,
    selectedEvent,
    setSelectedEvent,
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
    handleSelect,
    handleSaveEvent,
    handleDeleteEvent,
    resetForm,
    getEventsForSelectedDate,
    handleEditEvent,
    handleNewEvent
  };
};
