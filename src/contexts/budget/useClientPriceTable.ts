
import { useClients } from '@/contexts';
import { usePriceTables } from '@/contexts/priceTables';
import { PriceTable } from '@/types/priceTable';

export function useClientPriceTable() {
  // Initialize with default empty values
  let clients = [];
  let priceTables = [];
  
  // Safely get clients from context
  try {
    const clientsContext = useClients();
    clients = clientsContext?.clients || [];
  } catch (error) {
    console.warn("ClientsProvider not available, using empty clients array");
  }
  
  // Safely get price tables from context
  try {
    const priceTablesContext = usePriceTables();
    priceTables = priceTablesContext?.priceTables || [];
  } catch (error) {
    console.warn("PriceTablesProvider not available, using empty price tables array");
  }

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
