
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { FinancialReport } from '@/types';
import { useFinancial } from '@/contexts/financial';
import { useClients } from '@/contexts';
import { useReceivableAccounts } from '@/hooks/financial/useReceivableAccounts';
import { useFinancialReportUtils } from '@/hooks/financial/useFinancialReportUtils';

export function useFinancialPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("open");
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  const [reportToClose, setReportToClose] = useState<FinancialReport | null>(null);
  const [reportToEdit, setReportToEdit] = useState<FinancialReport | null>(null);
  
  // Get financial data safely with fallbacks
  const { 
    financialReports = [], 
    loading: isLoading = false, 
    closeReport, 
    reopenReport, 
    deleteFinancialReport,
    updatePaymentDetails 
  } = useFinancial();
  
  const { clients } = useClients();
  const { 
    createReceivableAccount, 
    deleteReceivableAccount, 
    updateReceivableAccount 
  } = useReceivableAccounts();
  
  const { 
    formatCurrency, 
    getPaymentMethodLabel, 
    handleExportPDF, 
    handleExportExcel 
  } = useFinancialReportUtils();
  
  // Filter reports by status
  const openReports = financialReports.filter(report => report.status === 'open');
  const closedReports = financialReports.filter(report => report.status === 'closed');
  
  return {
    navigate,
    toast,
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
    closeReport,
    reopenReport,
    deleteFinancialReport,
    updatePaymentDetails,
    clients,
    createReceivableAccount,
    deleteReceivableAccount,
    updateReceivableAccount,
    formatCurrency,
    getPaymentMethodLabel,
    handleExportPDF,
    handleExportExcel,
    openReports,
    closedReports
  };
}
