
import { PriceTable } from '@/types';
import { useToast } from '@/components/ui/use-toast';

export const usePriceTableState = (
  priceTables: PriceTable[],
  setPriceTables: React.Dispatch<React.SetStateAction<PriceTable[]>>
) => {
  const { toast } = useToast();

  const addPriceTableToState = (newPriceTable: PriceTable) => {
    setPriceTables((prev) => [...prev, newPriceTable]);
  };

  const updatePriceTableInState = (id: string, updatedTable: Partial<PriceTable>) => {
    setPriceTables((prev) =>
      prev.map((table) =>
        table.id === id ? { ...table, ...updatedTable } : table
      )
    );
  };

  const removePriceTableFromState = (id: string) => {
    setPriceTables((prev) => prev.filter((table) => table.id !== id));
  };

  return {
    addPriceTableToState,
    updatePriceTableInState,
    removePriceTableFromState,
  };
};
