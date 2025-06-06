
import { CalendarEvent } from '@/hooks/useCalendarEvents';
import { EventType, RecurrenceType } from '@/hooks/calendar/event-types';
import { useToast } from '@/hooks/use-toast';
import { useDateUtils } from './useDateUtils';

export const useEventOperations = (
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void,
  updateEvent: (id: string, event: Partial<CalendarEvent>) => void,
  deleteEvent: (id: string) => void
) => {
  const { toast } = useToast();
  const { createNormalizedDate } = useDateUtils();

  const saveEvent = (
    selectedEvent: CalendarEvent | undefined,
    eventData: {
      eventDate: Date | undefined;
      eventTitle: string;
      eventType: EventType;
      eventDescription: string;
      isScheduledDelivery: boolean;
      scheduledShipmentId: string;
      isAllDay: boolean;
      eventTime: string;
      recurrence: RecurrenceType;
    }
  ) => {
    const {
      eventDate,
      eventTitle,
      eventType,
      eventDescription,
      isScheduledDelivery,
      scheduledShipmentId,
      isAllDay,
      eventTime,
      recurrence
    } = eventData;

    if (!eventDate) {
      toast({
        title: "Erro",
        description: "A data do evento é obrigatória.",
        variant: "destructive"
      });
      return false;
    }

    if (!eventTitle.trim()) {
      toast({
        title: "Erro",
        description: "O título do evento é obrigatório.",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      // Ensure we're using a normalized date at noon to avoid timezone issues
      const normalizedEventDate = createNormalizedDate(eventDate);
      
      const eventDataToSave = {
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
        updateEvent(selectedEvent.id, eventDataToSave);
        toast({
          title: "Evento atualizado",
          description: "O evento foi atualizado com sucesso."
        });
      } else {
        addEvent(eventDataToSave);
        toast({
          title: "Evento criado",
          description: "O evento foi criado com sucesso."
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o evento.",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleDeleteEvent = (selectedEvent: CalendarEvent | undefined) => {
    if (!selectedEvent) return false;
    
    try {
      deleteEvent(selectedEvent.id);
      toast({
        title: "Evento excluído",
        description: "O evento foi excluído com sucesso."
      });
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o evento.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    saveEvent,
    handleDeleteEvent
  };
};
