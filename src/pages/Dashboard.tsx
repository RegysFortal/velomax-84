
import React, { useState } from 'react';
import { DateRangeFilter } from '@/components/dashboard/DateRangeFilter';
import { EventsCalendar } from '@/components/dashboard/EventsCalendar';
import { DelayedShipmentsAlert } from '@/components/dashboard/DelayedShipmentsAlert';
import { PriorityDocumentsAlert } from '@/components/dashboard/PriorityDocumentsAlert';
import { DateRange } from "react-day-picker";
import { sub } from 'date-fns';
import { ShipmentMetricCards } from '@/components/dashboard/cards/ShipmentMetricCards';
import { DeliveryMetricCards } from '@/components/dashboard/cards/DeliveryMetricCards';
import { PriorityAndAttentionCards } from '@/components/dashboard/cards/PriorityAndAttentionCards';
import { useDashboardData } from '@/components/dashboard/hooks/useDashboardData';

const Dashboard = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: sub(new Date(), { days: 30 }),
    to: new Date()
  });
  
  const {
    filteredShipments,
    filteredDeliveries,
    totalShipments,
    inTransitShipments,
    retainedShipments,
    delayedShipments,
    priorityDocuments,
    attentionNeededShipments,
    totalDeliveries,
    activeDeliveries
  } = useDashboardData(dateRange);

  // Handle date range change
  const handleDateRangeChange = (range: DateRange) => {
    setDateRange({
      from: range.from || dateRange.from,
      to: range.to || dateRange.to
    });
  };
  
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Painel de controle principal
        </p>
      </div>
      
      {/* Priority Documents Alert */}
      <PriorityDocumentsAlert />
      
      {/* Alerta de embarques atrasados */}
      <DelayedShipmentsAlert />
      
      <DateRangeFilter 
        dateRange={dateRange} 
        onDateRangeChange={handleDateRangeChange} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ShipmentMetricCards
          totalShipments={totalShipments}
          inTransitShipments={inTransitShipments}
          retainedShipments={retainedShipments}
          delayedShipments={delayedShipments}
        />
        
        <DeliveryMetricCards
          totalDeliveries={totalDeliveries}
          activeDeliveries={activeDeliveries}
        />
        
        <PriorityAndAttentionCards
          priorityDocuments={priorityDocuments}
          attentionNeededShipments={attentionNeededShipments}
          retainedShipments={retainedShipments}
          delayedShipments={delayedShipments}
        />
      </div>
      
      <EventsCalendar
        deliveries={filteredDeliveries}
        shipments={filteredShipments}
      />
    </div>
  );
};

export default Dashboard;
