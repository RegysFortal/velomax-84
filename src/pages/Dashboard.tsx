
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { MetricCards } from '@/components/dashboard/MetricCards';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { ChartSection } from '@/components/dashboard/ChartSection';
import { EventsCalendar } from '@/components/dashboard/EventsCalendar';
import { DateRangeFilter } from '@/components/dashboard/DateRangeFilter';
import { useShipments } from '@/contexts/shipments';
import { useDeliveriesStorage } from '@/hooks/useDeliveriesStorage';
import { useClients } from '@/contexts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatToLocaleDate } from '@/utils/dateUtils';
import { DateRange } from "react-day-picker";
import { 
  Package, 
  Truck, 
  PackageX, 
  Timer, 
  Users, 
  PackageCheck, 
  Check, 
  CalendarDays, 
  Bell, 
  CalendarClock,
  Cake
} from 'lucide-react';
import { sub } from 'date-fns';

const Dashboard = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: sub(new Date(), { days: 30 }),
    to: new Date()
  });
  
  const { shipments, loading: shipmentsLoading, refreshShipmentsData } = useShipments();
  const { deliveries, loading: deliveriesLoading } = useDeliveriesStorage();
  const { clients } = useClients();
  
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
  const deliveredShipments = filteredShipments.filter(s => s.status === 'delivered' || s.status === 'delivered_final').length;
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
  
  // Deliveries for current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentMonthDeliveries = deliveries.filter(d => {
    const deliveryDate = new Date(d.deliveryDate);
    return deliveryDate.getMonth() === currentMonth && deliveryDate.getFullYear() === currentYear;
  }).length;
  
  // Calculate total weight moved
  const totalWeight = filteredDeliveries.reduce((sum, delivery) => sum + delivery.weight, 0);
  
  // Handle refresh
  const handleRefresh = () => {
    refreshShipmentsData();
  };

  // Handle date range change with proper type
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
              Clientes Cadastrados
            </CardTitle>
            <Users className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-xs text-muted-foreground">
              Total de clientes
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Entregas
            </CardTitle>
            <PackageCheck className="h-4 w-4 text-green-500" />
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
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Entregas do Mês
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMonthDeliveries}</div>
            <p className="text-xs text-muted-foreground">
              No mês atual
            </p>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 md:col-span-2 lg:col-span-4">
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartSection 
          shipments={filteredShipments}
          deliveries={filteredDeliveries}
          clients={clients}
          startDate={startDate}
          endDate={endDate}
        />
      </div>
      
      <SummaryCards
        inTransitShipments={inTransitShipments}
        retainedShipments={retainedShipments}
        deliveredShipments={deliveredShipments}
        partiallyDeliveredShipments={0}
        finalDeliveredShipments={0}
        totalWeight={totalWeight}
        totalDeliveries={totalDeliveries}
        startDate={startDate}
        endDate={endDate}
        onRefresh={handleRefresh}
      />
      
      <EventsCalendar
        deliveries={filteredDeliveries}
        shipments={filteredShipments}
      />
    </div>
  );
};

export default Dashboard;
