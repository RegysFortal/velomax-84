
import React from 'react';
import { Delivery } from '@/types';
import { useClients } from '@/contexts/ClientsContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DeliveryDetailsProps {
  delivery: Delivery | null;
  open: boolean;
  onClose: () => void;
  onEdit: (delivery: Delivery) => void;
}

export function DeliveryDetails({ delivery, open, onClose, onEdit }: DeliveryDetailsProps) {
  const { clients } = useClients();
  const { users } = useAuth();

  if (!delivery) return null;

  const client = clients.find(c => c.id === delivery.clientId);
  const clientName = client ? (client.tradingName || client.name) : 'Cliente não encontrado';
  
  // Get names for employee IDs if available
  const getEmployeeName = (id: string | undefined) => {
    if (!id) return '';
    const user = users.find(u => u.id === id);
    return user ? user.name : '';
  };

  const receiverName = delivery.receiverId 
    ? getEmployeeName(delivery.receiverId) 
    : delivery.receiver || 'Não informado';

  const pickupName = delivery.pickupId 
    ? getEmployeeName(delivery.pickupId) 
    : delivery.pickupName || 'Não informado';

  // Map delivery type to display text
  const getDeliveryTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
      'standard': 'Padrão',
      'emergency': 'Emergência',
      'exclusive': 'Exclusivo',
      'saturday': 'Sábado',
      'sundayHoliday': 'Domingo/Feriado',
      'difficultAccess': 'Acesso Difícil',
      'metropolitanRegion': 'Região Metropolitana',
      'doorToDoorInterior': 'Interior',
      'reshipment': 'Redespacho',
      'normalBiological': 'Biológico Normal',
      'infectiousBiological': 'Biológico Infeccioso',
      'tracked': 'Rastreado'
    };
    
    return typeMap[type] || type;
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Detalhes da Entrega</span>
            <Button variant="outline" size="sm" onClick={() => onEdit(delivery)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </DialogTitle>
          <DialogDescription>
            Minuta: {delivery.minuteNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium">Cliente</h3>
              <p className="text-gray-700">{clientName}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium">Número da Minuta</h3>
              <p className="text-gray-700">{delivery.minuteNumber}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Informações de Entrega</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Recebedor</p>
                  <p className="font-medium">{receiverName}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Data e Hora da Entrega</p>
                  <p className="font-medium">
                    {delivery.deliveryDate && format(new Date(delivery.deliveryDate), 'dd/MM/yyyy', { locale: ptBR })}
                    {delivery.deliveryTime && ` às ${delivery.deliveryTime}`}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Informações de Retirada</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Quem Retirou na Transportadora</p>
                  <p className="font-medium">{pickupName}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Data e Hora da Retirada</p>
                  <p className="font-medium">
                    {delivery.pickupDate && format(new Date(delivery.pickupDate), 'dd/MM/yyyy', { locale: ptBR })}
                    {delivery.pickupTime && ` às ${delivery.pickupTime}`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Quantidade de Volumes</p>
              <p className="font-medium">{delivery.packages}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Peso</p>
              <p className="font-medium">{delivery.weight} kg</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Tipo de Entrega</p>
              <Badge variant={delivery.deliveryType === 'emergency' ? 'destructive' : 'default'}>
                {getDeliveryTypeText(delivery.deliveryType)}
              </Badge>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Tipo de Carga</p>
              <p className="font-medium">{delivery.cargoType === 'perishable' ? 'Perecível' : 'Padrão'}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Valor Total do Frete</p>
              <p className="font-medium">R$ {delivery.totalFreight.toFixed(2)}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Valor da Carga</p>
              <p className="font-medium">
                {delivery.cargoValue ? `R$ ${delivery.cargoValue.toFixed(2)}` : 'Não informado'}
              </p>
            </div>
          </div>

          {delivery.occurrence && (
            <>
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium flex items-center">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                  Ocorrência
                </h3>
                <p className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
                  {delivery.occurrence}
                </p>
              </div>
            </>
          )}

          {delivery.notes && (
            <>
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium">Observações</h3>
                <p className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md">
                  {delivery.notes}
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
