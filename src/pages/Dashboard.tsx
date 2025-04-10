import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart } from '@/components/ui/chart';
import { useDeliveries } from '@/contexts/DeliveriesContext';
import { useClients } from '@/contexts';
import { useShipments } from '@/contexts/shipments';
import { format, subDays, subMonths, subYears, startOfDay, startOfMonth, startOfYear, endOfDay, differenceInDays, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CalendarDays, 
  CalendarIcon, 
  Calendar, 
  TrendingUp, 
  Package, 
  Truck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import { StatusBadge } from '@/components/shipment/StatusBadge';

const Dashboard = () => {
  const navigate = useNavigate();
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

  useEffect(() => {
    const today = new Date();
    
    switch (dateFilter) {
      case 'day':
        setStartDate(format(startOfDay(today), 'yyyy-MM-dd'));
        setEndDate(format(today, 'yyyy-MM-dd'));
        break;
      case 'month':
        setStartDate(format(startOfMonth(today), 'yyyy-MM-dd'));
        setEndDate(format(today, 'yyyy-MM-dd'));
        break;
      case 'year':
        setStartDate(format(startOfYear(today), 'yyyy-MM-dd'));
        setEndDate(format(today, 'yyyy-MM-dd'));
        break;
      // For custom, we keep the existing dates
    }
  }, [dateFilter]);

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

  const totalDeliveries = filteredDeliveries.length;
  const totalWeight = filteredDeliveries.reduce((sum, d) => sum + d.weight, 0);
  
  const totalShipments = filteredShipments.length;
  const retainedShipments = filteredShipments.filter(s => s.isRetained).length;
  const deliveredShipments = filteredShipments.filter(s => s.status === 'delivered' || s.status === 'delivered_final').length;
  const inTransitShipments = filteredShipments.filter(s => s.status === 'in_transit').length;

  const deliveriesByDate = filteredDeliveries.reduce((acc, delivery) => {
    const date = format(new Date(delivery.deliveryDate), 'dd/MM');
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = {
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
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex gap-2">
              <Button 
                variant={dateFilter === 'day' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setDateFilter('day')}
              >
                <CalendarIcon className="h-4 w-4 mr-1" />
                Dia
              </Button>
              <Button 
                variant={dateFilter === 'month' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setDateFilter('month')}
              >
                <CalendarDays className="h-4 w-4 mr-1" />
                Mês
              </Button>
              <Button 
                variant={dateFilter === 'year' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setDateFilter('year')}
              >
                <Calendar className="h-4 w-4 mr-1" />
                Ano
              </Button>
              <Button 
                variant={dateFilter === 'custom' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setDateFilter('custom')}
              >
                Personalizado
              </Button>
            </div>
            
            {dateFilter === 'custom' && (
              <div className="flex gap-2 items-center">
                <div className="grid gap-1">
                  <Label htmlFor="startDate" className="sr-only">Data inicial</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-9 w-[130px]"
                  />
                </div>
                <span className="text-muted-foreground">até</span>
                <div className="grid gap-1">
                  <Label htmlFor="endDate" className="sr-only">Data final</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-9 w-[130px]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Entregas
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
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
                Total de Embarques
              </CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
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
                Cargas Entregues
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deliveredShipments}</div>
              <p className="text-xs text-muted-foreground">
                De {totalShipments} embarques
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Cargas Retidas
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{retainedShipments}</div>
              <p className="text-xs text-muted-foreground">
                De {totalShipments} embarques
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Entregas por Dia</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart data={chartData} className="aspect-[2/1]" />
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
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Status de Embarques</CardTitle>
              <CardDescription>
                Resumo dos embarques por status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <StatusBadge status="in_transit" />
                    <span className="ml-2">Em Trânsito</span>
                  </div>
                  <span className="font-medium">{inTransitShipments}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <StatusBadge status="retained" />
                    <span className="ml-2">Retidas</span>
                  </div>
                  <span className="font-medium">{retainedShipments}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <StatusBadge status="delivered" />
                    <span className="ml-2">Retiradas/Entregues</span>
                  </div>
                  <span className="font-medium">{deliveredShipments}</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4" 
                onClick={() => navigate('/shipments')}
              >
                <Truck className="mr-2 h-4 w-4" />
                Ver Todos Embarques
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Peso Transportado</CardTitle>
              <CardDescription>
                Total em kg no período
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="text-3xl font-bold">
                  {totalWeight.toFixed(2)} kg
                </div>
                <div className="text-sm text-muted-foreground mt-1">em {totalDeliveries} entregas</div>
              </div>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate('/deliveries')}
              >
                <Package className="mr-2 h-4 w-4" />
                Ver Entregas
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Média de Entregas</CardTitle>
              <CardDescription>
                Média diária de entregas no período
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="text-3xl font-bold">
                  {(totalDeliveries / Math.max(differenceInDays(new Date(endDate), new Date(startDate)) + 1, 1)).toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground mt-1">entregas por dia</div>
              </div>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate('/shipment-reports')}
              >
                <Clock className="mr-2 h-4 w-4" />
                Relatórios de Embarques
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
