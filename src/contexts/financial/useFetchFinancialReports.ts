
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
        
        // Ensure we maintain all reports regardless of status
        const validReports = parsedReports.filter(report => 
          report && report.id && report.status && report.clientId
        );
        
        // Count reports by status
        const archivedCount = validReports.filter(r => r.status === 'archived').length;
        const closedCount = validReports.filter(r => r.status === 'closed').length;
        const openCount = validReports.filter(r => r.status === 'open').length;
        
        console.log('Loaded financial reports from localStorage:', 
          validReports.map(r => ({ id: r.id, status: r.status, clientId: r.clientId })));
        console.log(`Loaded reports counts - Archived: ${archivedCount}, Closed: ${closedCount}, Open: ${openCount}`);
        
        // Set the reports in state - this should include ALL reports
        setFinancialReports(validReports);
      } catch (error) {
        console.error('Error parsing financial reports from localStorage:', error);
        // Initialize with empty array if parsing fails
        setFinancialReports([]);
      }
    } else {
      console.log('No financial reports found in localStorage');
      // Initialize with empty array if no data found
      setFinancialReports([]);
    }
    
    // In a real implementation, we would fetch data from the database here
    // For now, we're just using the localStorage data
    
    // Set loading to false when done
    setLoading(false);
  }, [user, setFinancialReports, setLoading]);
};
