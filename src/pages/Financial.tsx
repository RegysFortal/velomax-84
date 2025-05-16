import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
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
  
  // Filtragem dos relatórios por status
  const openReports = financialReports.filter(report => report.status === 'open');
  const closedReports = financialReports.filter(report => report.status === 'closed');
  
  const handleViewReport = (reportId: string) => {
    // Navigate to reports page with the specific report ID
    navigate(`/reports?reportId=${reportId}`);
  };
  
  const handleCloseReportWithDetails = async (reportId: string, paymentMethod: string, dueDate: string) => {
    try {
      // Primeiro atualiza os dados adicionais do relatório
      await closeReport(reportId, paymentMethod, dueDate);
      
      // Depois cria a conta a receber automaticamente
      const report = financialReports.find(r => r.id === reportId);
      const client = report ? clients.find(c => c.id === report.clientId) : null;
      
      if (report && client) {
        // Criar dados para a conta a receber
        await createReceivableAccount({
          clientId: report.clientId,
          clientName: client.name,
          description: `Relatório ${format(new Date(report.startDate), 'dd/MM/yyyy', { locale: ptBR })} a ${format(new Date(report.endDate), 'dd/MM/yyyy', { locale: ptBR })}`,
          amount: report.totalFreight,
          dueDate: dueDate,
          status: 'pending',
          categoryId: 'fretes', // Categoria de fretes
          categoryName: 'Fretes',
          reportId: report.id,
          paymentMethod: paymentMethod,
          notes: `Referente ao relatório de ${client.name} no período de ${format(new Date(report.startDate), 'dd/MM/yyyy', { locale: ptBR })} a ${format(new Date(report.endDate), 'dd/MM/yyyy', { locale: ptBR })}`,
        });
      }
    } catch (error) {
      console.error("Erro ao fechar relatório:", error);
    }
  };

  // Função para editar as informações de pagamento
  const handleEditPaymentDetails = async (reportId: string, paymentMethod: string | null, dueDate: string | null) => {
    try {
      await updatePaymentDetails(reportId, paymentMethod, dueDate);
      
      // Também atualiza a conta a receber correspondente
      if (paymentMethod !== null || dueDate !== null) {
        await updateReceivableAccount(reportId, {
          paymentMethod: paymentMethod || undefined,
          dueDate: dueDate || undefined
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar detalhes de pagamento:", error);
    }
  };

  const handleReopenReport = async (reportId: string) => {
    try {
      await reopenReport(reportId);
      
      // Exclui a conta a receber relacionada
      await deleteReceivableAccount(reportId);
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
      
      <ScrollArea className="h-[calc(100vh-148px)] w-full">
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
    </div>
  );
};

export default FinancialPage;
