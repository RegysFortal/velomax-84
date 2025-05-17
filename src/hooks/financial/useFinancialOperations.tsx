
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useFinancial } from '@/contexts/financial';
import { useClients } from '@/contexts';
import { useReceivableAccounts } from '@/hooks/financial/useReceivableAccounts';
import { FinancialReport } from '@/types';

export function useFinancialOperations() {
  const navigate = useNavigate();
  const { 
    financialReports,
    closeReport, 
    reopenReport, 
    deleteFinancialReport,
    updatePaymentDetails,
    getFinancialReport
  } = useFinancial();
  
  const { clients } = useClients();
  const { 
    createReceivableAccount, 
    deleteReceivableAccount, 
    updateReceivableAccount 
  } = useReceivableAccounts();

  const handleViewReport = (reportId: string) => {
    navigate(`/reports?reportId=${reportId}`);
  };
  
  const handleCloseReportWithDetails = async (reportId: string, paymentMethod: string, dueDate: string) => {
    try {
      // Primeiro atualiza os dados adicionais do relatório
      await closeReport(reportId, paymentMethod, dueDate);
      
      // Depois cria a conta a receber automaticamente
      const report = financialReports.find(r => r.id === reportId);
      const client = report ? clients.find(c => c.id === report.clientId) : null;
      
      if (report && client) {
        // Criar dados para a conta a receber
        await createReceivableAccount({
          clientId: report.clientId,
          clientName: client.name,
          description: `Relatório ${format(new Date(report.startDate), 'dd/MM/yyyy', { locale: ptBR })} a ${format(new Date(report.endDate), 'dd/MM/yyyy', { locale: ptBR })}`,
          amount: report.totalFreight,
          dueDate: dueDate,
          status: 'pending',
          categoryId: 'fretes', // Categoria de fretes
          categoryName: 'Fretes',
          reportId: report.id,
          paymentMethod: paymentMethod,
          notes: `Referente ao relatório de ${client.name} no período de ${format(new Date(report.startDate), 'dd/MM/yyyy', { locale: ptBR })} a ${format(new Date(report.endDate), 'dd/MM/yyyy', { locale: ptBR })}`,
        });
      }
    } catch (error) {
      console.error("Erro ao fechar relatório:", error);
    }
  };

  // Função para editar as informações de pagamento
  const handleEditPaymentDetails = async (reportId: string, paymentMethod: string | null, dueDate: string | null) => {
    try {
      await updatePaymentDetails(reportId, paymentMethod, dueDate);
      
      // Também atualiza a conta a receber correspondente
      if (paymentMethod !== null || dueDate !== null) {
        await updateReceivableAccount(reportId, {
          paymentMethod: paymentMethod || undefined,
          dueDate: dueDate || undefined
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar detalhes de pagamento:", error);
    }
  };

  const handleReopenReport = async (reportId: string) => {
    try {
      await reopenReport(reportId);
      
      // Exclui a conta a receber relacionada
      await deleteReceivableAccount(reportId);
    } catch (error) {
      console.error("Erro ao reabrir relatório:", error);
    }
  };
  
  const handleDeleteReport = async (reportId: string) => {
    if (reportId) {
      try {
        // Excluir a conta a receber relacionada ao relatório
        await deleteReceivableAccount(reportId);
        
        // Depois exclui o relatório
        await deleteFinancialReport(reportId);
      } catch (error) {
        console.error("Erro ao excluir relatório:", error);
      }
    }
  };
  
  return {
    handleViewReport,
    handleCloseReportWithDetails,
    handleEditPaymentDetails,
    handleReopenReport,
    handleDeleteReport
  };
}
