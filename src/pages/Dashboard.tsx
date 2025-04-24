
import React, { useState } from 'react';
import { DateRangeFilter } from '@/components/dashboard/DateRangeFilter';
import { EventsCalendar } from '@/components/dashboard/EventsCalendar';
import { useShipments } from '@/contexts/shipments';
import { useDeliveriesStorage } from '@/hooks/useDeliveriesStorage';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DateRange } from "react-day-picker";
import { 
  Package, 
  Truck, 
  PackageX, 
  Timer, 
  Check, 
  Bell
} from 'lucide-react';
import { sub } from 'date-fns';
import { formatToLocaleDate } from '@/utils/dateUtils';

const Dashboard = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: sub(new Date(), { days: 30 }),
    to: new Date()
  });
  
  const { shipments, loading: shipmentsLoading } = useShipments();
  const { deliveries, loading: deliveriesLoading } = useDeliveriesStorage();

  // Convert date range to string format for API calls
  const startDate = formatToLocaleDate(dateRange.from || new Date());
  const endDate = formatToLocaleDate(dateRange.to || new Date());
  
  // Filter data based on date range
  const filteredShipments = shipments.filter(shipment => {
    const createdDate = new Date(shipment.createdAt);
    return createdDate >= (dateRange.from || new Date()) && 
           createdDate <= (dateRange.to || new Date());
  });
  
  const filteredDeliveries = deliveries.filter(delivery => {
    const deliveryDate = new Date(delivery.deliveryDate);
    return deliveryDate >= (dateRange.from || new Date()) && 
           deliveryDate <= (dateRange.to || new Date());
  });
  
  // Calculate metrics
  const totalShipments = filteredShipments.length;
  const inTransitShipments = filteredShipments.filter(s => s.status === 'in_transit').length;
  const retainedShipments = filteredShipments.filter(s => s.status === 'retained').length;
  const totalDeliveries = filteredDeliveries.length;
  const activeDeliveries = filteredDeliveries.filter(d => {
    const deliveryDate = new Date(d.deliveryDate);
    return deliveryDate >= new Date();
  }).length;
  
  // Identify delayed shipments (shipments that are in transit for more than 7 days)
  const delayedShipments = filteredShipments.filter(s => {
    if (s.status === 'in_transit') {
      const createdDate = new Date(s.createdAt);
      const daysDiff = Math.floor((new Date().getTime() - createdDate.getTime()) / (1000 * 3600 * 24));
      return daysDiff > 7;
    }
    return false;
  }).length;
  
  // Attention needed shipments (delayed + retained)
  const attentionNeededShipments = delayedShipments + retainedShipments;

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
      
      <DateRangeFilter 
        dateRange={dateRange} 
        onDateRangeChange={handleDateRangeChange} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Embarques
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalShipments}</div>
            <p className="text-xs text-muted-foreground">
              No período selecionado
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Embarques em Trânsito
            </CardTitle>
            <Truck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inTransitShipments}</div>
            <p className="text-xs text-muted-foreground">
              {inTransitShipments > 0 
                ? `${((inTransitShipments / totalShipments) * 100).toFixed(1)}% do total`
                : 'Nenhum embarque em trânsito'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Embarques Retidos
            </CardTitle>
            <PackageX className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{retainedShipments}</div>
            <p className="text-xs text-muted-foreground">
              {retainedShipments > 0 
                ? `${((retainedShipments / totalShipments) * 100).toFixed(1)}% do total`
                : 'Nenhum embarque retido'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Embarques Atrasados
            </CardTitle>
            <Timer className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{delayedShipments}</div>
            <p className="text-xs text-muted-foreground">
              {delayedShipments > 0 
                ? `${((delayedShipments / totalShipments) * 100).toFixed(1)}% do total`
                : 'Nenhum embarque atrasado'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Entregas
            </CardTitle>
            <Package className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeliveries}</div>
            <p className="text-xs text-muted-foreground">
              No período selecionado
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Entregas Ativas
            </CardTitle>
            <Check className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDeliveries}</div>
            <p className="text-xs text-muted-foreground">
              Entregas agendadas
            </p>
          </CardContent>
        </Card>
        
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Embarques que Precisam Atenção
            </CardTitle>
            <Bell className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attentionNeededShipments}</div>
            <div className="flex gap-4 mt-2">
              <span className="text-sm">
                <PackageX className="h-4 w-4 text-orange-500 inline mr-1" />
                {retainedShipments} retidos
              </span>
              <span className="text-sm">
                <Timer className="h-4 w-4 text-red-500 inline mr-1" />
                {delayedShipments} atrasados
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <EventsCalendar
        deliveries={filteredDeliveries}
        shipments={filteredShipments}
      />
    </div>
  );
};

export default Dashboard;
