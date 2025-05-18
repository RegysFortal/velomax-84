import { useEffect } from 'react';
import { FinancialReport } from '@/types';
import { User } from '@supabase/supabase-js';

export const useFetchFinancialReports = (
  user: User | null | undefined,
  setFinancialReports: (reports: FinancialReport[]) => void,
  setLoading: (loading: boolean) => void
) => {
  useEffect(() => {
    // Set loading to true while fetching data
    setLoading(true);
    
    // Attempt to load from localStorage first
    const storedReports = localStorage.getItem('velomax_financial_reports');
    
    if (storedReports) {
      try {
        const parsedReports = JSON.parse(storedReports) as FinancialReport[];
        console.log('Loaded financial reports from localStorage:', 
          parsedReports.map(r => ({ id: r.id, status: r.status })));
        setFinancialReports(parsedReports);
      } catch (error) {
        console.error('Error parsing financial reports from localStorage:', error);
      }
    }
    
    // In a real implementation, we would fetch data from the database here
    // For now, we're just using the localStorage data
    
    // Set loading to false when done
    setLoading(false);
  }, [user, setFinancialReports, setLoading]);
};
