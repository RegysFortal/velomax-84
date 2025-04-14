import React, { useState, useEffect } from 'react';
import { useDeliveries, Delivery as ContextDelivery } from '@/contexts/DeliveriesContext';
import { Delivery as TypedDelivery } from '@/types/delivery';
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
import { DatePicker } from '@/components/ui/date-picker';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { format, isWithinInterval, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { X, RefreshCcw } from 'lucide-react';
import { ClientSearchSelect } from '@/components/client/ClientSearchSelect';
import { supabase } from '@/integrations/supabase/client';

const Deliveries = () => {
  const { deliveries, deleteDelivery } = useDeliveries();
  const { clients, loading: clientsLoading } = useClients();
  const { addLog } = useActivityLog();
  const { financialReports } = useFinancial();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState<TypedDelivery | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<TypedDelivery | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);
  
  // Filtering state
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  
  // Listen for deliveries-updated event
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
  
  useEffect(() => {
    console.log('Clientes disponíveis:', clients.length);
    console.log('Status carregamento de clientes:', clientsLoading ? 'carregando' : 'completo');
    console.log('Entregas com IDs de clientes:', deliveries.map(d => ({ deliveryId: d.id, clientId: d.clientId })));
  }, [clients, deliveries, clientsLoading]);

  const isDeliveryInClosedReport = (delivery: ContextDelivery) => {
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

  const filteredDeliveries = deliveries
    .filter(delivery => {
      if (isDeliveryInClosedReport(delivery)) {
        return false;
      }
      
      if (selectedClientId && delivery.clientId !== selectedClientId) {
        return false;
      }
      
      if (startDate && endDate) {
        const deliveryDate = parseISO(delivery.deliveryDate);
        const filterStartDate = new Date(startDate);
        const filterEndDate = new Date(endDate);
        filterEndDate.setHours(23, 59, 59, 999);
        
        if (!isWithinInterval(deliveryDate, { start: filterStartDate, end: filterEndDate })) {
          return false;
        }
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
    })
    .sort((a, b) => new Date(b.deliveryDate).getTime() - new Date(a.deliveryDate).getTime()) as unknown as TypedDelivery[];

  const handleEditDelivery = (delivery: ContextDelivery) => {
    const deliveryCopy = JSON.parse(JSON.stringify(delivery)) as TypedDelivery;
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

  const handleViewDetails = (delivery: TypedDelivery) => {
    setSelectedDelivery(delivery);
  };

  const handleDetailClose = () => {
    setSelectedDelivery(null);
  };

  const clearFilters = () => {
    setSelectedClientId('');
    setStartDate(null);
    setEndDate(null);
  };

  const handleRefreshDeliveries = () => {
    toast.info("Atualizando lista de entregas...");
    setRefreshCounter(prev => prev + 1);
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Entregas</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleRefreshDeliveries}
              title="Atualizar lista de entregas"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <DeliveryFormDialog
              isOpen={isDialogOpen}
              setIsOpen={setIsDialogOpen}
              editingDelivery={editingDelivery}
              setEditingDelivery={setEditingDelivery}
              onComplete={handleDialogComplete}
            />
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="client-filter">Cliente</Label>
                <ClientSearchSelect
                  value={selectedClientId}
                  onValueChange={setSelectedClientId}
                  placeholder="Selecione um cliente"
                  clients={clients}
                />
              </div>
              <div>
                <Label htmlFor="start-date">Data Inicial</Label>
                <DatePicker
                  date={startDate ? new Date(startDate) : undefined}
                  onSelect={(date) => setStartDate(date ? format(date, 'yyyy-MM-dd') : null)}
                  placeholder="Selecione a data inicial"
                />
              </div>
              <div>
                <Label htmlFor="end-date">Data Final</Label>
                <DatePicker
                  date={endDate ? new Date(endDate) : undefined}
                  onSelect={(date) => setEndDate(date ? format(date, 'yyyy-MM-dd') : null)}
                  placeholder="Selecione a data final"
                />
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                {filteredDeliveries.length} entregas encontradas
              </div>
              <Button variant="outline" onClick={clearFilters} size="sm">
                <X className="h-4 w-4 mr-2" />
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

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
