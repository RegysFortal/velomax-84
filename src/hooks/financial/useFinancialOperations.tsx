
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

  return {
    handleViewReport,
    handleCloseReportWithDetails,
    handleEditPaymentDetails,
    handleReopenReport,
    handleDeleteReport,
    handleSendToReceivables
  };
}
