
import React from 'react';
import { Delivery } from '@/types';
import { Table, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { DeliveryTableHeader } from './DeliveryTableHeader';
import { DeliveryTableRow } from './DeliveryTableRow';
import { useClients } from '@/contexts';

interface DeliveryTableProps {
  deliveries: Delivery[];
  onEdit: (delivery: Delivery) => void;
  onDelete: (id: string) => void;
  onViewDetails: (delivery: Delivery) => void;
}

export function DeliveryTable({ 
  deliveries, 
  onEdit, 
  onDelete, 
  onViewDetails 
}: DeliveryTableProps) {
  const { clients } = useClients();

  // Função para obter o nome do cliente de forma segura
  const getClientDisplayName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) {
      console.log('Cliente não encontrado para ID:', clientId);
      return 'Cliente não encontrado';
    }
    return client.tradingName || client.name;
  };

  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-full">
        <DeliveryTableHeader />
        <TableBody>
          {deliveries.length > 0 ? (
            deliveries.map((delivery) => (
              <DeliveryTableRow
                key={delivery.id}
                delivery={delivery}
                clientName={getClientDisplayName(delivery.clientId)}
                onEdit={onEdit}
                onDelete={onDelete}
                onViewDetails={onViewDetails}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={11} className="text-center py-4">
                Nenhuma entrega encontrada
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
