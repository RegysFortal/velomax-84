
import { FinancialReport } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useReceivableAccounts } from '@/hooks/financial/useReceivableAccounts';

export const useReportReopen = (
  financialReports: FinancialReport[],
  updateFinancialReport: (id: string, report: Partial<FinancialReport>) => Promise<void>
) => {
  const { toast } = useToast();
  const { deleteReceivableAccount } = useReceivableAccounts();

  const reopenReport = async (id: string) => {
    try {
      console.log(`Reabrindo relatório com ID: ${id}`);
      const reportToReopen = financialReports.find(report => report.id === id);
      
      if (!reportToReopen) {
        console.error(`Relatório com ID ${id} não encontrado.`);
        toast({
          title: "Erro ao reabrir relatório",
          description: "Relatório não encontrado.",
          variant: "destructive"
        });
        return;
      }
      
      await updateFinancialReport(id, { status: 'open' });
      
      // Excluir a conta a receber relacionada quando reabrir o relatório
      try {
        const result = await deleteReceivableAccount(id);
        console.log("Resultado da exclusão da conta a receber:", result);
        if (result) {
          toast({
            title: "Conta a receber excluída",
            description: "A conta a receber relacionada a este relatório foi excluída.",
          });
        }
      } catch (error) {
        console.error("Erro ao excluir conta a receber:", error);
        toast({
          title: "Aviso",
          description: "Não foi possível excluir a conta a receber relacionada.",
          variant: "destructive"
        });
      }
      
      toast({
        title: "Relatório reaberto",
        description: `O relatório financeiro foi reaberto com sucesso.`,
      });
    } catch (error) {
      console.error("Erro ao reabrir relatório:", error);
      toast({
        title: "Erro ao reabrir relatório",
        description: "Ocorreu um erro ao reabrir o relatório.",
        variant: "destructive"
      });
    }
  };

  return { reopenReport };
};
