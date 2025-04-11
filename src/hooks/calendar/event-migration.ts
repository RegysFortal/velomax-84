
import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent } from './event-types';

export const migrateLocalEventsToSupabase = async (
  localEvents: CalendarEvent[],
  user: any
) => {
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
