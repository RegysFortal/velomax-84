
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useFinancial } from '@/contexts/financial';
import { useClients } from '@/contexts';
import { useReceivableAccounts } from '@/hooks/financial/useReceivableAccounts';
import { useFinancialReportUtils } from '@/hooks/financial/useFinancialReportUtils';
import { FinancialReport } from '@/types';

export const useFinancialPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // States
  const [activeTab, setActiveTab] = useState("open");
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  const [reportToClose, setReportToClose] = useState<FinancialReport | null>(null);
  const [reportToEdit, setReportToEdit] = useState<FinancialReport | null>(null);
  
  // Contexts
  const { 
    financialReports = [], 
    loading: isLoading = false, 
    closeReport, 
    reopenReport, 
    deleteFinancialReport,
    updatePaymentDetails 
  } = useFinancial();
  
  const { clients } = useClients();
  const { deleteReceivableAccount } = useReceivableAccounts();
  const { formatCurrency, getPaymentMethodLabel, handleExportPDF, handleExportExcel } = useFinancialReportUtils();
  
  // Filter reports
  const openReports = financialReports.filter(report => report.status === 'open');
  const closedReports = financialReports.filter(report => report.status === 'closed');
  
  // Handlers
  const handleViewReport = (reportId: string) => {
    navigate(`/reports?reportId=${reportId}`);
  };
  
  const handleCloseReportWithDetails = async (reportId: string, paymentMethod: string, dueDate: string) => {
    try {
      await closeReport(reportId, paymentMethod, dueDate);
    } catch (error) {
      console.error("Erro ao fechar relatório:", error);
    }
  };

  const handleEditPaymentDetails = async (reportId: string, paymentMethod: string | null, dueDate: string | null) => {
    try {
      await updatePaymentDetails(reportId, paymentMethod, dueDate);
    } catch (error) {
      console.error("Erro ao atualizar detalhes de pagamento:", error);
    }
  };

  const handleReopenReport = async (reportId: string) => {
    try {
      await reopenReport(reportId);
    } catch (error) {
      console.error("Erro ao reabrir relatório:", error);
    }
  };
  
  const handleDeleteReport = async () => {
    if (reportToDelete) {
      try {
        await deleteReceivableAccount(reportToDelete);
        await deleteFinancialReport(reportToDelete);
        setReportToDelete(null);
      } catch (error) {
        console.error("Erro ao excluir relatório:", error);
      }
    }
  };

  return {
    activeTab,
    setActiveTab,
    reportToDelete,
    setReportToDelete,
    reportToClose,
    setReportToClose,
    reportToEdit,
    setReportToEdit,
    financialReports,
    isLoading,
    openReports,
    closedReports,
    handleViewReport,
    handleCloseReportWithDetails,
    handleEditPaymentDetails,
    handleReopenReport,
    handleDeleteReport,
    formatCurrency,
    getPaymentMethodLabel,
    handleExportPDF,
    handleExportExcel
  };
};
