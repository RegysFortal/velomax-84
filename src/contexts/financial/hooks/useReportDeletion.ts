
import { useFinancial } from '@/contexts/financial';
import { useReceivableAccounts } from '@/hooks/financial/useReceivableAccounts';

/**
 * Hook for handling report deletion operations
 */
export function useReportDeletion() {
  const { deleteFinancialReport } = useFinancial();
  const { deleteReceivableAccount } = useReceivableAccounts();

  const handleDeleteReport = async (reportId: string) => {
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
    handleDeleteReport
  };
}
