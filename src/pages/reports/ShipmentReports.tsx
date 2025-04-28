
import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, Download } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { ReportMetricCards } from './components/ReportMetricCards';
import { ReportStatusChart } from './components/ReportStatusChart';
import { ReportFilters } from './components/ReportFilters';
import { ReportShipmentsTable } from './components/ReportShipmentsTable';
import { useShipments } from '@/contexts/shipments';
import { useReportActions } from './hooks/useReportActions';
import { ShipmentDetails } from '@/components/shipment/ShipmentDetails';
import { Shipment, ShipmentStatus } from '@/types';
import { ptBR } from 'date-fns/locale';

export default function ShipmentReports() {
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [filterStatus, setFilterStatus] = useState<ShipmentStatus | 'all'>('all');
  const [filterCarrier, setFilterCarrier] = useState('all');
  const [filterMode, setFilterMode] = useState<'air' | 'road' | 'all'>('all');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { shipments, loading, refreshShipmentsData } = useShipments();
  
  const filteredShipments = shipments.filter(shipment => {
    // Validar que as datas são válidas antes de comparar
    let startDateObj = new Date(startDate);
    let endDateObj = new Date(endDate);
    
    // Configurar endDateObj para o final do dia
    endDateObj.setHours(23, 59, 59, 999);
    
    const shipmentDate = shipment.arrivalDate ? new Date(shipment.arrivalDate) : null;
    
    // Se não há data de chegada, mostrar o embarque de qualquer forma
    const matchesDateRange = !shipmentDate || 
      (shipmentDate >= startDateObj && 
       shipmentDate <= endDateObj);
    
    const matchesStatus = filterStatus === 'all' || shipment.status === filterStatus;
    
    const matchesCarrier = filterCarrier === 'all' || 
      shipment.carrierName.toLowerCase().includes(filterCarrier.toLowerCase());
      
    const matchesMode = filterMode === 'all' || shipment.transportMode === filterMode;
    
    return matchesDateRange && matchesStatus && matchesCarrier && matchesMode;
  });

  const uniqueCarriers = Array.from(new Set(shipments.map(s => s.carrierName)));
  const { generatePDF, exportToExcel } = useReportActions(filteredShipments);

  const handleStatusChange = () => {
    setRefreshTrigger(prev => prev + 1);
    refreshShipmentsData();
  };

  const handleShipmentDetailClose = () => {
    setSelectedShipment(null);
    refreshShipmentsData();
  };

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

        <ReportMetricCards filteredShipments={filteredShipments} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReportStatusChart filteredShipments={filteredShipments} />
          <ReportFilters
            startDate={startDate}
            endDate={endDate}
            filterStatus={filterStatus}
            filterMode={filterMode}
            filterCarrier={filterCarrier}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onStatusChange={setFilterStatus}
            onModeChange={setFilterMode}
            onCarrierChange={setFilterCarrier}
            uniqueCarriers={uniqueCarriers}
          />
        </div>

        <Card>
          <ReportShipmentsTable
            loading={loading}
            filteredShipments={filteredShipments}
            onStatusChange={handleStatusChange}
            onRowClick={setSelectedShipment}
          />
        </Card>
      </div>

      {selectedShipment && (
        <ShipmentDetails 
          shipment={selectedShipment}
          open={!!selectedShipment}
          onClose={handleShipmentDetailClose}
        />
      )}
    </AppLayout>
  );
}
