
import { useState } from 'react';
import { useShipments } from '@/contexts/ShipmentsContext';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import { 
  FileText, 
  Download, 
  BarChart as BarChartIcon, 
  Truck, 
  AlertTriangle, 
  CheckCircle2, 
  Timer, 
  PackageOpen, 
  Calendar 
} from 'lucide-react';
import { StatusBadge } from '@/components/shipment/StatusBadge';
import { format, startOfDay, endOfDay, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ShipmentStatus } from '@/types/shipment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function ShipmentReports() {
  const { shipments, loading } = useShipments();
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [filterStatus, setFilterStatus] = useState<ShipmentStatus | 'all'>('all');
  const [filterCarrier, setFilterCarrier] = useState('');
  const [filterMode, setFilterMode] = useState<'air' | 'road' | 'all'>('all');
  
  // Filter shipments based on criteria
  const filteredShipments = shipments.filter(shipment => {
    const shipmentDate = shipment.arrivalDate ? new Date(shipment.arrivalDate) : null;
    
    const matchesDateRange = !shipmentDate || 
      (shipmentDate >= startOfDay(new Date(startDate)) && 
       shipmentDate <= endOfDay(new Date(endDate)));
    
    const matchesStatus = filterStatus === 'all' || shipment.status === filterStatus;
    
    const matchesCarrier = !filterCarrier || 
      shipment.carrierName.toLowerCase().includes(filterCarrier.toLowerCase());
      
    const matchesMode = filterMode === 'all' || shipment.transportMode === filterMode;
    
    return matchesDateRange && matchesStatus && matchesCarrier && matchesMode;
  });
  
  // Count shipments by status for chart
  const statusCounts = {
    in_transit: filteredShipments.filter(s => s.status === 'in_transit').length,
    retained: filteredShipments.filter(s => s.status === 'retained').length,
    cleared: filteredShipments.filter(s => s.status === 'cleared').length,
    standby: filteredShipments.filter(s => s.status === 'standby').length,
    delivered: filteredShipments.filter(s => s.status === 'delivered').length,
  };
  
  const chartData = [
    { name: 'Em Trânsito', value: statusCounts.in_transit },
    { name: 'Retida', value: statusCounts.retained },
    { name: 'Liberada', value: statusCounts.cleared },
    { name: 'Standby', value: statusCounts.standby },
    { name: 'Entregue', value: statusCounts.delivered },
  ];
  
  // Get unique carriers for the filter
  const uniqueCarriers = Array.from(new Set(shipments.map(s => s.carrierName)));
  
  const generatePDF = () => {
    // In a real implementation, this would use jsPDF or a similar library to generate a PDF
    toast.success("Relatório gerado e baixado com sucesso!");
  };
  
  const exportToExcel = () => {
    // In a real implementation, this would use xlsx or a similar library to generate an Excel file
    toast.success("Dados exportados para Excel com sucesso!");
  };
  
  // Calculate summary statistics
  const totalShipments = filteredShipments.length;
  const totalPackages = filteredShipments.reduce((sum, s) => sum + s.packages, 0);
  const totalWeight = filteredShipments.reduce((sum, s) => sum + s.weight, 0);
  const retainedCount = statusCounts.retained;
  const retainedPercentage = totalShipments ? (retainedCount / totalShipments * 100).toFixed(1) : '0';
  
  return (
    <AppLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Relatórios de Embarques</h1>
            <p className="text-muted-foreground">
              Análise e relatórios de embarques e cargas
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={generatePDF}>
              <FileText className="mr-2 h-4 w-4" />
              Gerar PDF
            </Button>
            <Button variant="outline" onClick={exportToExcel}>
              <Download className="mr-2 h-4 w-4" />
              Exportar Excel
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Embarques</CardTitle>
              <PackageOpen className="h-4 w-4 text-muted-foreground" />
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
              <CardTitle className="text-sm font-medium">Volumes</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPackages}</div>
              <p className="text-xs text-muted-foreground">
                Total de volumes
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Peso Total</CardTitle>
              <BarChartIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalWeight.toFixed(2)} kg</div>
              <p className="text-xs text-muted-foreground">
                Peso total transportado
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cargas Retidas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{retainedCount} ({retainedPercentage}%)</div>
              <p className="text-xs text-muted-foreground">
                Do total de embarques
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Status dos Embarques</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#3b82f6" name="Quantidade" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Filtros de Relatório</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Data Inicial</label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Data Final</label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select 
                      value={filterStatus} 
                      onValueChange={(val) => setFilterStatus(val as ShipmentStatus | 'all')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="in_transit">Em Trânsito</SelectItem>
                        <SelectItem value="retained">Retida</SelectItem>
                        <SelectItem value="cleared">Liberada</SelectItem>
                        <SelectItem value="standby">Standby</SelectItem>
                        <SelectItem value="delivered">Entregue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Modo de Transporte</label>
                    <Select 
                      value={filterMode} 
                      onValueChange={(val) => setFilterMode(val as 'air' | 'road' | 'all')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o modo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="air">Aéreo</SelectItem>
                        <SelectItem value="road">Rodoviário</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Transportadora</label>
                  <Select 
                    value={filterCarrier} 
                    onValueChange={setFilterCarrier}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a transportadora" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas</SelectItem>
                      {uniqueCarriers.map((carrier) => (
                        <SelectItem key={carrier} value={carrier}>
                          {carrier}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Lista de Embarques</CardTitle>
          </CardHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Conhecimento</TableHead>
                <TableHead>Transportadora</TableHead>
                <TableHead>Modo</TableHead>
                <TableHead>Volumes</TableHead>
                <TableHead>Peso (kg)</TableHead>
                <TableHead>Chegada</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredShipments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6">
                    Nenhum embarque encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredShipments.map((shipment) => (
                  <TableRow key={shipment.id}>
                    <TableCell>{shipment.companyName}</TableCell>
                    <TableCell>{shipment.trackingNumber}</TableCell>
                    <TableCell>{shipment.carrierName}</TableCell>
                    <TableCell>{shipment.transportMode === 'air' ? 'Aéreo' : 'Rodoviário'}</TableCell>
                    <TableCell>{shipment.packages}</TableCell>
                    <TableCell>{shipment.weight}</TableCell>
                    <TableCell>
                      {shipment.arrivalDate
                        ? format(new Date(shipment.arrivalDate), 'dd/MM/yyyy', { locale: ptBR })
                        : 'Não definida'}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={shipment.status} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AppLayout>
  );
}
