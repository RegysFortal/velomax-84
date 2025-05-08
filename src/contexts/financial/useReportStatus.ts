
import { FinancialReport } from '@/types';
import { useClients } from '@/contexts';
import { useReportDetails } from './hooks/useReportDetails';
import { useReportClose } from './hooks/useReportClose';
import { useReportReopen } from './hooks/useReportReopen';
import { usePaymentDetails } from './hooks/usePaymentDetails';

export const useReportStatus = (
  financialReports: FinancialReport[],
  updateFinancialReport: (id: string, report: Partial<FinancialReport>) => Promise<void>
) => {
  const { clients } = useClients();
  
  // Use the separated hooks
  const { getFinancialReport, getReportsByStatus } = useReportDetails(financialReports);
  const { closeReport } = useReportClose(financialReports, clients, updateFinancialReport);
  const { reopenReport } = useReportReopen(financialReports, updateFinancialReport);
  const { updatePaymentDetails } = usePaymentDetails(financialReports, updateFinancialReport);

  return {
    getFinancialReport,
    getReportsByStatus,
    closeReport,
    reopenReport,
    updatePaymentDetails
  };
};
