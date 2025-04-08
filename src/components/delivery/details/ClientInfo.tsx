
import React from 'react';
import { Delivery } from '@/types';
import { useClients } from '@/contexts/ClientsContext';

interface ClientInfoProps {
  delivery: Delivery;
}

export function ClientInfo({ delivery }: ClientInfoProps) {
  const { clients } = useClients();

  const client = clients.find(c => c.id === delivery.clientId);
  const clientName = client ? (client.tradingName || client.name) : 'Cliente não encontrado';

  return (
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
  );
}
