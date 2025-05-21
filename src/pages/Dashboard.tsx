import React, { useState } from 'react';
import { DateRangeFilter } from '@/components/dashboard/DateRangeFilter';
import { EventsCalendar } from '@/components/dashboard/EventsCalendar';
import { DelayedShipmentsAlert } from '@/components/dashboard/DelayedShipmentsAlert';
import { PriorityDocumentsAlert } from '@/components/dashboard/PriorityDocumentsAlert';
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
  Bell,
  Siren
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
  
  // Filter data based on date range
  const filteredDeliveries = deliveries.filter(delivery => {
    const deliveryDate = new Date(delivery.deliveryDate);
    return deliveryDate >= (dateRange.from || new Date()) && 
           deliveryDate <= (dateRange.to || new Date());
  });

  // Count priority documents
  const priorityDocuments = shipments.reduce((count, shipment) => {
    return count + shipment.documents.filter(doc => doc.isPriority).length;
  }, 0);
  
  // Calculate metrics
  const totalShipments = filteredShipments.length;
  const inTransitShipments = filteredShipments.filter(s => s.status === 'in_transit').length;
  const retainedShipments = filteredShipments.filter(s => s.status === 'retained').length;
  const totalDeliveries = filteredDeliveries.length;
  const activeDeliveries = filteredDeliveries.filter(d => {
    const deliveryDate = new Date(d.deliveryDate);
    return deliveryDate >= new Date();
  }).length;
  
  // Identify delayed shipments using the same rule as DelayedShipmentsAlert (shipments that are 3 or more days past arrival date)
  const delayedShipments = filteredShipments.filter(s => {
    // Check only in_transit or retained shipments
    if (s.status !== 'in_transit' && s.status !== 'retained') {
      return false;
    }
    
    // If no arrival date, not considered delayed
    if (!s.arrivalDate) {
      return false;
    }
    
    const arrivalDate = new Date(s.arrivalDate);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - arrivalDate.getTime()) / (1000 * 3600 * 24));
    
    // Delayed if 3 or more days past arrival date (same rule as DelayedShipmentsAlert)
    return daysDiff >= 3;
  }).length;
  
  // Attention needed shipments (delayed + retained)
  const attentionNeededShipments = delayedShipments + retainedShipments + priorityDocuments;

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
        
        {/* New card for priority documents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Documentos Prioritários
            </CardTitle>
            <Siren className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{priorityDocuments}</div>
            <p className="text-xs text-muted-foreground">
              {priorityDocuments > 0 
                ? 'Documentos com prioridade alta'
                : 'Nenhum documento prioritário'}
            </p>
          </CardContent>
        </Card>
        
        {/* Keep Attention Needed card with updated count */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Embarques que Precisam Atenção
            </CardTitle>
            <Bell className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attentionNeededShipments}</div>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-sm">
                <PackageX className="h-4 w-4 text-orange-500 inline mr-1" />
                {retainedShipments} retidos
              </span>
              <span className="text-sm">
                <Timer className="h-4 w-4 text-red-500 inline mr-1" />
                {delayedShipments} atrasados
              </span>
              <span className="text-sm">
                <Siren className="h-4 w-4 text-red-500 inline mr-1" />
                {priorityDocuments} prioritários
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
