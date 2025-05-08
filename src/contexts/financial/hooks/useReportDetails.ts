
import { FinancialReport } from '@/types';

export const useReportDetails = (financialReports: FinancialReport[]) => {
  const getFinancialReport = (id: string) => {
    return financialReports.find((report) => report.id === id);
  };
  
  const getReportsByStatus = (status: FinancialReport['status']) => {
    return financialReports.filter((report) => report.status === status);
  };

  return {
    getFinancialReport,
    getReportsByStatus,
  };
};
