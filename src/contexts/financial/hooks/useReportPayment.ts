
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useFinancial } from '@/contexts/financial';
import { useToast } from '@/hooks/use-toast';
import { useReceivableAccounts } from '@/hooks/financial/useReceivableAccounts';
import { FinancialReport } from '@/types';
import { CloseReportParams, ReportPaymentDetails } from './types';

/**
 * Hook for handling payment-related operations for financial reports
 */
export function useReportPayment() {
  const { toast } = useToast();
  const { 
    closeReport, 
    reopenReport,
    updatePaymentDetails
  } = useFinancial();

  const { 
    createReceivableAccount, 
    deleteReceivableAccount, 
    updateReceivableAccount,
    checkReceivableAccountExists 
  } = useReceivableAccounts();

  const handleCloseReportWithDetails = async ({ reportId, paymentMethod, dueDate }: CloseReportParams) => {
    try {
      // First update the report details
      await closeReport(reportId, paymentMethod, dueDate);
      
      return true;
    } catch (error) {
      console.error("Erro ao fechar relatório:", error);
      return false;
    }
  };

  const handleEditPaymentDetails = async ({ reportId, paymentMethod, dueDate }: ReportPaymentDetails) => {
    try {
      await updatePaymentDetails(reportId, paymentMethod, dueDate);
      
      // Also update the corresponding receivable account
      if (paymentMethod !== null || dueDate !== null) {
        await updateReceivableAccount(reportId, {
          paymentMethod: paymentMethod || undefined,
          dueDate: dueDate || undefined
        });
      }
      
      return true;
    } catch (error) {
      console.error("Erro ao atualizar detalhes de pagamento:", error);
      return false;
    }
  };

  const handleReopenReport = async (reportId: string) => {
    try {
      await reopenReport(reportId);
      
      // Delete the related receivable account
      await deleteReceivableAccount(reportId);
      
      return true;
    } catch (error) {
      console.error("Erro ao reabrir relatório:", error);
      return false;
    }
  };

  return {
    handleCloseReportWithDetails,
    handleEditPaymentDetails,
    handleReopenReport
  };
}
