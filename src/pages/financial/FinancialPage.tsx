
import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Logo } from '@/components/ui/logo';
import { useFinancialPage } from './hooks/useFinancialPage';
import { useReportActions } from './hooks/useReportActions';
import { FinancialPageHeader } from './components/FinancialPageHeader';
import { FinancialTabs } from './components/FinancialTabs';
import { FinancialDialogs } from './components/FinancialDialogs';

const FinancialPage = () => {
  // Get all data and state from hooks
  const {
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
  } = useFinancialPage();
  
  // Get report actions
  const {
    handleViewReport,
    handleCloseReportWithDetails,
    handleEditPaymentDetails,
    handleReopenReport,
    handleDeleteReport
  } = useReportActions({
    closeReport,
    createReceivableAccount,
    clients,
    reopenReport,
    deleteReceivableAccount,
    deleteFinancialReport,
    updatePaymentDetails,
    updateReceivableAccount
  });
  
  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (reportToDelete) {
      await handleDeleteReport(reportToDelete);
      setReportToDelete(null);
    }
  };
  
  return (
    <AppLayout>
      <ScrollArea className="h-[calc(100vh-148px)] w-full">
        <div className="flex flex-col gap-6 px-8 py-6">
          <FinancialPageHeader />
          
          {/* Hidden logo for PDF generation */}
          <div className="hidden">
            <Logo className="company-logo" />
          </div>
          
          <FinancialTabs 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            openReports={openReports}
            closedReports={closedReports}
            isLoading={isLoading}
            formatCurrency={formatCurrency}
            onViewReport={handleViewReport}
            onCloseReport={setReportToClose}
            onReopenReport={handleReopenReport}
            onDeleteReport={setReportToDelete}
            onEditPaymentDetails={setReportToEdit}
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
            getPaymentMethodLabel={getPaymentMethodLabel}
          />
        </div>
      </ScrollArea>
      
      <FinancialDialogs 
        reportToClose={reportToClose}
        onReportCloseChange={(open) => !open && setReportToClose(null)}
        onClose={handleCloseReportWithDetails}
        reportToEdit={reportToEdit}
        onReportEditChange={(open) => !open && setReportToEdit(null)}
        onSave={handleEditPaymentDetails}
        reportToDelete={reportToDelete}
        onReportDeleteChange={(open) => !open && setReportToDelete(null)}
        onDelete={handleConfirmDelete}
      />
    </AppLayout>
  );
};

export default FinancialPage;
