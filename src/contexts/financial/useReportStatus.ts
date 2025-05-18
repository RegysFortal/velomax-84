
import { FinancialReport } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useReportStatus = (
  financialReports: FinancialReport[],
  updateFinancialReport: (id: string, report: Partial<FinancialReport>) => Promise<void>
) => {
  const { toast } = useToast();

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
    
    // Notificar o usuário de que uma conta a receber seria criada automaticamente
    if (paymentMethod || dueDate) {
      toast({
        title: "Conta a receber criada",
        description: `Uma conta a receber foi criada automaticamente para o relatório.`,
      });
    }
    
    console.log("Relatórios após fechamento:", 
      financialReports.map(r => ({id: r.id, status: r.status}))
    );
    
    toast({
      title: "Relatório fechado",
      description: `O relatório financeiro foi fechado com sucesso.`,
    });
  };

  const reopenReport = async (id: string, newStatus: 'open' | 'closed' = 'open') => {
    console.log(`Alterando status do relatório com ID: ${id} para ${newStatus}`);
    const reportToReopen = financialReports.find(report => report.id === id);
    
    if (!reportToReopen) {
      console.error(`Relatório com ID ${id} não encontrado.`);
      toast({
        title: "Erro ao alterar status do relatório",
        description: "Relatório não encontrado.",
        variant: "destructive"
      });
      return;
    }
    
    await updateFinancialReport(id, { status: newStatus });
    
    console.log("Relatórios após mudança de status:", 
      financialReports.map(r => ({id: r.id, status: r.status}))
    );
    
    const actionMessage = newStatus === 'open' ? "reaberto" : "retornado para fechados";
    
    toast({
      title: `Relatório ${actionMessage}`,
      description: `O relatório financeiro foi ${actionMessage} com sucesso.`,
    });
  };

  const archiveReport = async (id: string) => {
    console.log(`Arquivando relatório com ID: ${id}`);
    const reportToArchive = financialReports.find(report => report.id === id);
    
    if (!reportToArchive) {
      console.error(`Relatório com ID ${id} não encontrado.`);
      toast({
        title: "Erro ao arquivar relatório",
        description: "Relatório não encontrado.",
        variant: "destructive"
      });
      return;
    }
    
    await updateFinancialReport(id, { 
      status: 'archived',
      updatedAt: new Date().toISOString()
    });
    
    console.log("Relatório arquivado com sucesso:", id);
    console.log("Status atual dos relatórios:", 
      financialReports.map(r => ({id: r.id, status: r.status}))
    );
    
    toast({
      title: "Relatório arquivado",
      description: `O relatório financeiro foi arquivado com sucesso.`,
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
    
    // Notificar o usuário que os detalhes da conta a receber seriam atualizados
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
    archiveReport,
    updatePaymentDetails
  };
};
