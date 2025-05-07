import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Logo } from '@/components/ui/logo';
import { useFinancial } from '@/contexts/financial';
import { useToast } from '@/hooks/use-toast';
import { FinancialReport } from '@/types';
import { CloseReportDialog } from '@/components/financial/CloseReportDialog';
import { EditPaymentDetailsDialog } from '@/components/financial/EditPaymentDetailsDialog';
import { OpenReportsTable } from '@/components/financial/OpenReportsTable';
import { ClosedReportsTable } from '@/components/financial/ClosedReportsTable';
import { useReceivableAccounts } from '@/hooks/financial/useReceivableAccounts';
import { useFinancialReportUtils } from '@/hooks/financial/useFinancialReportUtils';
import { useClients } from '@/contexts';

const FinancialPage = () => {
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
    deleteReceivableAccount 
  } = useReceivableAccounts();
  
  const { 
    formatCurrency, 
    getPaymentMethodLabel, 
    handleExportPDF, 
    handleExportExcel 
  } = useFinancialReportUtils();
  
  // Filtragem dos relatórios por status
  const openReports = financialReports.filter(report => report.status === 'open');
  const closedReports = financialReports.filter(report => report.status === 'closed');
  
  const handleViewReport = (reportId: string) => {
    // Navigate to reports page with the specific report ID
    navigate(`/reports?reportId=${reportId}`);
  };
  
  const handleCloseReportWithDetails = async (reportId: string, paymentMethod: string, dueDate: string) => {
    try {
      // O closeReport já lidará com a criação da conta a receber internamente
      await closeReport(reportId, paymentMethod, dueDate);
    } catch (error) {
      console.error("Erro ao fechar relatório:", error);
    }
  };

  // Função para editar as informações de pagamento
  const handleEditPaymentDetails = async (reportId: string, paymentMethod: string | null, dueDate: string | null) => {
    try {
      // O updatePaymentDetails já lidará com a atualização da conta a receber
      await updatePaymentDetails(reportId, paymentMethod, dueDate);
    } catch (error) {
      console.error("Erro ao atualizar detalhes de pagamento:", error);
    }
  };

  const handleReopenReport = async (reportId: string) => {
    try {
      // O reopenReport já lidará com a exclusão da conta a receber
      await reopenReport(reportId);
    } catch (error) {
      console.error("Erro ao reabrir relatório:", error);
    }
  };
  
  const handleDeleteReport = async () => {
    if (reportToDelete) {
      try {
        // Excluir a conta a receber relacionada ao relatório
        await deleteReceivableAccount(reportToDelete);
        
        // Depois exclui o relatório
        await deleteFinancialReport(reportToDelete);
        setReportToDelete(null);
      } catch (error) {
        console.error("Erro ao excluir relatório:", error);
      }
    }
  };
  
  return (
    <AppLayout>
      <ScrollArea className="h-[calc(100vh-148px)] w-full">
        <div className="flex flex-col gap-6 px-8 py-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
            <p className="text-muted-foreground">
              Gerenciamento dos relatórios financeiros de clientes.
            </p>
          </div>
          
          {/* Hidden logo for PDF generation */}
          <div className="hidden">
            <Logo className="company-logo" />
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="open">Relatórios a Fechar</TabsTrigger>
              <TabsTrigger value="closed">Relatórios Fechados</TabsTrigger>
            </TabsList>
            
            <TabsContent value="open" className="space-y-4">
              <OpenReportsTable 
                reports={openReports}
                isLoading={isLoading}
                formatCurrency={formatCurrency}
                onViewReport={handleViewReport}
                onCloseReport={setReportToClose}
                onDeleteReport={setReportToDelete}
              />
            </TabsContent>
            
            <TabsContent value="closed" className="space-y-4">
              <ClosedReportsTable 
                reports={closedReports}
                isLoading={isLoading}
                formatCurrency={formatCurrency}
                onViewReport={handleViewReport}
                onReopenReport={handleReopenReport}
                onExportPDF={handleExportPDF}
                onExportExcel={handleExportExcel}
                onDeleteReport={setReportToDelete}
                onEditPaymentDetails={setReportToEdit}
                getPaymentMethodLabel={getPaymentMethodLabel}
              />
            </TabsContent>
          </Tabs>
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
      <AlertDialog open={!!reportToDelete} onOpenChange={(open) => !open && setReportToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este relatório? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteReport}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default FinancialPage;
