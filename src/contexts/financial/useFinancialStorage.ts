
import { useEffect } from 'react';
import { FinancialReport } from '@/types';

export const useFinancialStorage = (financialReports: FinancialReport[], loading: boolean) => {
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('velomax_financial_reports', JSON.stringify(financialReports));
    }
  }, [financialReports, loading]);
};
