
import { useEffect } from 'react';
import { FinancialReport } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';

export const useFetchFinancialReports = (
  user: SupabaseUser | null,
  setFinancialReports: React.Dispatch<React.SetStateAction<FinancialReport[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    if (user) {
      fetchFinancialReports();
    }
  }, [user]);

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

      // Map database fields to our model
      const mappedReports = data.map((report: any): FinancialReport => ({
        id: report.id,
        clientId: report.client_id,
        startDate: report.start_date,
        endDate: report.end_date,
        totalDeliveries: report.total_deliveries,
        totalFreight: report.total_freight, 
        status: report.status,
        createdAt: report.created_at,
        updatedAt: report.updated_at,
        userId: report.user_id,
        paymentMethod: report.payment_method,
        dueDate: report.due_date
      }));

      setFinancialReports(mappedReports);
    } catch (error) {
      console.error("Error fetching financial reports:", error);
    } finally {
      setLoading(false);
    }
  };

  return { fetchFinancialReports };
};
