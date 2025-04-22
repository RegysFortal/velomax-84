
import { PriceTable } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { PriceTableInput } from './types';
import { usePriceTableDatabase } from './hooks/usePriceTableDatabase';
import { usePriceTableState } from './hooks/usePriceTableState';
import { preparePriceTableForDatabase, transformDatabaseResponse } from './utils/priceTableDataTransform';

export const usePriceTableOperations = (
  priceTables: PriceTable[], 
  setPriceTables: React.Dispatch<React.SetStateAction<PriceTable[]>>
) => {
  const { toast } = useToast();
  const { savePriceTableToDb, updatePriceTableInDb, deletePriceTableFromDb } = usePriceTableDatabase();
  const { addPriceTableToState, updatePriceTableInState, removePriceTableFromState } = usePriceTableState(priceTables, setPriceTables);
  
  const addPriceTable = async (priceTable: PriceTableInput, userId?: string) => {
    try {
      const timestamp = new Date().toISOString();
      const supabasePriceTable = preparePriceTableForDatabase({ ...priceTable, userId });
      
      const data = await savePriceTableToDb(supabasePriceTable);
      const newPriceTable = transformDatabaseResponse(data);
      
      addPriceTableToState(newPriceTable);
      
      toast({
        title: "Tabela de preços criada",
        description: `A tabela "${priceTable.name}" foi criada com sucesso.`,
      });
    } catch (error) {
      console.error("Error adding price table:", error);
      toast({
        title: "Erro ao criar tabela de preços",
        description: "Ocorreu um erro ao criar a tabela de preços. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const updatePriceTable = async (id: string, priceTable: Partial<PriceTable>) => {
    try {
      const timestamp = new Date().toISOString();
      const supabasePriceTable = preparePriceTableForDatabase({
        ...priceTable,
        updated_at: timestamp
      });
      
      const data = await updatePriceTableInDb(id, supabasePriceTable);
      
      if (data) {
        const updatedTable = transformDatabaseResponse(data);
        updatePriceTableInState(id, updatedTable);
      } else {
        updatePriceTableInState(id, { ...priceTable, updatedAt: timestamp });
      }
      
      toast({
        title: "Tabela de preços atualizada",
        description: "A tabela foi atualizada com sucesso.",
      });
    } catch (error) {
      console.error("Error updating price table:", error);
      toast({
        title: "Erro ao atualizar tabela de preços",
        description: "Ocorreu um erro ao atualizar a tabela de preços. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const deletePriceTable = async (id: string) => {
    try {
      await deletePriceTableFromDb(id);
      removePriceTableFromState(id);
      
      toast({
        title: "Tabela de preços removida",
        description: "A tabela foi removida com sucesso.",
      });
    } catch (error) {
      console.error("Error deleting price table:", error);
      toast({
        title: "Erro ao remover tabela de preços",
        description: "Ocorreu um erro ao remover a tabela de preços. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  return {
    addPriceTable,
    updatePriceTable,
    deletePriceTable,
  };
};
