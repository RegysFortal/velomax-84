
import { FinancialReport } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useReceivableAccounts } from '@/hooks/financial/useReceivableAccounts';

export const usePaymentDetails = (
  financialReports: FinancialReport[],
  updateFinancialReport: (id: string, report: Partial<FinancialReport>) => Promise<void>
) => {
  const { toast } = useToast();
  const { updateReceivableAccount } = useReceivableAccounts();
  
  const updatePaymentDetails = async (id: string, paymentMethod: string | null, dueDate: string | null) => {
    try {
      console.log(`Atualizando detalhes de pagamento do relatório com ID: ${id}`);
      const reportToUpdate = financialReports.find(report => report.id === id);
      
      if (!reportToUpdate) {
        console.error(`Relatório com ID ${id} não encontrado.`);
        toast({
          title: "Erro ao atualizar detalhes",
          description: "Relatório não encontrado.",
          variant: "destructive"
        });
        return;
      }
      
      const updateData: Partial<FinancialReport> = {};
      
      // Only include properties that are being updated
      if (paymentMethod !== null) updateData.paymentMethod = paymentMethod;
      if (dueDate !== null) updateData.dueDate = dueDate;
      
      await updateFinancialReport(id, updateData);
      
      // Também atualizar a conta a receber correspondente
      try {
        if (paymentMethod !== null || dueDate !== null) {
          const updateAccountData: any = {};
          if (paymentMethod !== null) updateAccountData.paymentMethod = paymentMethod;
          if (dueDate !== null) updateAccountData.dueDate = dueDate;
          
          const result = await updateReceivableAccount(id, updateAccountData);
          console.log("Resultado da atualização da conta a receber:", result);
          
          if (result) {
            toast({
              title: "Conta a receber atualizada",
              description: "Os detalhes de pagamento da conta a receber foram atualizados.",
            });
          }
        }
      } catch (error) {
        console.error("Erro ao atualizar conta a receber:", error);
        toast({
          title: "Aviso",
          description: "Não foi possível atualizar a conta a receber relacionada.",
          variant: "default"
        });
      }
      
      toast({
        title: "Detalhes atualizados",
        description: `Os detalhes de pagamento foram atualizados com sucesso.`,
      });
    } catch (error) {
      console.error("Erro ao atualizar detalhes de pagamento:", error);
      toast({
        title: "Erro ao atualizar detalhes",
        description: "Ocorreu um erro ao atualizar os detalhes de pagamento.",
        variant: "destructive"
      });
    }
  };

  return { updatePaymentDetails };
};
