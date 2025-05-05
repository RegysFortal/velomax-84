
import { FinancialReport } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useFinancialReportUpdate = (
  financialReports: FinancialReport[],
  setFinancialReports: React.Dispatch<React.SetStateAction<FinancialReport[]>>
) => {
  const { toast } = useToast();

  const updateFinancialReport = async (id: string, report: Partial<FinancialReport>) => {
    try {
      const timestamp = new Date().toISOString();
      
      const supabaseReport: any = {
        updated_at: timestamp
      };
      
      if (report.clientId !== undefined) supabaseReport.client_id = report.clientId;
      if (report.startDate !== undefined) supabaseReport.start_date = report.startDate;
      if (report.endDate !== undefined) supabaseReport.end_date = report.endDate;
      if (report.totalDeliveries !== undefined) supabaseReport.total_deliveries = report.totalDeliveries;
      if (report.totalFreight !== undefined) supabaseReport.total_freight = report.totalFreight;
      if (report.status !== undefined) supabaseReport.status = report.status;
      if (report.paymentMethod !== undefined) supabaseReport.payment_method = report.paymentMethod;
      if (report.dueDate !== undefined) supabaseReport.due_date = report.dueDate;

      const { error } = await supabase
        .from('financial_reports')
        .update(supabaseReport)
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setFinancialReports((prev) => 
        prev.map((r) => {
          if (r.id === id) {
            return {
              ...r,
              ...report,
              updatedAt: timestamp
            };
          }
          return r;
        })
      );
      
      toast({
        title: "Relatório financeiro atualizado",
        description: `O relatório financeiro foi atualizado com sucesso.`,
      });
    } catch (error) {
      console.error("Error updating financial report:", error);
      toast({
        title: "Erro ao atualizar relatório financeiro",
        description: "Ocorreu um erro ao atualizar o relatório financeiro. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return {
    updateFinancialReport
  };
};
