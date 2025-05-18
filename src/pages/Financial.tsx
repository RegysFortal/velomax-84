
import { Logo } from '@/components/ui/logo';
import { useFinancial } from '@/contexts/financial';
import { useFinancialPageState } from '@/hooks/financial/useFinancialPageState';
import { useFinancialOperations } from '@/hooks/financial/useFinancialOperations';
import { useFinancialReportUtils } from '@/hooks/financial/useFinancialReportUtils';
import { FinancialHeader } from '@/components/financial/FinancialHeader';
import { ReportTabs } from '@/components/financial/ReportTabs';
import { ReportDialogs } from '@/components/financial/ReportDialogs';
import { useToast } from '@/hooks/use-toast';
import { FinancialReport } from '@/types';

const FinancialPage = () => {
  // Estado da página
  const {
    activeTab,
    setActiveTab,
    reportToDelete,
    setReportToDelete,
    reportToClose,
    setReportToClose,
    reportToEdit,
    setReportToEdit,
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange
  } = useFinancialPageState();
  
  const { toast } = useToast();
  
  // Get financial data safely with fallbacks
  const { 
    financialReports = [], 
    loading: isLoading = false,
  } = useFinancial();
  
  // Operações financeiras
  const {
    handleViewReport,
    handleCloseReportWithDetails,
    handleEditPaymentDetails,
    handleReopenReport,
    handleDeleteReport,
    handleSendToReceivables,
    handleArchiveReport,
    handleReturnToClosedReport
  } = useFinancialOperations();
  
  // Utilidades para relatórios financeiros
  const { 
    formatCurrency, 
    getPaymentMethodLabel, 
    handleExportPDF, 
    handleExportExcel 
  } = useFinancialReportUtils();
  
  // Verificar se um relatório já tem conta a receber associada
  const handleSendToReceivablesWithCheck = (report: FinancialReport) => {
    // Verifica se já existe conta a receber para este relatório
    handleSendToReceivables(report)
      .then(() => {
        // Success is already handled inside the hook with toast
      })
      .catch(error => {
        if (error?.message === 'REPORT_ALREADY_IN_RECEIVABLES') {
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
  
  // Custom handler for archiving that also changes the active tab
  const handleArchiveReportAndSwitchTab = async (reportId: string) => {
    await handleArchiveReport(reportId);
    // Change to the archived tab after archiving
    setActiveTab("archived");
  };
  
  // Filtragem dos relatórios por status
  const openReports = financialReports.filter(report => report.status === 'open');
  const closedReports = financialReports.filter(report => report.status === 'closed');
  const archivedReports = financialReports.filter(report => report.status === 'archived');
  
  return (
    <div className="flex flex-col gap-6 px-8 py-6">
      <FinancialHeader 
        title="Financeiro"
        description="Gerenciamento dos relatórios financeiros de clientes."
      />
      
      {/* Hidden logo for PDF generation */}
      <div className="hidden">
        <Logo className="company-logo" />
      </div>
      
      <ReportTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openReports={openReports}
        closedReports={closedReports}
        archivedReports={archivedReports}
        isLoading={isLoading}
        formatCurrency={formatCurrency}
        getPaymentMethodLabel={getPaymentMethodLabel}
        onViewReport={handleViewReport}
        onCloseReport={setReportToClose}
        onDeleteReport={setReportToDelete}
        onReopenReport={handleReopenReport}
        onArchiveReport={handleArchiveReportAndSwitchTab}
        onReturnToClosed={handleReturnToClosedReport}
        onExportPDF={handleExportPDF}
        onExportExcel={handleExportExcel}
        onEditPaymentDetails={setReportToEdit}
        onSendToReceivables={handleSendToReceivablesWithCheck}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={onStartDateChange}
        onEndDateChange={onEndDateChange}
      />
      
      <ReportDialogs
        reportToClose={reportToClose}
        setReportToClose={setReportToClose}
        reportToEdit={reportToEdit}
        setReportToEdit={setReportToEdit}
        reportToDelete={reportToDelete}
        setReportToDelete={setReportToDelete}
        onCloseReport={handleCloseReportWithDetails}
        onEditPaymentDetails={handleEditPaymentDetails}
        onDeleteReport={handleDeleteReport}
      />
    </div>
  );
};

export default FinancialPage;
