
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { FinancialReport } from '@/types';

export function useReportActions({
  closeReport,
  createReceivableAccount,
  clients,
  reopenReport,
  deleteReceivableAccount,
  deleteFinancialReport,
  updatePaymentDetails,
  updateReceivableAccount
}: {
  closeReport: (reportId: string, paymentMethod?: string, dueDate?: string) => Promise<void>;
  createReceivableAccount: any;
  clients: any[];
  reopenReport: (reportId: string) => Promise<void>;
  deleteReceivableAccount: (reportId: string) => Promise<boolean>;
  deleteFinancialReport: (reportId: string) => Promise<void>;
  updatePaymentDetails: (reportId: string, paymentMethod: string | null, dueDate: string | null) => Promise<void>;
  updateReceivableAccount: (reportId: string, data: { paymentMethod?: string; dueDate?: string; }) => Promise<boolean>;
}) {
  const navigate = useNavigate();
  
  const handleViewReport = (reportId: string) => {
    // Navigate to reports page with the specific report ID
    navigate(`/reports?reportId=${reportId}`);
  };
  
  const handleCloseReportWithDetails = async (reportId: string, paymentMethod: string, dueDate: string) => {
    try {
      // First update the additional report data
      await closeReport(reportId, paymentMethod, dueDate);
      
      // Then create the receivable account automatically
      const report = financialReports.find(r => r.id === reportId);
      const client = report ? clients.find(c => c.id === report.clientId) : null;
      
      if (report && client) {
        // Create data for receivable account
        await createReceivableAccount({
          clientId: report.clientId,
          clientName: client.name,
          description: `Relatório ${format(new Date(report.startDate), 'dd/MM/yyyy', { locale: ptBR })} a ${format(new Date(report.endDate), 'dd/MM/yyyy', { locale: ptBR })}`,
          amount: report.totalFreight,
          dueDate: dueDate,
          status: 'pending',
          categoryId: 'fretes', // Freight category
          categoryName: 'Fretes',
          reportId: report.id,
          paymentMethod: paymentMethod,
          notes: `Referente ao relatório de ${client.name} no período de ${format(new Date(report.startDate), 'dd/MM/yyyy', { locale: ptBR })} a ${format(new Date(report.endDate), 'dd/MM/yyyy', { locale: ptBR })}`,
        });
      }
    } catch (error) {
      console.error("Error closing report:", error);
    }
  };

  // Function to edit payment details
  const handleEditPaymentDetails = async (reportId: string, paymentMethod: string | null, dueDate: string | null) => {
    try {
      await updatePaymentDetails(reportId, paymentMethod, dueDate);
      
      // Also update the corresponding receivable account
      if (paymentMethod !== null || dueDate !== null) {
        await updateReceivableAccount(reportId, {
          paymentMethod: paymentMethod || undefined,
          dueDate: dueDate || undefined
        });
      }
    } catch (error) {
      console.error("Error updating payment details:", error);
    }
  };

  const handleReopenReport = async (reportId: string) => {
    try {
      await reopenReport(reportId);
      
      // Delete the related receivable account
      await deleteReceivableAccount(reportId);
    } catch (error) {
      console.error("Error reopening report:", error);
    }
  };
  
  const handleDeleteReport = async (reportId: string) => {
    if (reportId) {
      try {
        // Delete the receivable account related to the report
        await deleteReceivableAccount(reportId);
        
        // Then delete the report
        await deleteFinancialReport(reportId);
      } catch (error) {
        console.error("Error deleting report:", error);
      }
    }
  };

  return {
    handleViewReport,
    handleCloseReportWithDetails,
    handleEditPaymentDetails,
    handleReopenReport,
    handleDeleteReport
  };
}

// This avoids a TypeScript error when accessing financialReports
declare const financialReports: FinancialReport[];
