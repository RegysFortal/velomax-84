
import { useActivityLog } from '@/contexts/ActivityLogContext';
import { useClients } from '@/contexts';
import { Delivery } from '@/types';

export const useActivityLogging = () => {
  const { addLog } = useActivityLog();
  const { clients } = useClients();

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? (client.tradingName || client.name) : 'Cliente desconhecido';
  };

  const logDeliveryUpdate = (delivery: Delivery, clientId: string) => {
    const clientName = getClientName(clientId);
    
    addLog({
      action: 'update',
      entityType: 'delivery',
      entityId: delivery.id,
      entityName: `Minuta ${delivery.minuteNumber} - ${clientName}`,
      details: `Entrega atualizada: ${delivery.minuteNumber}`
    });
  };

  const logDeliveryCreation = (minuteNumber: string, clientId: string) => {
    const clientName = getClientName(clientId);
    
    addLog({
      action: 'create',
      entityType: 'delivery',
      entityId: '',
      entityName: `Nova entrega - ${clientName}`,
      details: `Nova entrega criada para ${clientName}`
    });
  };

  return {
    logDeliveryUpdate,
    logDeliveryCreation,
    getClientName
  };
};
