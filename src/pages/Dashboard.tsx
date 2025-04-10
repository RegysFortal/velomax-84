
import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { format, subDays, isWithinInterval } from 'date-fns';
import { useDeliveries } from '@/contexts/DeliveriesContext';
import { useClients } from '@/contexts';
import { useShipments } from '@/contexts/shipments';
import { 
  DateFilter, 
  MetricCards, 
  ChartSection, 
  SummaryCards 
} from '@/components/dashboard';

const Dashboard = () => {
  const { deliveries } = useDeliveries();
  const { clients } = useClients();
  const { shipments } = useShipments();
  const [dateFilter, setDateFilter] = useState<'day' | 'month' | 'year' | 'custom'>('month');
  const [startDate, setStartDate] = useState<string>(
    format(subDays(new Date(), 30), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );

  const filteredDeliveries = deliveries.filter(delivery => {
    const deliveryDate = new Date(delivery.deliveryDate);
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    return deliveryDate >= start && deliveryDate <= end;
  });

  const filteredShipments = shipments.filter(shipment => {
    if (!shipment.createdAt) return false;
    
    const shipmentDate = new Date(shipment.createdAt);
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    return shipmentDate >= start && shipmentDate <= end;
  });

  // Calculate metrics
  const totalDeliveries = filteredDeliveries.length;
  const totalWeight = filteredDeliveries.reduce((sum, d) => sum + d.weight, 0);
  
  const totalShipments = filteredShipments.length;
  const retainedShipments = filteredShipments.filter(s => s.isRetained).length;
  const deliveredShipments = filteredShipments.filter(s => s.status === 'delivered' || s.status === 'delivered_final').length;
  const inTransitShipments = filteredShipments.filter(s => s.status === 'in_transit').length;

  // Prepare chart data
  const deliveriesByDate = filteredDeliveries.reduce((acc, delivery) => {
    const date = format(new Date(delivery.deliveryDate), 'dd/MM');
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const deliveriesChartData = {
    labels: Object.keys(deliveriesByDate),
    datasets: [
      {
        label: 'Entregas',
        data: Object.values(deliveriesByDate).map(value => Number(value)),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  const shipmentsByStatus = filteredShipments.reduce((acc, shipment) => {
    acc[shipment.status] = (acc[shipment.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const shipmentStatusData = {
    labels: Object.keys(shipmentsByStatus).map(status => {
      switch(status) {
        case 'in_transit': return 'Em Trânsito';
        case 'retained': return 'Retido';
        case 'delivered': return 'Retirado';
        case 'delivered_final': return 'Entregue';
        default: return status;
      }
    }),
    datasets: [
      {
        label: 'Embarques por Status',
        data: Object.values(shipmentsByStatus),
        backgroundColor: [
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 99, 132, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Visualize os principais indicadores do seu negócio
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
        </div>
        
        <MetricCards 
          totalDeliveries={totalDeliveries}
          totalShipments={totalShipments}
          deliveredShipments={deliveredShipments}
          retainedShipments={retainedShipments}
        />
        
        <ChartSection 
          deliveriesChartData={deliveriesChartData}
          shipmentStatusData={shipmentStatusData}
        />
        
        <SummaryCards 
          inTransitShipments={inTransitShipments}
          retainedShipments={retainedShipments}
          deliveredShipments={deliveredShipments}
          totalWeight={totalWeight}
          totalDeliveries={totalDeliveries}
          startDate={startDate}
          endDate={endDate}
        />
      </div>
    </AppLayout>
  );
};

export default Dashboard;
