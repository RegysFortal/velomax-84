
import { AppLayout } from '@/components/AppLayout';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Logo } from '@/components/ui/logo';
import { CloseReportDialog } from '@/components/financial/CloseReportDialog';
import { EditPaymentDetailsDialog } from '@/components/financial/EditPaymentDetailsDialog';
import { DeleteReportDialog } from '@/components/financial/DeleteReportDialog';
import { FinancialPageHeader } from '@/components/financial/FinancialPageHeader';
import { FinancialTabs } from '@/components/financial/FinancialTabs';
import { useFinancialPage } from '@/hooks/financial/useFinancialPage';

const FinancialPage = () => {
  const {
    reportToDelete,
    setReportToDelete,
    reportToClose,
    setReportToClose,
    reportToEdit,
    setReportToEdit,
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
  } = useFinancialPage();
  
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
            openReports={openReports}
            closedReports={closedReports}
            isLoading={isLoading}
            formatCurrency={formatCurrency}
            getPaymentMethodLabel={getPaymentMethodLabel}
            onViewReport={handleViewReport}
            onCloseReport={setReportToClose}
            onDeleteReport={setReportToDelete}
            onReopenReport={handleReopenReport}
            onEditPaymentDetails={setReportToEdit}
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
          />
        </div>
      </ScrollArea>
      
      {/* Diálogo para fechar relatório com informações de pagamento */}
      {reportToClose && (
        <CloseReportDialog
          report={reportToClose}
          open={Boolean(reportToClose)}
          onOpenChange={(open) => !open && setReportToClose(null)}
          onClose={handleCloseReportWithDetails}
        />
      )}
      
      {/* Diálogo para editar detalhes de pagamento */}
      {reportToEdit && (
        <EditPaymentDetailsDialog
          report={reportToEdit}
          open={Boolean(reportToEdit)}
          onOpenChange={(open) => !open && setReportToEdit(null)}
          onSave={handleEditPaymentDetails}
        />
      )}
      
      {/* Diálogo de confirmação de exclusão */}
      <DeleteReportDialog 
        open={!!reportToDelete}
        onOpenChange={(open) => !open && setReportToDelete(null)}
        onDelete={handleDeleteReport}
      />
    </AppLayout>
  );
};

export default FinancialPage;
