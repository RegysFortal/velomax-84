
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Delivery } from '@/types';
import { useDeliveries } from '@/contexts/DeliveriesContext';
import { useClients } from '@/contexts/ClientsContext';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { DeliveryForm } from '@/components/delivery/DeliveryForm';

const Deliveries = () => {
  const { deliveries, deleteDelivery } = useDeliveries();
  const { clients } = useClients();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState<Delivery | null>(null);

  const filteredDeliveries = deliveries.filter(delivery => {
    const clientName = clients.find(c => c.id === delivery.clientId)?.name || '';
    const searchFields = [
      delivery.minuteNumber,
      clientName,
      delivery.receiver,
      delivery.deliveryDate,
    ].join(' ').toLowerCase();
    
    return searchFields.includes(searchTerm.toLowerCase());
  });

  const handleEditDelivery = (delivery: Delivery) => {
    setEditingDelivery(delivery);
    setIsDialogOpen(true);
  };

  const handleDeleteDelivery = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta entrega?')) {
      deleteDelivery(id);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingDelivery(null);
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Entregas</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingDelivery(null)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nova Entrega
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>
                  {editingDelivery ? 'Editar Entrega' : 'Nova Entrega'}
                </DialogTitle>
              </DialogHeader>
              <DeliveryForm 
                delivery={editingDelivery} 
                onComplete={handleCloseDialog} 
              />
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Lista de Entregas</CardTitle>
              <Input
                placeholder="Buscar entregas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
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
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeliveries.length > 0 ? (
                  filteredDeliveries.map((delivery) => {
                    const client = clients.find(c => c.id === delivery.clientId);
                    return (
                      <TableRow key={delivery.id}>
                        <TableCell>{delivery.minuteNumber}</TableCell>
                        <TableCell>{client?.name || 'Cliente não encontrado'}</TableCell>
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
                    <TableCell colSpan={10} className="text-center py-4">
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
