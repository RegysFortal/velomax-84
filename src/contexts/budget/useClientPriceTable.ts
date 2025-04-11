
import { useClients, usePriceTables } from '@/contexts';
import { PriceTable } from '@/types/priceTable';

export function useClientPriceTable() {
  const { clients } = useClients();
  const { priceTables } = usePriceTables();

  const getClientPriceTable = (clientId: string): PriceTable | undefined => {
    const client = clients.find(c => c.id === clientId);
    if (!client || !client.priceTableId) return undefined;
    
    return priceTables.find(pt => pt.id === client.priceTableId);
  };

  return { getClientPriceTable };
}
