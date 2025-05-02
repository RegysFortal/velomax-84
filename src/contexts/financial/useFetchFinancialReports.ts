
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FinancialReport } from '@/types';

export const useFetchFinancialReports = (
  user: any | null,
  setFinancialReports: React.Dispatch<React.SetStateAction<FinancialReport[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchFinancialReports = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('financial_reports')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        const mappedReports = data.map((report: any): FinancialReport => ({
          id: report.id,
          clientId: report.client_id,
          startDate: report.start_date,
          endDate: report.end_date,
          totalDeliveries: report.total_deliveries,
          totalFreight: report.total_freight,
          status: report.status as FinancialReport['status'],
          createdAt: report.created_at || new Date().toISOString(),
          updatedAt: report.updated_at || new Date().toISOString(),
        }));
        
        setFinancialReports(mappedReports);
      } catch (error) {
        console.error('Error fetching financial reports:', error);
        toast({
          title: "Erro ao carregar relatórios financeiros",
          description: "Usando dados locais como fallback.",
          variant: "destructive"
        });
        
        const storedReports = localStorage.getItem('velomax_financial_reports');
        if (storedReports) {
          try {
            setFinancialReports(JSON.parse(storedReports));
          } catch (error) {
            console.error('Failed to parse stored reports', error);
            setFinancialReports([]);
          }
        } else {
          setFinancialReports([]);
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchFinancialReports();
    }
  }, [toast, user, setFinancialReports, setLoading]);

  useEffect(() => {
    const saveToLocalStorage = (reports: FinancialReport[]) => {
      localStorage.setItem('velomax_financial_reports', JSON.stringify(reports));
    };

    return () => {
      // We don't actually want to execute anything on unmount
      // This is just to satisfy the linter that expects a cleanup function
    };
  }, []);
};
