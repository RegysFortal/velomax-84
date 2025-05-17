
import { Logo } from '@/components/ui/logo';
import { useFinancial } from '@/contexts/financial';
import { useFinancialPageState } from '@/hooks/financial/useFinancialPageState';
import { useFinancialOperations } from '@/hooks/financial/useFinancialOperations';
import { useFinancialReportUtils } from '@/hooks/financial/useFinancialReportUtils';
import { FinancialHeader } from '@/components/financial/FinancialHeader';
import { ReportTabs } from '@/components/financial/ReportTabs';
import { ReportDialogs } from '@/components/financial/ReportDialogs';

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
    setReportToEdit
  } = useFinancialPageState();
  
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
    handleDeleteReport
  } = useFinancialOperations();
  
  // Utilidades para relatórios financeiros
  const { 
    formatCurrency, 
    getPaymentMethodLabel, 
    handleExportPDF, 
    handleExportExcel 
  } = useFinancialReportUtils();
  
  // Filtragem dos relatórios por status
  const openReports = financialReports.filter(report => report.status === 'open');
  const closedReports = financialReports.filter(report => report.status === 'closed');
  
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
        isLoading={isLoading}
        formatCurrency={formatCurrency}
        getPaymentMethodLabel={getPaymentMethodLabel}
        onViewReport={handleViewReport}
        onCloseReport={setReportToClose}
        onDeleteReport={setReportToDelete}
        onReopenReport={handleReopenReport}
        onExportPDF={handleExportPDF}
        onExportExcel={handleExportExcel}
        onEditPaymentDetails={setReportToEdit}
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
