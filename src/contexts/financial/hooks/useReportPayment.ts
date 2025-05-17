
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

  // Updated to match the expected signature in Financial.tsx
  const handleCloseReportWithDetails = async (reportId: string, paymentMethod: string, dueDate: string): Promise<void> => {
    try {
      // First update the report details
      await closeReport(reportId, paymentMethod, dueDate);
    } catch (error) {
      console.error("Erro ao fechar relatório:", error);
    }
  };

  // Updated to match the expected signature in Financial.tsx
  const handleEditPaymentDetails = async (reportId: string, paymentMethod: string, dueDate: string): Promise<void> => {
    try {
      await updatePaymentDetails(reportId, paymentMethod, dueDate);
      
      // Also update the corresponding receivable account
      await updateReceivableAccount(reportId, {
        paymentMethod,
        dueDate
      });
    } catch (error) {
      console.error("Erro ao atualizar detalhes de pagamento:", error);
    }
  };

  // Updated to match the expected signature in Financial.tsx
  const handleReopenReport = async (reportId: string): Promise<void> => {
    try {
      await reopenReport(reportId);
      
      // Delete the related receivable account
      await deleteReceivableAccount(reportId);
    } catch (error) {
      console.error("Erro ao reabrir relatório:", error);
    }
  };

  // Keep the original methods with their original signatures for internal use
  const _handleCloseReportWithParams = async ({ reportId, paymentMethod, dueDate }: CloseReportParams): Promise<boolean> => {
    try {
      // First update the report details
      await closeReport(reportId, paymentMethod, dueDate);
      return true;
    } catch (error) {
      console.error("Erro ao fechar relatório:", error);
      return false;
    }
  };

  const _handleEditPaymentDetails = async ({ reportId, paymentMethod, dueDate }: ReportPaymentDetails): Promise<boolean> => {
    try {
      if (paymentMethod !== null || dueDate !== null) {
        await updatePaymentDetails(reportId, paymentMethod, dueDate);
        
        // Also update the corresponding receivable account
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

  const _handleReopenReport = async (reportId: string): Promise<boolean> => {
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
    handleReopenReport,
    // Export the internal methods for components that need the original signatures
    _handleCloseReportWithParams,
    _handleEditPaymentDetails,
    _handleReopenReport
  };
}
