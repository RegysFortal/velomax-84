
import { useNavigate } from 'react-router-dom';
import { FinancialReport } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useReportView } from '@/contexts/financial/hooks/useReportView';
import { useReportPayment } from '@/contexts/financial/hooks/useReportPayment';
import { useReportDeletion } from '@/contexts/financial/hooks/useReportDeletion';
import { useReceivablesOperations } from '@/contexts/financial/hooks/useReceivablesOperations';
import { useFinancial } from '@/contexts/financial';

export function useFinancialOperations() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { archiveReport } = useFinancial();
  
  // Compose all the hooks
  const { handleViewReport } = useReportView();
  const { 
    handleCloseReportWithDetails,
    handleEditPaymentDetails,
    handleReopenReport
  } = useReportPayment();
  const { handleDeleteReport } = useReportDeletion();
  const { handleSendToReceivables } = useReceivablesOperations();

  // Function to archive a report
  const handleArchiveReport = async (reportId: string) => {
    try {
      await archiveReport(reportId);
      toast({
        title: "Relatório arquivado",
        description: "Relatório movido para a seção de arquivados com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao arquivar relatório:", error);
      toast({
        title: "Erro",
        description: "Não foi possível arquivar o relatório.",
        variant: "destructive"
      });
    }
  };

  return {
    handleViewReport,
    handleCloseReportWithDetails,
    handleEditPaymentDetails,
    handleReopenReport,
    handleDeleteReport,
    handleSendToReceivables,
    handleArchiveReport
  };
}
