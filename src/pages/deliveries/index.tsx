
import React from 'react';
import { useDeliveries } from '@/contexts/deliveries/useDeliveries';
import { useClients } from '@/contexts';
import { useActivityLog } from '@/contexts/ActivityLogContext';
import { useFinancial } from '@/contexts/FinancialContext';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DeliverySearch } from '@/components/delivery/DeliverySearch';
import { DeliveryTable } from '@/components/delivery/DeliveryTable';
import { DeliveryDetails } from '@/components/delivery/DeliveryDetails';
import { DeliveriesHeader } from './DeliveriesHeader';
import { DeliveriesFilter } from './DeliveriesFilter';
import { useDeliveriesFiltering } from './hooks/useDeliveriesFiltering';
import { useDeliveriesOperations } from './hooks/useDeliveriesOperations';

const Deliveries = () => {
  const { deliveries } = useDeliveries();
  const { clients, loading: clientsLoading } = useClients();
  const { financialReports } = useFinancial();

  // Logging debug information
  React.useEffect(() => {
    console.log('Clientes disponíveis:', clients.length);
    console.log('Status carregamento de clientes:', clientsLoading ? 'carregando' : 'completo');
    console.log('Entregas com IDs de clientes:', deliveries.map(d => ({ deliveryId: d.id, clientId: d.clientId })));
  }, [clients, deliveries, clientsLoading]);

  // Use the filtering hook
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
  } = useDeliveriesFiltering({ 
    deliveries, 
    clients, 
    financialReports 
  });

  // Use the operations hook
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
  } = useDeliveriesOperations(clients);

  return (
    <AppLayout>
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
      </div>
      
      <DeliveryDetails
        delivery={selectedDelivery}
        open={!!selectedDelivery}
        onClose={handleDetailClose}
        onEdit={handleEditDelivery}
      />
    </AppLayout>
  );
};

export default Deliveries;
