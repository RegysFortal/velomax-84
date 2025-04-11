
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth/AuthContext';
import { EVENT_TYPES, RECURRENCE_TYPES, CalendarEvent, EventType, RecurrenceType } from './calendar/event-types';
import { useEventOperations } from './calendar/event-operations';
import { migrateLocalEventsToSupabase } from './calendar/event-migration';

export { EVENT_TYPES, RECURRENCE_TYPES, type CalendarEvent, type EventType, type RecurrenceType };

export const useCalendarEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { addEvent, updateEvent, deleteEvent } = useEventOperations(events, setEvents, user);

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
                migrateLocalEventsToSupabase(parsedEvents, user);
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

  return {
    events,
    loading,
    addEvent,
    updateEvent,
    deleteEvent
  };
};
