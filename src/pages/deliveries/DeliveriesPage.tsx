
import React from 'react';
import { useDeliveries } from '@/contexts/deliveries/useDeliveries';
import { useClients } from '@/contexts';
import { useFinancial } from '@/contexts/financial'; // Updated import path
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DeliveryFormDialog } from '@/components/delivery/DeliveryFormDialog';
import { DeliverySearch } from '@/components/delivery/DeliverySearch';
import { DeliveryTable } from '@/components/delivery/DeliveryTable';
import { DeliveryDetails } from '@/components/delivery/DeliveryDetails';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { X, RefreshCcw } from 'lucide-react';
import { ClientSearchSelect } from '@/components/client/ClientSearchSelect';
import { DatePicker } from '@/components/ui/date-picker';
import { DeliveriesFilter } from './DeliveriesFilter';
import { DeliveriesHeader } from './DeliveriesHeader';

// Hooks extraídos
import { useDeliveriesFilters } from './hooks/useDeliveriesFilters';
import { useDeliveriesOps } from './hooks/useDeliveriesOps';

export default function DeliveriesPage() {
  const { deliveries } = useDeliveries();
  const { clients, loading: clientsLoading } = useClients();
  
  // Safely access financial context with fallback
  let financialReports = [];
  try {
    const financialContext = useFinancial();
    financialReports = financialContext?.financialReports || [];
  } catch (error) {
    console.warn("FinancialProvider not available, using empty reports array");
  }

  // Filtros
  const {
    searchTerm,
    setSearchTerm,
    selectedClientId,
    setSelectedClientId,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    filteredDeliveries,
    clearFilters
  } = useDeliveriesFilters({
    deliveries,
    clients,
    financialReports
  });

  // Operações
  const {
    isDialogOpen,
    setIsDialogOpen,
    editingDelivery,
    setEditingDelivery,
    selectedDelivery,
    setSelectedDelivery,
    handleEditDelivery,
    handleDeleteDelivery,
    handleDialogComplete,
    handleViewDetails,
    handleDetailClose,
    handleRefreshDeliveries
  } = useDeliveriesOps(clients);

  return (
    <div className="container mx-auto py-6">
      <DeliveriesHeader
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        editingDelivery={editingDelivery}
        setEditingDelivery={setEditingDelivery}
        onRefreshDeliveries={handleRefreshDeliveries}
        onDialogComplete={handleDialogComplete}
      />

      <DeliveriesFilter
        selectedClientId={selectedClientId}
        setSelectedClientId={setSelectedClientId}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        clearFilters={clearFilters}
        filteredDeliveriesCount={filteredDeliveries.length}
        clients={clients}
      />

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Lista de Entregas</h2>
            <DeliverySearch 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
            />
          </div>
        </CardHeader>
        <CardContent>
          <DeliveryTable
            deliveries={filteredDeliveries}
            onEdit={handleEditDelivery}
            onDelete={handleDeleteDelivery}
            onViewDetails={handleViewDetails}
          />
        </CardContent>
      </Card>
      
      <DeliveryDetails
        delivery={selectedDelivery}
        open={!!selectedDelivery}
        onClose={handleDetailClose}
        onEdit={handleEditDelivery}
      />
    </div>
  );
}
