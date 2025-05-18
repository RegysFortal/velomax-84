
import { useEffect } from 'react';
import { FinancialReport } from '@/types';

export const useFinancialStorage = (financialReports: FinancialReport[], loading: boolean) => {
  useEffect(() => {
    if (!loading && financialReports.length > 0) {
      // Store the entire reports array in localStorage, ensuring archived reports are saved
      localStorage.setItem('velomax_financial_reports', JSON.stringify(financialReports));
      
      // Log the reports that are being stored for debugging purposes
      console.log('Stored financial reports in localStorage:', 
        financialReports.map(r => ({ id: r.id, status: r.status })));
      
      // Count reports by status
      const archivedCount = financialReports.filter(r => r.status === 'archived').length;
      const closedCount = financialReports.filter(r => r.status === 'closed').length;
      const openCount = financialReports.filter(r => r.status === 'open').length;
      
      console.log(`Reports counts - Archived: ${archivedCount}, Closed: ${closedCount}, Open: ${openCount}`);
    }
  }, [financialReports, loading]);
};
