
import { FinancialReport } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useReceivableAccounts } from '@/hooks/financial/useReceivableAccounts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useClients } from '@/contexts';

export const useReportStatus = (
  financialReports: FinancialReport[],
  updateFinancialReport: (id: string, report: Partial<FinancialReport>) => Promise<void>
) => {
  const { toast } = useToast();
  const { clients } = useClients();
  const { createReceivableAccount, deleteReceivableAccount, updateReceivableAccount } = useReceivableAccounts();

  const getFinancialReport = (id: string) => {
    return financialReports.find((report) => report.id === id);
  };
  
  const getReportsByStatus = (status: FinancialReport['status']) => {
    return financialReports.filter((report) => report.status === status);
  };

  const closeReport = async (id: string, paymentMethod?: string, dueDate?: string) => {
    try {
      console.log(`Fechando relatório com ID: ${id}, método: ${paymentMethod}, vencimento: ${dueDate}`);
      const reportToClose = financialReports.find(report => report.id === id);
      
      if (!reportToClose) {
        console.error(`Relatório com ID ${id} não encontrado.`);
        toast({
          title: "Erro ao fechar relatório",
          description: "Relatório não encontrado.",
          variant: "destructive"
        });
        return;
      }
      
      // Atualiza o status do relatório para fechado
      const updateData: Partial<FinancialReport> = {
        status: 'closed',
        paymentMethod,
        dueDate
      };
      
      await updateFinancialReport(id, updateData);
      
      // Criar conta a receber automaticamente para o relatório fechado
      const client = clients.find(c => c.id === reportToClose.clientId);
      
      if (client && paymentMethod && dueDate) {
        // Preparar dados para criar a conta a receber
        const accountData = {
          clientId: reportToClose.clientId,
          clientName: client.name,
          description: `Relatório ${format(new Date(reportToClose.startDate), 'dd/MM/yyyy', { locale: ptBR })} a ${format(new Date(reportToClose.endDate), 'dd/MM/yyyy', { locale: ptBR })}`,
          amount: reportToClose.totalFreight,
          dueDate: dueDate,
          status: 'pending' as const, // Explicitly defining status as a literal type
          categoryId: 'fretes', // Categoria padrão para fretes
          categoryName: 'Fretes',
          reportId: reportToClose.id,
          paymentMethod: paymentMethod,
          notes: `Referente ao relatório de ${client.name} no período de ${format(new Date(reportToClose.startDate), 'dd/MM/yyyy', { locale: ptBR })} a ${format(new Date(reportToClose.endDate), 'dd/MM/yyyy', { locale: ptBR })}`
        };
        
        try {
          // Tenta criar a conta a receber
          const result = await createReceivableAccount(accountData);
          
          console.log("Conta a receber criada/atualizada:", result);
          
          toast({
            title: "Conta a receber criada",
            description: `Uma conta a receber foi criada automaticamente para ${client.name}.`,
          });
        } catch (error) {
          console.error("Erro ao criar conta a receber:", error);
          toast({
            title: "Erro ao criar conta a receber",
            description: "Não foi possível criar a conta a receber para este relatório.",
            variant: "destructive"
          });
        }
      } else {
        console.error("Dados insuficientes para criar conta a receber:", { client, paymentMethod, dueDate });
        if (!client) {
          toast({
            title: "Erro ao criar conta a receber",
            description: "Cliente não encontrado.",
            variant: "destructive"
          });
        } else if (!paymentMethod || !dueDate) {
          toast({
            title: "Erro ao criar conta a receber",
            description: "Método de pagamento ou data de vencimento não informados.",
            variant: "destructive"
          });
        }
      }
      
      toast({
        title: "Relatório fechado",
        description: `O relatório financeiro foi fechado com sucesso.`,
      });
    } catch (error) {
      console.error("Erro ao fechar relatório:", error);
      toast({
        title: "Erro ao fechar relatório",
        description: "Ocorreu um erro ao fechar o relatório.",
        variant: "destructive"
      });
    }
  };

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
          variant: "default"  // Changed from "warning" to "default"
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

  return {
    getFinancialReport,
    getReportsByStatus,
    closeReport,
    reopenReport,
    updatePaymentDetails
  };
};
