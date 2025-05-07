
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
    
    const updateData: Partial<FinancialReport> = {
      status: 'closed',
      paymentMethod,
      dueDate
    };
    
    await updateFinancialReport(id, updateData);
    
    // Criar conta a receber automaticamente para o relatório fechado
    try {
      const client = clients.find(c => c.id === reportToClose.clientId);
      
      if (client && paymentMethod && dueDate) {
        await createReceivableAccount({
          clientId: reportToClose.clientId,
          clientName: client.name,
          description: `Relatório ${format(new Date(reportToClose.startDate), 'dd/MM/yyyy', { locale: ptBR })} a ${format(new Date(reportToClose.endDate), 'dd/MM/yyyy', { locale: ptBR })}`,
          amount: reportToClose.totalFreight,
          dueDate: dueDate,
          status: 'pending',
          categoryId: 'fretes', // Categoria padrão para fretes
          categoryName: 'Fretes',
          reportId: reportToClose.id,
          paymentMethod: paymentMethod,
          notes: `Referente ao relatório de ${client.name} no período de ${format(new Date(reportToClose.startDate), 'dd/MM/yyyy', { locale: ptBR })} a ${format(new Date(reportToClose.endDate), 'dd/MM/yyyy', { locale: ptBR })}`
        });
        
        toast({
          title: "Conta a receber criada",
          description: `Uma conta a receber foi criada automaticamente para ${client.name}.`,
        });
      }
    } catch (error) {
      console.error("Erro ao criar conta a receber:", error);
    }
    
    toast({
      title: "Relatório fechado",
      description: `O relatório financeiro foi fechado com sucesso.`,
    });
  };

  const reopenReport = async (id: string) => {
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
      await deleteReceivableAccount(id);
    } catch (error) {
      console.error("Erro ao excluir conta a receber:", error);
    }
    
    toast({
      title: "Relatório reaberto",
      description: `O relatório financeiro foi reaberto com sucesso.`,
    });
  };
  
  const updatePaymentDetails = async (id: string, paymentMethod: string | null, dueDate: string | null) => {
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
        await updateReceivableAccount(id, {
          paymentMethod: paymentMethod || undefined,
          dueDate: dueDate || undefined
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar conta a receber:", error);
    }
    
    toast({
      title: "Detalhes atualizados",
      description: `Os detalhes de pagamento foram atualizados com sucesso.`,
    });
  };

  return {
    getFinancialReport,
    getReportsByStatus,
    closeReport,
    reopenReport,
    updatePaymentDetails
  };
};
