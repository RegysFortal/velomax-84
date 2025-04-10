import React, { useState, useEffect } from 'react';
import { Delivery } from '@/types';
import { useDeliveries } from '@/contexts/DeliveriesContext';
import { useClients } from '@/contexts';
import { useActivityLog } from '@/contexts/ActivityLogContext';
import { useFinancial } from '@/contexts/FinancialContext';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from "sonner";
import { DeliveryFormDialog } from '@/components/delivery/DeliveryFormDialog';
import { DeliverySearch } from '@/components/delivery/DeliverySearch';
import { DeliveryTable } from '@/components/delivery/DeliveryTable';
import { DeliveryDetails } from '@/components/delivery/DeliveryDetails';

const Deliveries = () => {
  const { deliveries, deleteDelivery } = useDeliveries();
  const { clients } = useClients();
  const { addLog } = useActivityLog();
  const { financialReports } = useFinancial();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState<Delivery | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  
  useEffect(() => {
    console.log('Clientes disponíveis:', clients);
    console.log('Entregas com IDs de clientes:', deliveries.map(d => ({ deliveryId: d.id, clientId: d.clientId })));
  }, [clients, deliveries]);

  const isDeliveryInClosedReport = (delivery: Delivery) => {
    const closedReports = financialReports.filter(report => report.status === 'closed');
    
    return closedReports.some(report => {
      if (report.clientId !== delivery.clientId) return false;
      
      const deliveryDate = new Date(delivery.deliveryDate);
      const reportStartDate = new Date(report.startDate);
      const reportEndDate = new Date(report.endDate);
      
      deliveryDate.setHours(0, 0, 0, 0);
      reportStartDate.setHours(0, 0, 0, 0);
      reportEndDate.setHours(23, 59, 59, 999);
      
      return deliveryDate >= reportStartDate && deliveryDate <= reportEndDate;
    });
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    if (isDeliveryInClosedReport(delivery)) {
      return false;
    }
    
    const client = clients.find(c => c.id === delivery.clientId);
    const searchFields = [
      delivery.minuteNumber,
      client?.tradingName || '',
      client?.name || '',
      delivery.receiver,
      delivery.deliveryDate,
      delivery.occurrence || '',
    ].join(' ').toLowerCase();
    
    return searchFields.includes(searchTerm.toLowerCase());
  }).sort((a, b) => new Date(b.deliveryDate).getTime() - new Date(a.deliveryDate).getTime());

  const handleEditDelivery = (delivery: Delivery) => {
    const deliveryCopy = JSON.parse(JSON.stringify(delivery));
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
  };

  const handleViewDetails = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
  };

  const handleDetailClose = () => {
    setSelectedDelivery(null);
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Entregas</h1>
          <DeliveryFormDialog
            isOpen={isDialogOpen}
            setIsOpen={setIsDialogOpen}
            editingDelivery={editingDelivery}
            setEditingDelivery={setEditingDelivery}
            onComplete={handleDialogComplete}
          />
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Lista de Entregas</CardTitle>
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
