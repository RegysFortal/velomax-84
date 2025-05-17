
import { useFinancial } from '@/contexts/financial';
import { useReceivableAccounts } from '@/hooks/financial/useReceivableAccounts';

/**
 * Hook for handling report deletion operations
 */
export function useReportDeletion() {
  const { deleteFinancialReport } = useFinancial();
  const { deleteReceivableAccount } = useReceivableAccounts();

  // Updated return type to Promise<void> for compatibility with Financial.tsx
  const handleDeleteReport = async (reportId: string): Promise<void> => {
    if (reportId) {
      try {
        // First delete the related receivable account
        await deleteReceivableAccount(reportId);
        
        // Then delete the report
        await deleteFinancialReport(reportId);
      } catch (error) {
        console.error("Erro ao excluir relatório:", error);
      }
    }
  };

  // Internal method with original return type for when boolean result is needed
  const _handleDeleteReport = async (reportId: string): Promise<boolean> => {
    if (reportId) {
      try {
        // First delete the related receivable account
        await deleteReceivableAccount(reportId);
        
        // Then delete the report
        await deleteFinancialReport(reportId);
        
        return true;
      } catch (error) {
        console.error("Erro ao excluir relatório:", error);
        return false;
      }
    }
    return false;
  };

  return {
    handleDeleteReport,
    _handleDeleteReport
  };
}
