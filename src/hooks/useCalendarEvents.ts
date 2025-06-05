
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CalendarEvent, EventType, RECURRENCE_TYPES } from './calendar/event-types';

export type { CalendarEvent, EventType, RECURRENCE_TYPES };

export const useCalendarEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load events from Supabase
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('calendar_events')
          .select('*')
          .order('date', { ascending: true });
        
        if (error) {
          throw error;
        }
        
        const mappedEvents = data.map((event: any): CalendarEvent => ({
          id: event.id,
          title: event.title,
          date: new Date(event.date),
          type: event.type as EventType,
          description: event.description || undefined,
          recurrence: event.recurrence as keyof typeof RECURRENCE_TYPES || undefined,
          recurrenceEndDate: event.recurrence_end_date ? new Date(event.recurrence_end_date) : undefined,
        }));
        
        setEvents(mappedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast({
          title: "Erro ao carregar eventos",
          description: "Usando dados locais como fallback.",
          variant: "destructive"
        });
        
        // Load from localStorage as fallback
        const storedEvents = localStorage.getItem('velomax_calendar_events');
        if (storedEvents) {
          try {
            const parsed = JSON.parse(storedEvents);
            const mappedEvents = parsed.map((event: any) => ({
              ...event,
              date: new Date(event.date),
              recurrenceEndDate: event.recurrenceEndDate ? new Date(event.recurrenceEndDate) : undefined
            }));
            setEvents(mappedEvents);
          } catch (error) {
            console.error('Failed to parse stored events', error);
            setEvents([]);
          }
        } else {
          setEvents([]);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [toast]);

  // Save events to localStorage as backup whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('velomax_calendar_events', JSON.stringify(events));
    }
  }, [events, loading]);

  const addEvent = async (eventData: Omit<CalendarEvent, 'id'>) => {
    try {
      // Get current user for user_id field
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('calendar_events')
        .insert({
          title: eventData.title,
          date: eventData.date.toISOString(),
          type: eventData.type,
          description: eventData.description,
          recurrence: eventData.recurrence,
          recurrence_end_date: eventData.recurrenceEndDate?.toISOString(),
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      const newEvent: CalendarEvent = {
        id: data.id,
        title: data.title,
        date: new Date(data.date),
        type: data.type as EventType,
        description: data.description,
        recurrence: data.recurrence as keyof typeof RECURRENCE_TYPES,
        recurrenceEndDate: data.recurrence_end_date ? new Date(data.recurrence_end_date) : undefined,
      };

      setEvents(prev => [...prev, newEvent]);
      
      toast({
        title: "Evento criado",
        description: "O evento foi criado com sucesso."
      });
    } catch (error) {
      console.error('Error adding event:', error);
      toast({
        title: "Erro ao criar evento",
        description: "Não foi possível criar o evento. Tente novamente.",
        variant: "destructive"
      });
      
      // Add to local state as fallback
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        ...eventData
      };
      setEvents(prev => [...prev, newEvent]);
    }
  };

  const updateEvent = async (id: string, updates: Partial<CalendarEvent>) => {
    try {
      const updateData: any = {};
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.type !== undefined) updateData.type = updates.type;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.recurrence !== undefined) updateData.recurrence = updates.recurrence;
      if (updates.date !== undefined) updateData.date = updates.date.toISOString();
      if (updates.recurrenceEndDate !== undefined) {
        updateData.recurrence_end_date = updates.recurrenceEndDate?.toISOString();
      }

      const { error } = await supabase
        .from('calendar_events')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      setEvents(prev => 
        prev.map(event => 
          event.id === id 
            ? { ...event, ...updates }
            : event
        )
      );
      
      toast({
        title: "Evento atualizado",
        description: "O evento foi atualizado com sucesso."
      });
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        title: "Erro ao atualizar evento",
        description: "Não foi possível atualizar o evento. Tente novamente.",
        variant: "destructive"
      });
      
      // Update local state as fallback
      setEvents(prev => 
        prev.map(event => 
          event.id === id 
            ? { ...event, ...updates }
            : event
        )
      );
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEvents(prev => prev.filter(event => event.id !== id));
      
      toast({
        title: "Evento excluído",
        description: "O evento foi excluído com sucesso."
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Erro ao excluir evento",
        description: "Não foi possível excluir o evento. Tente novamente.",
        variant: "destructive"
      });
      
      // Delete from local state as fallback
      setEvents(prev => prev.filter(event => event.id !== id));
    }
  };

  return {
    events,
    loading,
    addEvent,
    updateEvent,
    deleteEvent
  };
};
