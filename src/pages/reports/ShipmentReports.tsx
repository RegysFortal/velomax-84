
import { useState, useEffect } from 'react';
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
  
  // Make sure to refresh shipment data when the component mounts
  // Use an empty dependency array to run only once
  useEffect(() => {
    console.log("ShipmentReports - Calling refreshShipmentsData on mount");
    refreshShipmentsData();
  }, []); // Empty dependency array ensures this only runs once on mount
  
  // For debugging - log the shipments whenever they change
  useEffect(() => {
    console.log(`ShipmentReports - Received ${shipments.length} shipments`);
  }, [shipments]);
  
  const filteredShipments = shipments.filter(shipment => {
    // Debug logging to check filters
    console.log(`Filtering shipment ${shipment.trackingNumber}, status: ${shipment.status}, carrier: ${shipment.carrierName}`);
    
    // Validate that dates are valid before comparing
    let startDateObj = new Date(startDate);
    let endDateObj = new Date(endDate);
    
    // Configure endDateObj to end of day
    endDateObj.setHours(23, 59, 59, 999);
    
    const shipmentDate = shipment.arrivalDate ? new Date(shipment.arrivalDate) : null;
    
    // If there's no arrival date, include the shipment anyway
    const matchesDateRange = !shipmentDate || 
      (shipmentDate >= startDateObj && 
       shipmentDate <= endDateObj);
    
    const matchesStatus = filterStatus === 'all' || shipment.status === filterStatus;
    
    const matchesCarrier = filterCarrier === 'all' || 
      (shipment.carrierName && shipment.carrierName.toLowerCase().includes(filterCarrier.toLowerCase()));
      
    const matchesMode = filterMode === 'all' || shipment.transportMode === filterMode;
    
    const isMatched = matchesDateRange && matchesStatus && matchesCarrier && matchesMode;
    
    // Debug which filters are failing
    if (!isMatched) {
      console.log(`Shipment ${shipment.trackingNumber} filtered out: ` +
        `dateRange: ${matchesDateRange}, ` + 
        `status: ${matchesStatus}, ` + 
        `carrier: ${matchesCarrier}, ` + 
        `mode: ${matchesMode}`);
    }
    
    return isMatched;
  });
  
  // For debugging - log the filtered shipments
  useEffect(() => {
    console.log(`Filtered shipments count: ${filteredShipments.length}`);
  }, [filteredShipments.length]);

  const uniqueCarriers = Array.from(new Set(shipments.map(s => s.carrierName).filter(Boolean)));
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
