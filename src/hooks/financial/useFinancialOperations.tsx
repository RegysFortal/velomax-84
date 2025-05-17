
import { useNavigate } from 'react-router-dom';
import { FinancialReport } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useReportView } from '@/contexts/financial/hooks/useReportView';
import { useReportPayment } from '@/contexts/financial/hooks/useReportPayment';
import { useReportDeletion } from '@/contexts/financial/hooks/useReportDeletion';
import { useReceivablesOperations } from '@/contexts/financial/hooks/useReceivablesOperations';

export function useFinancialOperations() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Compose all the hooks
  const { handleViewReport } = useReportView();
  const { 
    handleCloseReportWithDetails,
    handleEditPaymentDetails,
    handleReopenReport
  } = useReportPayment();
  const { handleDeleteReport } = useReportDeletion();
  const { handleSendToReceivables } = useReceivablesOperations();
  
  // Handle sending reports to receivables with error handling
  const handleSendToReceivablesWithCheck = (report: FinancialReport) => {
    // Verify if the report already has a receivable account
    handleSendToReceivables(report).catch(error => {
      if (error.message === 'REPORT_ALREADY_IN_RECEIVABLES') {
        toast({
          title: "Aviso",
          description: "Este relatório já consta em contas a receber.",
        });
      } else {
        toast({
          title: "Erro",
          description: "Erro ao enviar relatório para contas a receber.",
          variant: "destructive"
        });
      }
    });
  };
  
  return {
    handleViewReport,
    handleCloseReportWithDetails,
    handleEditPaymentDetails,
    handleReopenReport,
    handleDeleteReport,
    handleSendToReceivables: handleSendToReceivablesWithCheck
  };
}
