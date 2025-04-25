
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { usePriceTables } from '@/contexts/priceTables';
import { PriceTable } from '@/types';

export function usePriceTablesCRUD() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPriceTable, setEditingPriceTable] = useState<PriceTable | null>(null);
  const { priceTables, deletePriceTable } = usePriceTables();
  const { toast } = useToast();

  const handleEdit = (priceTable: PriceTable) => {
    setEditingPriceTable(priceTable);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePriceTable(id);
      toast({
        title: "Tabela de preços removida",
        description: "A tabela de preços foi removida com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao remover tabela de preços:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao remover a tabela de preços.",
        variant: "destructive",
      });
    }
  };

  return {
    priceTables,
    isDialogOpen,
    setIsDialogOpen,
    editingPriceTable,
    setEditingPriceTable,
    handleEdit,
    handleDelete,
  };
}
