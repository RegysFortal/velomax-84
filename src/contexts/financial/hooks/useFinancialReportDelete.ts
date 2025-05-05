
import { FinancialReport } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useFinancialReportDelete = (
  financialReports: FinancialReport[],
  setFinancialReports: React.Dispatch<React.SetStateAction<FinancialReport[]>>
) => {
  const { toast } = useToast();

  const deleteFinancialReport = async (id: string) => {
    try {
      const { error } = await supabase
        .from('financial_reports')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setFinancialReports((prev) => prev.filter((report) => report.id !== id));
      
      toast({
        title: "Relatório financeiro removido",
        description: `O relatório financeiro foi removido com sucesso.`,
      });
    } catch (error) {
      console.error("Error deleting financial report:", error);
      toast({
        title: "Erro ao remover relatório financeiro",
        description: "Ocorreu um erro ao remover o relatório financeiro. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return {
    deleteFinancialReport
  };
};
