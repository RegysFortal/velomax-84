
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Delivery, Shipment } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { EventDialog } from './calendar/EventDialog';
import { useEventState } from './calendar/hooks/useEventState';
import { EventCalendarSection } from './calendar/EventCalendarSection';
import { EventListSection } from './calendar/EventListSection';

interface EventsCalendarProps {
  deliveries: Delivery[];
  shipments?: Shipment[];
}

export const EventsCalendar = ({
  deliveries,
  shipments = []
}: EventsCalendarProps) => {
  const { events, loading, addEvent, updateEvent, deleteEvent } = useCalendarEvents();
  
  const {
    showEventDialog,
    setShowEventDialog,
    selectedDate,
    selectedEvent,
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
  } = useEventState(events, addEvent, updateEvent, deleteEvent);
  
  const eventsForSelectedDate = getEventsForSelectedDate();
  
  return (
    <>
      <Card className="col-span-2 lg:col-span-3">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Calendário de Eventos</CardTitle>
          <Button size="sm" variant="outline" onClick={handleNewEvent}>
            <Plus className="h-4 w-4 mr-1" />
            Novo Evento
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <EventCalendarSection 
              selectedDate={selectedDate}
              events={events}
              onSelectDate={handleSelect}
            />
            <EventListSection
              selectedDate={selectedDate}
              eventsForSelectedDate={eventsForSelectedDate}
              handleNewEvent={handleNewEvent}
              handleEditEvent={handleEditEvent}
              handleDeleteEvent={deleteEvent}
            />
          </div>
        </CardContent>
      </Card>
      
      <EventDialog
        showEventDialog={showEventDialog}
        setShowEventDialog={setShowEventDialog}
        selectedEvent={selectedEvent}
        eventTitle={eventTitle}
        setEventTitle={setEventTitle}
        eventType={eventType}
        setEventType={setEventType}
        eventDescription={eventDescription}
        setEventDescription={setEventDescription}
        isScheduledDelivery={isScheduledDelivery}
        setIsScheduledDelivery={setIsScheduledDelivery}
        scheduledShipmentId={scheduledShipmentId}
        setScheduledShipmentId={setScheduledShipmentId}
        shipments={shipments}
        handleSaveEvent={handleSaveEvent}
        handleDeleteEvent={handleDeleteEvent}
        resetForm={resetForm}
      />
    </>
  );
};
