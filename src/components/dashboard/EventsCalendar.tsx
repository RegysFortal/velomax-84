
import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Delivery, Shipment } from '@/types';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EventsCalendarProps {
  deliveries: Delivery[];
  shipments: Shipment[];
}

export const EventsCalendar = ({
  deliveries,
  shipments
}: EventsCalendarProps) => {
  const navigate = useNavigate();
  
  // Prepare calendar data
  const calendarData = useMemo(() => {
    const events = new Map<string, { deliveries: number; shipments: number }>();
    
    // Count deliveries by date
    deliveries.forEach(delivery => {
      try {
        if (!delivery.deliveryDate) return;
        
        const deliveryDate = parseISO(delivery.deliveryDate);
        if (!isValid(deliveryDate)) return;
        
        const dateKey = format(deliveryDate, 'yyyy-MM-dd');
        const existing = events.get(dateKey) || { deliveries: 0, shipments: 0 };
        events.set(dateKey, { ...existing, deliveries: existing.deliveries + 1 });
      } catch (error) {
        console.error('Error processing delivery date:', error);
      }
    });
    
    // Count shipments by arrival date
    shipments.forEach(shipment => {
      try {
        if (!shipment.arrivalDate) return;
        
        const arrivalDate = new Date(shipment.arrivalDate);
        const dateKey = format(arrivalDate, 'yyyy-MM-dd');
        const existing = events.get(dateKey) || { deliveries: 0, shipments: 0 };
        events.set(dateKey, { ...existing, shipments: existing.shipments + 1 });
      } catch (error) {
        console.error('Error processing shipment date:', error);
      }
    });
    
    return events;
  }, [deliveries, shipments]);
  
  // Format the calendar modifier dates 
  const modifierDates = useMemo(() => {
    // Create modifiers object for the Calendar component
    const modifiers = {
      delivery: [] as Date[],
      shipment: [] as Date[]
    };
    
    // Populate modifiers with dates
    Array.from(calendarData.entries()).forEach(([dateStr, counts]) => {
      const date = parseISO(dateStr);
      if (counts.deliveries > 0) {
        modifiers.delivery.push(date);
      } else if (counts.shipments > 0) {
        modifiers.shipment.push(date);
      }
    });
    
    return modifiers;
  }, [calendarData]);
  
  // Handle date selection in calendar
  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const eventsForDate = calendarData.get(dateStr);
    
    if (!eventsForDate) return;
    
    if (eventsForDate.deliveries > 0) {
      navigate('/deliveries');
    } else if (eventsForDate.shipments > 0) {
      navigate('/shipments');
    }
  };
  
  // Custom modifier styles
  const modifierStyles = {
    delivery: { backgroundColor: '#10b981', color: 'white', borderRadius: '100%' },
    shipment: { backgroundColor: '#3b82f6', color: 'white', borderRadius: '100%' }
  };
  
  return (
    <Card className="col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle>Calendário de Eventos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <Calendar
            mode="single"
            onSelect={handleSelect}
            modifiers={modifierDates}
            modifiersStyles={modifierStyles}
            className="w-full rounded-md border p-2"
            locale={ptBR}
          />
          <div className="mt-4 flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center">
              <div className="mr-1 h-3 w-3 rounded-full bg-blue-500" />
              <span>Embarques</span>
            </div>
            <div className="flex items-center">
              <div className="mr-1 h-3 w-3 rounded-full bg-green-500" />
              <span>Entregas</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
