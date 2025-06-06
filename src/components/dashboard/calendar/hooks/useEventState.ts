
import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarEvent } from '@/hooks/useCalendarEvents';
import { EventType, RecurrenceType } from '@/hooks/calendar/event-types';
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
  const [eventDate, setEventDate] = useState<Date | undefined>(new Date());
  const [isAllDay, setIsAllDay] = useState(true);
  const [eventTime, setEventTime] = useState('09:00');
  const [recurrence, setRecurrence] = useState<RecurrenceType>('none');
  
  // Create a normalized date at noon local time to avoid timezone issues
  const createNormalizedDate = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
  };
  
  // Handle selecting a date on the calendar
  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const normalizedSelectedDate = createNormalizedDate(date);
    const dateStr = format(normalizedSelectedDate, 'yyyy-MM-dd');
    
    const eventsForDate = events.filter(event => {
      const eventDate = createNormalizedDate(new Date(event.date));
      return eventDate.toDateString() === normalizedSelectedDate.toDateString();
    });
    
    setSelectedDate(normalizedSelectedDate);
    setEventDate(normalizedSelectedDate);
    
    if (eventsForDate.length === 1) {
      const event = eventsForDate[0];
      setSelectedEvent(event);
      setEventTitle(event.title);
      setEventType(event.type);
      setEventDescription(event.description || '');
      setIsScheduledDelivery(event.isScheduledDelivery || false);
      setScheduledShipmentId(event.scheduledShipmentId || '');
      setIsAllDay(event.isAllDay !== undefined ? event.isAllDay : true);
      setEventTime(event.time || '09:00');
      setRecurrence(event.recurrence || 'none');
      setShowEventDialog(true);
    } else {
      setSelectedEvent(undefined);
      setEventTitle('');
      setEventType('other');
      setEventDescription('');
      setIsScheduledDelivery(false);
      setScheduledShipmentId('');
      setIsAllDay(true);
      setEventTime('09:00');
      setRecurrence('none');
    }
  };
  
  const handleSaveEvent = () => {
    if (!eventDate) {
      toast({
        title: "Erro",
        description: "A data do evento é obrigatória.",
        variant: "destructive"
      });
      return;
    }

    if (!eventTitle.trim()) {
      toast({
        title: "Erro",
        description: "O título do evento é obrigatório.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Ensure we're using a normalized date at noon to avoid timezone issues
      const normalizedEventDate = createNormalizedDate(eventDate);
      
      const eventData = {
        date: normalizedEventDate,
        title: eventTitle,
        type: eventType,
        description: eventDescription || undefined,
        isScheduledDelivery,
        isAllDay,
        time: isAllDay ? undefined : eventTime,
        recurrence,
        ...(isScheduledDelivery && { scheduledShipmentId })
      };

      if (selectedEvent) {
        updateEvent(selectedEvent.id, eventData);
        toast({
          title: "Evento atualizado",
          description: "O evento foi atualizado com sucesso."
        });
      } else {
        addEvent(eventData);
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
    setEventDate(createNormalizedDate(new Date()));
    setIsAllDay(true);
    setEventTime('09:00');
    setRecurrence('none');
  };

  const getEventsForSelectedDate = () => {
    return selectedDate 
      ? events.filter(event => {
          const eventDate = createNormalizedDate(new Date(event.date));
          const selectedDateNormalized = createNormalizedDate(selectedDate);
          return eventDate.toDateString() === selectedDateNormalized.toDateString();
        })
      : [];
  };
    
  const handleEditEvent = (event: CalendarEvent) => {
    const normalizedEventDate = createNormalizedDate(new Date(event.date));
    
    setSelectedEvent(event);
    setEventTitle(event.title);
    setEventType(event.type);
    setEventDescription(event.description || '');
    setIsScheduledDelivery(event.isScheduledDelivery || false);
    setScheduledShipmentId(event.scheduledShipmentId || '');
    setEventDate(normalizedEventDate);
    setIsAllDay(event.isAllDay !== undefined ? event.isAllDay : true);
    setEventTime(event.time || '09:00');
    setRecurrence(event.recurrence || 'none');
    setShowEventDialog(true);
  };

  const handleNewEvent = () => {
    const today = createNormalizedDate(new Date());
    setSelectedDate(today);
    setEventDate(today);
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
    eventDate,
    setEventDate,
    isAllDay,
    setIsAllDay,
    eventTime,
    setEventTime,
    recurrence,
    setRecurrence,
    handleSelect,
    handleSaveEvent,
    handleDeleteEvent,
    resetForm,
    getEventsForSelectedDate,
    handleEditEvent,
    handleNewEvent
  };
};
