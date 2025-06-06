
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { CalendarEvent, EventType, RecurrenceType } from '@/hooks/calendar/event-types';
import { Shipment } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EventDialogHeader } from './dialog/EventDialogHeader';
import { EventDialogFooter } from './dialog/EventDialogFooter';
import { EventDateField } from './dialog/EventDateField';
import { EventFormFields } from './dialog/EventFormFields';
import { DeliveryFields } from './dialog/DeliveryFields';

interface EventDialogProps {
  showEventDialog: boolean;
  setShowEventDialog: (show: boolean) => void;
  selectedEvent: CalendarEvent | undefined;
  eventTitle: string;
  setEventTitle: (title: string) => void;
  eventType: EventType;
  setEventType: (type: EventType) => void;
  eventDescription: string;
  setEventDescription: (description: string) => void;
  isScheduledDelivery: boolean;
  setIsScheduledDelivery: (isScheduled: boolean) => void;
  scheduledShipmentId: string;
  setScheduledShipmentId: (id: string) => void;
  shipments: Shipment[];
  handleSaveEvent: () => void;
  handleDeleteEvent: () => void;
  resetForm: () => void;
  eventDate: Date | undefined;
  setEventDate: (date: Date | undefined) => void;
  isAllDay: boolean;
  setIsAllDay: (isAllDay: boolean) => void;
  eventTime: string;
  setEventTime: (time: string) => void;
  recurrence: RecurrenceType;
  setRecurrence: (recurrence: RecurrenceType) => void;
}

export function EventDialog({
  showEventDialog,
  setShowEventDialog,
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
  shipments,
  handleSaveEvent,
  handleDeleteEvent,
  resetForm,
  eventDate,
  setEventDate,
  isAllDay,
  setIsAllDay,
  eventTime,
  setEventTime,
  recurrence,
  setRecurrence
}: EventDialogProps) {
  return (
    <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col">
        <EventDialogHeader selectedEvent={selectedEvent} />
        
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4 py-4">
            <EventDateField 
              eventDate={eventDate}
              setEventDate={setEventDate}
            />

            <EventFormFields
              eventTitle={eventTitle}
              setEventTitle={setEventTitle}
              eventType={eventType}
              setEventType={setEventType}
              eventDescription={eventDescription}
              setEventDescription={setEventDescription}
              isAllDay={isAllDay}
              setIsAllDay={setIsAllDay}
              eventTime={eventTime}
              setEventTime={setEventTime}
              recurrence={recurrence}
              setRecurrence={setRecurrence}
            />
            
            <DeliveryFields
              isScheduledDelivery={isScheduledDelivery}
              setIsScheduledDelivery={setIsScheduledDelivery}
              scheduledShipmentId={scheduledShipmentId}
              setScheduledShipmentId={setScheduledShipmentId}
              shipments={shipments}
            />
          </div>
        </ScrollArea>
        
        <EventDialogFooter
          selectedEvent={selectedEvent}
          handleDeleteEvent={handleDeleteEvent}
          handleSaveEvent={handleSaveEvent}
          setShowEventDialog={setShowEventDialog}
          resetForm={resetForm}
        />
      </DialogContent>
    </Dialog>
  );
}
