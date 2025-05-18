
import { useEffect } from 'react';
import { FinancialReport } from '@/types';

export const useFinancialStorage = (financialReports: FinancialReport[], loading: boolean) => {
  useEffect(() => {
    if (!loading) {
      // Store the entire reports array in localStorage, ensuring archived reports are saved
      localStorage.setItem('velomax_financial_reports', JSON.stringify(financialReports));
      console.log('Stored financial reports in localStorage:', 
        financialReports.map(r => ({ id: r.id, status: r.status })));
    }
  }, [financialReports, loading]);
};
