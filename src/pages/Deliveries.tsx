
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Delivery } from '@/types';
import { useDeliveries } from '@/contexts/DeliveriesContext';
import { useClients } from '@/contexts/ClientsContext';
import { useActivityLog } from '@/contexts/ActivityLogContext';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  PlusCircle, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  AlertTriangle, 
  Search 
} from 'lucide-react';
import { toast } from "sonner";
import { DeliveryForm } from '@/components/delivery/DeliveryForm';
import { ScrollArea } from '@/components/ui/scroll-area';

const Deliveries = () => {
  const { deliveries, deleteDelivery } = useDeliveries();
  const { clients } = useClients();
  const { addLog } = useActivityLog();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState<Delivery | null>(null);
  
  // Debug para verificar os problemas com os nomes de clientes
  useEffect(() => {
    console.log('Clientes disponíveis:', clients);
    console.log('Entregas com IDs de clientes:', deliveries.map(d => ({ deliveryId: d.id, clientId: d.clientId })));
  }, [clients, deliveries]);

  const filteredDeliveries = deliveries.filter(delivery => {
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
    // Cria uma cópia profunda para evitar problemas de referência
    const deliveryCopy = JSON.parse(JSON.stringify(delivery));
    setEditingDelivery(deliveryCopy);
    setIsDialogOpen(true);
  };

  const handleDeleteDelivery = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta entrega?')) {
      const deliveryToDelete = deliveries.find(d => d.id === id);
      
      if (deliveryToDelete) {
        const client = clients.find(c => c.id === deliveryToDelete.clientId);
        const clientName = client ? (client.tradingName || client.name) : 'Cliente desconhecido';
        
        deleteDelivery(id);
        
        // Log activity
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

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingDelivery(null);
  };

  // Função para obter o nome do cliente de forma segura
  const getClientDisplayName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) {
      console.log('Cliente não encontrado para ID:', clientId);
      console.log('Todos clientes:', clients.map(c => ({ id: c.id, name: c.name })));
      return 'Cliente não encontrado';
    }
    return client.tradingName || client.name;
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Entregas</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Button onClick={() => {
              setEditingDelivery(null);
              setIsDialogOpen(true);
            }}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Entrega
            </Button>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>
                  {editingDelivery ? 'Editar Entrega' : 'Nova Entrega'}
                </DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[calc(90vh-130px)]">
                <div className="pr-4">
                  <DeliveryForm 
                    delivery={editingDelivery} 
                    onComplete={handleCloseDialog} 
                  />
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Lista de Entregas</CardTitle>
              <div className="relative max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar entregas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Minuta</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Destinatário</TableHead>
                  <TableHead>Peso</TableHead>
                  <TableHead>Volumes</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Ocorrência</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeliveries.length > 0 ? (
                  filteredDeliveries.map((delivery) => {
                    const clientName = getClientDisplayName(delivery.clientId);
                    return (
                      <TableRow key={delivery.id}>
                        <TableCell>{delivery.minuteNumber}</TableCell>
                        <TableCell>{clientName}</TableCell>
                        <TableCell>{delivery.deliveryDate}</TableCell>
                        <TableCell>{delivery.deliveryTime}</TableCell>
                        <TableCell>{delivery.receiver}</TableCell>
                        <TableCell>{delivery.weight} kg</TableCell>
                        <TableCell>{delivery.packages}</TableCell>
                        <TableCell>
                          <Badge variant={delivery.deliveryType === 'emergency' ? 'destructive' : 'default'}>
                            {delivery.deliveryType === 'standard' && 'Padrão'}
                            {delivery.deliveryType === 'emergency' && 'Emergência'}
                            {delivery.deliveryType === 'exclusive' && 'Exclusivo'}
                            {delivery.deliveryType === 'saturday' && 'Sábado'}
                            {delivery.deliveryType === 'sundayHoliday' && 'Domingo/Feriado'}
                            {delivery.deliveryType === 'difficultAccess' && 'Acesso Difícil'}
                            {delivery.deliveryType === 'metropolitanRegion' && 'Região Metropolitana'}
                            {delivery.deliveryType === 'doorToDoorInterior' && 'Interior'}
                            {delivery.deliveryType === 'reshipment' && 'Redespacho'}
                            {delivery.deliveryType === 'normalBiological' && 'Biológico Normal'}
                            {delivery.deliveryType === 'infectiousBiological' && 'Biológico Infeccioso'}
                            {delivery.deliveryType === 'tracked' && 'Rastreado'}
                          </Badge>
                        </TableCell>
                        <TableCell>R$ {delivery.totalFreight.toFixed(2)}</TableCell>
                        <TableCell>
                          {delivery.occurrence ? (
                            <div className="flex items-center">
                              <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
                              <span className="truncate max-w-[100px]" title={delivery.occurrence}>
                                {delivery.occurrence}
                              </span>
                            </div>
                          ) : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditDelivery(delivery)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteDelivery(delivery.id)} className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-4">
                      Nenhuma entrega encontrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Deliveries;
