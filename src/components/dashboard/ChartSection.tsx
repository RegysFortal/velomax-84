
import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart } from '@/components/ui/chart';
import { Delivery, Shipment, Client } from '@/types';
import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useStatusLabel } from '@/components/shipment/hooks/useStatusLabel';

interface ChartSectionProps {
  deliveries: Delivery[];
  shipments: Shipment[];
  startDate: string;
  endDate: string;
  clients: Client[];
}

export const ChartSection = ({
  deliveries,
  shipments,
  startDate,
  endDate,
  clients
}: ChartSectionProps) => {
  const { getStatusLabel } = useStatusLabel();

  // Prepare chart data for deliveries by date
  const deliveriesChartData = useMemo(() => {
    // Create a map for dates and delivery counts
    const dateMap = new Map<string, number>();
    
    // Initialize the date map with all dates in the range having 0 deliveries
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
      const dateStr = format(day, 'dd/MM');
      dateMap.set(dateStr, 0);
    }
    
    // Count deliveries by date
    deliveries.forEach(delivery => {
      try {
        if (!delivery.deliveryDate) return;
        
        const deliveryDate = parseISO(delivery.deliveryDate);
        if (!isValid(deliveryDate)) return;
        
        const dateStr = format(deliveryDate, 'dd/MM');
        const count = dateMap.get(dateStr) || 0;
        dateMap.set(dateStr, count + 1);
      } catch (error) {
        console.error('Error processing delivery date:', error);
      }
    });
    
    // Convert map to arrays for chart
    const labels = Array.from(dateMap.keys());
    const data = Array.from(dateMap.values());
    
    return {
      labels,
      datasets: [
        {
          label: 'Entregas',
          data,
          backgroundColor: '#4f46e5',
          borderColor: '#4338ca',
          borderWidth: 1
        }
      ]
    };
  }, [deliveries, startDate, endDate]);
  
  // Prepare chart data for shipment statuses
  const shipmentStatusData = useMemo(() => {
    // Count shipments by status
    const statusCounts = new Map<string, number>();
    
    shipments.forEach(shipment => {
      const label = getStatusLabel(shipment.status);
      const count = statusCounts.get(label) || 0;
      statusCounts.set(label, count + 1);
    });
    
    // Define colors for each status
    const statusColors = {
      'Em Trânsito': '#3b82f6',
      'Retida': '#ef4444',
      'Retirada': '#f59e0b',
      'Entregue': '#10b981',
      'Entregue Parcial': '#f97316'
    };
    
    // Convert map to arrays for chart
    const labels = Array.from(statusCounts.keys());
    const data = Array.from(statusCounts.values());
    const backgroundColors = labels.map(label => 
      statusColors[label as keyof typeof statusColors] || '#6b7280'
    );
    
    return {
      labels,
      datasets: [
        {
          label: 'Embarques',
          data,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors,
          borderWidth: 1
        }
      ]
    };
  }, [shipments, getStatusLabel]);
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Entregas por Dia</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart data={deliveriesChartData} className="aspect-[2/1]" />
        </CardContent>
      </Card>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Embarques por Status</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart data={shipmentStatusData} className="aspect-[4/3]" />
        </CardContent>
      </Card>
    </div>
  );
};
