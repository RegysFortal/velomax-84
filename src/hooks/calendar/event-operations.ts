
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CalendarEvent, EventType, RecurrenceType } from './event-types';

export const useEventOperations = (
  events: CalendarEvent[],
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>
) => {
  const { toast } = useToast();
  
  // Add a new event
  const addEvent = async (newEvent: Omit<CalendarEvent, 'id'>) => {
    try {
      // Get current user for user_id field
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Prepare event for Supabase
      const supabaseEvent = {
        title: newEvent.title,
        date: newEvent.date.toISOString(),
        type: newEvent.type,
        description: newEvent.description,
        recurrence: newEvent.recurrence,
        recurrence_end_date: newEvent.recurrenceEndDate?.toISOString(),
        user_id: user.id
      };

      // Insert to Supabase
      const { data, error } = await supabase
        .from('calendar_events')
        .insert(supabaseEvent)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Add to local state with the ID from Supabase
      const createdEvent: CalendarEvent = {
        id: data.id,
        date: new Date(data.date),
        title: data.title,
        type: data.type as EventType,
        description: data.description,
        recurrence: data.recurrence as RecurrenceType,
        recurrenceEndDate: data.recurrence_end_date ? new Date(data.recurrence_end_date) : undefined
      };

      setEvents(prev => [...prev, createdEvent]);
      return createdEvent;
      
    } catch (error) {
      console.error('Error adding event:', error);
      toast({
        title: "Erro ao adicionar evento",
        description: "Não foi possível adicionar o evento. Tente novamente.",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Update an existing event
  const updateEvent = async (id: string, updatedEvent: Partial<CalendarEvent>) => {
    try {
      // Prepare update data for Supabase
      const updateData: any = {};
      if (updatedEvent.title !== undefined) updateData.title = updatedEvent.title;
      if (updatedEvent.date !== undefined) updateData.date = updatedEvent.date.toISOString();
      if (updatedEvent.type !== undefined) updateData.type = updatedEvent.type;
      if (updatedEvent.description !== undefined) updateData.description = updatedEvent.description;
      if (updatedEvent.recurrence !== undefined) updateData.recurrence = updatedEvent.recurrence;
      if (updatedEvent.recurrenceEndDate !== undefined) {
        updateData.recurrence_end_date = updatedEvent.recurrenceEndDate?.toISOString();
      }
      updateData.updated_at = new Date().toISOString();

      // Update in Supabase
      const { error } = await supabase
        .from('calendar_events')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      // Update local state
      setEvents(prev => 
        prev.map(event => 
          event.id === id 
            ? { ...event, ...updatedEvent } 
            : event
        )
      );
      
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        title: "Erro ao atualizar evento",
        description: "Não foi possível atualizar o evento. Tente novamente.",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Delete an event
  const deleteEvent = async (id: string) => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }

      // Update local state
      setEvents(prev => prev.filter(event => event.id !== id));
      
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Erro ao excluir evento",
        description: "Não foi possível excluir o evento. Tente novamente.",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  return {
    addEvent,
    updateEvent,
    deleteEvent
  };
};
