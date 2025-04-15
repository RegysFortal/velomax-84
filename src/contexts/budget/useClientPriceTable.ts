
import { useClients, usePriceTables } from '@/contexts';
import { PriceTable } from '@/types/priceTable';

export function useClientPriceTable() {
  const { clients } = useClients();
  const { priceTables } = usePriceTables();

  const getClientPriceTable = (clientId: string): PriceTable | undefined => {
    // Find client by ID
    const client = clients.find(c => c.id === clientId);
    
    // If client not found or doesn't have an associated price table
    if (!client) {
      console.log(`Cliente não encontrado: ${clientId}`);
      return undefined;
    }
    
    if (!client.priceTableId) {
      console.log(`Cliente sem tabela de preço associada: ${client.name}`);
      return undefined;
    }
    
    // Find price table by ID
    const priceTable = priceTables.find(pt => pt.id === client.priceTableId);
    
    if (!priceTable) {
      console.log(`Tabela de preço não encontrada: ${client.priceTableId} para cliente: ${client.name}`);
    } else {
      console.log(`Tabela de preço encontrada para cliente ${client.name}: ${priceTable.name}`);
    }
    
    return priceTable;
  };

  return { getClientPriceTable };
}
