
import React from 'react';
import { useState, useEffect } from 'react';
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
import { ShipmentEditDialog } from '@/components/shipment/ShipmentEditDialog';
import { Shipment, ShipmentStatus } from '@/types';
import { useShipmentFiltering } from './hooks/useShipmentFiltering';

export default function ShipmentReports() {
  // Filter state
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [filterStatus, setFilterStatus] = useState<ShipmentStatus | 'all'>('all');
  const [filterCarrier, setFilterCarrier] = useState('all');
  const [filterMode, setFilterMode] = useState<'air' | 'road' | 'all'>('all');
  
  // UI state
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [shipmentToEdit, setShipmentToEdit] = useState<Shipment | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { shipments, loading, refreshShipmentsData } = useShipments();
  
  // Use our new hook for filtering shipments
  const { filteredShipments } = useShipmentFiltering(
    shipments,
    startDate,
    endDate,
    filterStatus,
    filterCarrier,
    filterMode
  );
  
  // Make sure to refresh shipment data when the component mounts
  useEffect(() => {
    console.log("ShipmentReports - Calling refreshShipmentsData on mount");
    refreshShipmentsData();
  }, []); 
  
  // For debugging - log the shipments whenever they change
  useEffect(() => {
    console.log(`ShipmentReports - Received ${shipments.length} shipments`);
  }, [shipments]);

  // Extract unique carriers from shipments
  const uniqueCarriers = Array.from(new Set(shipments.map(s => s.carrierName).filter(Boolean)));
  const { generatePDF, exportToExcel, loading: reportLoading } = useReportActions(filteredShipments);

  const handleStatusChange = () => {
    setRefreshTrigger(prev => prev + 1);
    refreshShipmentsData();
  };

  const handleShipmentDetailClose = () => {
    setSelectedShipment(null);
    refreshShipmentsData();
  };

  const handleEditClick = (shipment: Shipment) => {
    setShipmentToEdit(shipment);
    setIsEditDialogOpen(true);
  };

  const handleEditDialogClose = (open: boolean) => {
    if (!open) {
      setIsEditDialogOpen(false);
      setShipmentToEdit(null);
      setRefreshTrigger(prev => prev + 1);
      refreshShipmentsData();
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios de Embarques</h1>
          <p className="text-muted-foreground">
            Análise e relatórios de embarques e cargas
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={generatePDF}
            disabled={reportLoading || filteredShipments.length === 0}
          >
            {reportLoading ? (
              <div className="animate-spin h-4 w-4 mr-2 border-2 border-b-transparent rounded-full" />
            ) : (
              <FileText className="mr-2 h-4 w-4" />
            )}
            Gerar PDF
          </Button>
          <Button 
            variant="outline" 
            onClick={exportToExcel}
            disabled={reportLoading || filteredShipments.length === 0}
          >
            {reportLoading ? (
              <div className="animate-spin h-4 w-4 mr-2 border-2 border-b-transparent rounded-full" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
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
          onEditClick={handleEditClick}
        />
      </Card>

      {selectedShipment && (
        <ShipmentDetails 
          shipment={selectedShipment}
          open={!!selectedShipment}
          onClose={handleShipmentDetailClose}
        />
      )}

      {/* Edit shipment dialog */}
      <ShipmentEditDialog
        open={isEditDialogOpen}
        onOpenChange={handleEditDialogClose}
        shipment={shipmentToEdit}
      />
    </div>
  );
}
