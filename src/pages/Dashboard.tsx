
import { useState, useEffect, useCallback } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { format, subDays, isWithinInterval } from 'date-fns';
import { useDeliveries } from '@/contexts/deliveries/useDeliveries';
import { useClients } from '@/contexts';
import { useShipments } from '@/contexts/shipments';
import { 
  DateFilter, 
  MetricCards, 
  ChartSection, 
  SummaryCards,
  EventsCalendar 
} from '@/components/dashboard';
import { Delivery as TypedDelivery } from '@/types/delivery';

const Dashboard = () => {
  const { deliveries, loading: deliveriesLoading } = useDeliveries();
  const { clients } = useClients();
  const { shipments, loading: shipmentsLoading } = useShipments();
  const [dateFilter, setDateFilter] = useState<'day' | 'month' | 'year' | 'custom'>('month');
  const [startDate, setStartDate] = useState<string>(
    format(subDays(new Date(), 30), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Force a refresh when data changes
  useEffect(() => {
    setRefreshTrigger(prev => prev + 1);
  }, [shipments, deliveries]);

  // Filter deliveries by date range
  const filteredDeliveries = deliveries.filter(delivery => {
    const deliveryDate = new Date(delivery.deliveryDate);
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    return deliveryDate >= start && deliveryDate <= end;
  }) as unknown as TypedDelivery[];

  // Filter shipments by date range - only use arrival date if available
  const filteredShipments = shipments.filter(shipment => {
    if (!shipment.arrivalDate) return false;
    
    const shipmentDate = new Date(shipment.arrivalDate);
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    return shipmentDate >= start && shipmentDate <= end;
  });

  // Count shipments by status
  const inTransitShipments = filteredShipments.filter(s => s.status === 'in_transit').length;
  const retainedShipments = filteredShipments.filter(s => s.status === 'retained').length;
  const deliveredShipments = filteredShipments.filter(s => s.status === 'delivered').length;
  const partiallyDeliveredShipments = filteredShipments.filter(s => s.status === 'partially_delivered').length;
  const finalDeliveredShipments = filteredShipments.filter(s => s.status === 'delivered_final').length;

  // Calculate total weight from deliveries
  const totalWeight = filteredDeliveries.reduce((sum, delivery) => sum + delivery.weight, 0);

  // Listen for delivery updates from shipment status changes
  useEffect(() => {
    const handleDeliveriesUpdated = () => {
      console.log("Dashboard: Deliveries updated event received");
      setRefreshTrigger(prev => prev + 1);
    };
    
    window.addEventListener('deliveries-updated', handleDeliveriesUpdated);
    
    return () => {
      window.removeEventListener('deliveries-updated', handleDeliveriesUpdated);
    };
  }, []);

  return (
    <AppLayout>
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Painel de Controle</h1>
          <p className="text-muted-foreground">
            Acompanhe as métricas e estatísticas de operação
          </p>
        </div>
        
        <DateFilter 
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
        
        <MetricCards 
          totalDeliveries={filteredDeliveries.length}
          totalShipments={filteredShipments.length}
          deliveredShipments={finalDeliveredShipments}
          retainedShipments={retainedShipments}
        />
        
        <SummaryCards 
          inTransitShipments={inTransitShipments}
          retainedShipments={retainedShipments}
          deliveredShipments={deliveredShipments}
          partiallyDeliveredShipments={partiallyDeliveredShipments}
          finalDeliveredShipments={finalDeliveredShipments}
          totalWeight={totalWeight}
          totalDeliveries={filteredDeliveries.length}
          startDate={startDate}
          endDate={endDate}
          onRefresh={() => setRefreshTrigger(prev => prev + 1)}
        />
        
        <div className="grid gap-6 md:grid-cols-2">
          <ChartSection 
            deliveries={filteredDeliveries}
            shipments={filteredShipments}
            startDate={startDate}
            endDate={endDate}
            clients={clients}
          />
          
          <EventsCalendar 
            deliveries={filteredDeliveries}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
