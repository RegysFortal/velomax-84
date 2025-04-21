
import { useState, useEffect } from 'react';
import { useDeliveries } from '@/contexts/deliveries/useDeliveries';
import { useActivityLog } from '@/contexts/ActivityLogContext';
import { Delivery } from '@/types/delivery';
import { Client } from '@/types';
import { toast } from 'sonner';

export const useDeliveriesOperations = (clients: Client[]) => {
  const { deliveries, deleteDelivery } = useDeliveries();
  const { addLog } = useActivityLog();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState<Delivery | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    const handleDeliveriesUpdated = () => {
      console.log("Deliveries updated event received, refreshing data");
      handleRefreshDeliveries();
    };
    
    window.addEventListener('deliveries-updated', handleDeliveriesUpdated);
    
    return () => {
      window.removeEventListener('deliveries-updated', handleDeliveriesUpdated);
    };
  }, []);

  const handleEditDelivery = (delivery: Delivery) => {
    const deliveryCopy = JSON.parse(JSON.stringify(delivery)) as Delivery;
    setEditingDelivery(deliveryCopy);
    setIsDialogOpen(true);
    setSelectedDelivery(null);
  };

  const handleDeleteDelivery = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta entrega?')) {
      const deliveryToDelete = deliveries.find(d => d.id === id);
      
      if (deliveryToDelete) {
        const client = clients.find(c => c.id === deliveryToDelete.clientId);
        const clientName = client ? (client.tradingName || client.name) : 'Cliente desconhecido';
        
        deleteDelivery(id);
        
        addLog({
          action: 'delete',
          entityType: 'delivery',
          entityId: id,
          entityName: `Minuta ${deliveryToDelete.minuteNumber} - ${clientName}`,
          details: `Entrega excluída: ${deliveryToDelete.minuteNumber}`
        });
        
        toast.success("Entrega excluída com sucesso");
      }
    }
  };

  const handleDialogComplete = () => {
    console.log('Dialog complete - refreshing deliveries view');
    handleRefreshDeliveries();
  };

  const handleViewDetails = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
  };

  const handleDetailClose = () => {
    setSelectedDelivery(null);
  };

  const handleRefreshDeliveries = () => {
    toast.info("Atualizando lista de entregas...");
    setRefreshCounter(prev => prev + 1);
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    editingDelivery,
    setEditingDelivery,
    selectedDelivery,
    setSelectedDelivery,
    refreshCounter,
    handleEditDelivery,
    handleDeleteDelivery,
    handleDialogComplete,
    handleViewDetails,
    handleDetailClose,
    handleRefreshDeliveries
  };
};
