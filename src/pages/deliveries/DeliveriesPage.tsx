
import React from 'react';
import { useDeliveries } from '@/contexts/deliveries/useDeliveries';
import { useClients } from '@/contexts';
import { useFinancial } from '@/contexts/financial'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DeliveryFormDialog } from '@/components/delivery/DeliveryFormDialog';
import { DeliverySearch } from '@/components/delivery/DeliverySearch';
import { DeliveryTable } from '@/components/delivery/DeliveryTable';
import { DeliveryDetails } from '@/components/delivery/DeliveryDetails';
import { DeliveriesFilter } from './DeliveriesFilter';
import { DeliveriesHeader } from './DeliveriesHeader';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toISODateString } from '@/utils/dateUtils';

// Hooks
import { useDeliveriesFilters } from './hooks/useDeliveriesFilters';
import { useDeliveriesOps } from './hooks/useDeliveriesOps';

export default function DeliveriesPage() {
  const { deliveries, fetchDeliveries } = useDeliveries();
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
    <ScrollArea className="h-[calc(100vh-148px)] w-full">
      <div className="container mx-auto py-6">
        <DeliveriesHeader
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          editingDelivery={editingDelivery}
          setEditingDelivery={setEditingDelivery}
          onRefreshDeliveries={handleRefreshDeliveries}
          onDialogComplete={handleDialogComplete}
          deliveries={deliveries}
          setDeliveries={(newDeliveries) => {
            // This is not optimal since we don't have a direct way to update deliveries,
            // but we can trigger a fetch which will update the context
            fetchDeliveries();
          }}
        />

        <DeliveriesFilter
          selectedClientId={selectedClientId}
          setSelectedClientId={setSelectedClientId}
          startDate={startDate ? new Date(`${startDate}T12:00:00`) : null}
          setStartDate={(date) => {
            if (date instanceof Date) {
              setStartDate(toISODateString(date));
            } else {
              setStartDate(null);
            }
          }}
          endDate={endDate ? new Date(`${endDate}T12:00:00`) : null}
          setEndDate={(date) => {
            if (date instanceof Date) {
              setEndDate(toISODateString(date));
            } else {
              setEndDate(null);
            }
          }}
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
          onDelete={handleDeleteDelivery}
        />
      </div>
    </ScrollArea>
  );
}
