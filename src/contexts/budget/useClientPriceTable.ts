
import { useClients, usePriceTables } from '@/contexts';
import { PriceTable } from '@/types/priceTable';

export function useClientPriceTable() {
  const { clients } = useClients();
  const { priceTables } = usePriceTables();

  const getClientPriceTable = (clientId: string): PriceTable | undefined => {
    // Encontra o cliente pelo ID
    const client = clients.find(c => c.id === clientId);
    
    // Se o cliente não for encontrado ou não tiver tabela de preço associada
    if (!client || !client.priceTableId) {
      console.log(`Cliente não encontrado ou sem tabela de preço: ${clientId}`);
      return undefined;
    }
    
    // Encontra a tabela de preço pelo ID
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
