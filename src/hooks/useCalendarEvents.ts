
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth/AuthContext';

// Event types with corresponding colors
export const EVENT_TYPES = {
  'birthday': { label: 'Aniversário', color: 'bg-pink-500' },
  'delivery': { label: 'Entrega', color: 'bg-blue-500' },
  'holiday': { label: 'Feriado', color: 'bg-purple-500' },
  'meeting': { label: 'Reunião', color: 'bg-amber-500' },
  'other': { label: 'Outro', color: 'bg-gray-500' }
};

// Recurrence types
export const RECURRENCE_TYPES = {
  'none': { label: 'Sem repetição', getValue: (date: Date) => null },
  'daily': { label: 'Diariamente', getValue: (date: Date) => addDays(date, 1) },
  'weekly': { label: 'Semanalmente', getValue: (date: Date) => addWeeks(date, 1) },
  'monthly': { label: 'Mensalmente', getValue: (date: Date) => addMonths(date, 1) },
  'yearly': { label: 'Anualmente', getValue: (date: Date) => addYears(date, 1) }
};

import { addDays, addWeeks, addMonths, addYears } from 'date-fns';

export type EventType = keyof typeof EVENT_TYPES;
export type RecurrenceType = keyof typeof RECURRENCE_TYPES;

export interface CalendarEvent {
  id: string;
  date: Date;
  title: string;
  type: EventType;
  description?: string;
  recurrence?: RecurrenceType;
  recurrenceEndDate?: Date;
}

export const useCalendarEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load events from Supabase when component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from Supabase
        const { data, error } = await supabase
          .from('calendar_events')
          .select('*')
          .order('date', { ascending: true });
        
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          // Convert string dates to Date objects
          const parsedEvents = data.map(event => ({
            id: event.id,
            date: new Date(event.date),
            title: event.title,
            type: event.type as EventType,
            description: event.description,
            recurrence: event.recurrence as RecurrenceType,
            recurrenceEndDate: event.recurrence_end_date ? new Date(event.recurrence_end_date) : undefined
          }));
          
          setEvents(parsedEvents);
          console.log("Loaded", parsedEvents.length, "events from Supabase");
        } else {
          // If no events from Supabase, try to load from localStorage
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
              
              // If user is logged in, migrate localStorage events to Supabase
              if (user && parsedEvents.length > 0) {
                migrateLocalEventsToSupabase(parsedEvents);
              }
            } catch (error) {
              console.error('Error parsing stored events:', error);
              setEvents([]);
            }
          } else {
            setEvents([]);
          }
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        toast({
          title: "Erro ao carregar eventos",
          description: "Não foi possível carregar os eventos. Verifique sua conexão.",
          variant: "destructive"
        });
        
        // Try to load from localStorage as fallback
        const storedEvents = localStorage.getItem('velomax_calendar_events');
        if (storedEvents) {
          try {
            const parsedEvents = JSON.parse(storedEvents, (key, value) => {
              if (key === 'date' || key === 'recurrenceEndDate') {
                return new Date(value);
              }
              return value;
            });
            setEvents(parsedEvents);
          } catch (e) {
            console.error('Error parsing stored events:', e);
            setEvents([]);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [toast, user]);

  // Helper function to migrate localStorage events to Supabase
  const migrateLocalEventsToSupabase = async (localEvents: CalendarEvent[]) => {
    if (!user) return;
    
    try {
      // Convert events to Supabase format
      const supabaseEvents = localEvents.map(event => ({
        title: event.title,
        date: event.date.toISOString(),
        type: event.type,
        description: event.description,
        recurrence: event.recurrence,
        recurrence_end_date: event.recurrenceEndDate?.toISOString(),
        user_id: user.id
      }));
      
      // Insert events to Supabase
      const { error } = await supabase.from('calendar_events').insert(supabaseEvents);
      
      if (error) {
        console.error('Error migrating local events to Supabase:', error);
      } else {
        console.log('Successfully migrated', supabaseEvents.length, 'events to Supabase');
        // Clear localStorage after successful migration
        localStorage.removeItem('velomax_calendar_events');
      }
    } catch (error) {
      console.error('Error during migration of events to Supabase:', error);
    }
  };

  // Add a new event
  const addEvent = async (newEvent: Omit<CalendarEvent, 'id'>) => {
    try {
      if (!user) {
        throw new Error('User must be logged in to add events');
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
      if (!user) {
        throw new Error('User must be logged in to update events');
      }

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
      if (!user) {
        throw new Error('User must be logged in to delete events');
      }

      // Delete from Supabase
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', id);

      if (error) {
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
    events,
    loading,
    addEvent,
    updateEvent,
    deleteEvent
  };
};
