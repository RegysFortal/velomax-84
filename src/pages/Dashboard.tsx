
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart } from '@/components/ui/chart';
import { useDeliveries } from '@/contexts/DeliveriesContext';
import { useClients } from '@/contexts/ClientsContext';
import { useShipments } from '@/contexts/ShipmentsContext';
import { format, subDays, subMonths, subYears, startOfDay, startOfMonth, startOfYear, endOfDay, differenceInDays, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarDays, CalendarIcon, Calendar, TrendingUp, Package, Truck, Users, FileText, AlertTriangle } from 'lucide-react';

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
  const totalRevenue = filteredDeliveries.reduce((sum, d) => sum + d.totalFreight, 0);
  
  const totalShipments = filteredShipments.length;
  const retainedShipments = filteredShipments.filter(s => s.isRetained).length;
  const pendingShipments = filteredShipments.filter(s => s.status !== 'delivered').length;

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

  const revenueByClient = filteredDeliveries.reduce((acc, delivery) => {
    const client = clients.find(c => c.id === delivery.clientId);
    const clientName = client ? (client.tradingName || client.name) : 'Cliente Desconhecido';
    
    acc[clientName] = (acc[clientName] || 0) + delivery.totalFreight;
    return acc;
  }, {} as Record<string, number>);

  const clientRevenueData = {
    labels: Object.keys(revenueByClient).slice(0, 5),
    datasets: [
      {
        label: 'Faturamento',
        data: Object.values(revenueByClient).slice(0, 5).map(value => Number(value)),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
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
                Peso Total
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalWeight.toFixed(2)} kg</div>
              <p className="text-xs text-muted-foreground">
                Total transportado
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Faturamento
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                Valor total de fretes
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
              <CardTitle>Faturamento por Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart data={clientRevenueData} className="aspect-[4/3]" />
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Embarques Pendentes</CardTitle>
              <CardDescription>
                Embarques ainda não entregues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="text-3xl font-bold">{pendingShipments}</div>
                <div className="text-sm text-muted-foreground mt-1">de {totalShipments} embarques no período</div>
              </div>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate('/shipments')}
              >
                <Truck className="mr-2 h-4 w-4" />
                Ver Embarques
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Clientes Ativos</CardTitle>
              <CardDescription>
                Clientes com entregas no período
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="text-3xl font-bold">
                  {new Set(filteredDeliveries.map(d => d.clientId)).size}
                </div>
                <div className="text-sm text-muted-foreground mt-1">de {clients.length} clientes cadastrados</div>
              </div>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate('/clients')}
              >
                <Users className="mr-2 h-4 w-4" />
                Ver Clientes
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
                onClick={() => navigate('/reports')}
              >
                <FileText className="mr-2 h-4 w-4" />
                Ver Relatórios
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
