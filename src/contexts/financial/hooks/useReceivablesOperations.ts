
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useClients } from '@/contexts';
import { useToast } from '@/hooks/use-toast';
import { useReceivableAccounts } from '@/hooks/financial/useReceivableAccounts';
import { FinancialReport } from '@/types';

/**
 * Hook for handling receivables operations
 */
export function useReceivablesOperations() {
  const { toast } = useToast();
  const { clients } = useClients();
  const { 
    createReceivableAccount, 
    checkReceivableAccountExists 
  } = useReceivableAccounts();

  const createReceivableForReport = async (report: FinancialReport) => {
    try {
      // Check if the report already has an associated receivable account
      const exists = await checkReceivableAccountExists(report.id);
      
      if (exists) {
        throw new Error('REPORT_ALREADY_IN_RECEIVABLES');
      }
      
      // If not, create a new receivable account
      const client = clients.find(c => c.id === report.clientId);
      
      if (!client) {
        throw new Error('CLIENT_NOT_FOUND');
      }
      
      // Create receivable account
      await createReceivableAccount({
        clientId: report.clientId,
        clientName: client.name,
        description: `Relatório ${format(new Date(report.startDate), 'dd/MM/yyyy', { locale: ptBR })} a ${format(new Date(report.endDate), 'dd/MM/yyyy', { locale: ptBR })}`,
        amount: report.totalFreight,
        dueDate: report.dueDate || format(new Date(), 'yyyy-MM-dd'),
        status: 'pending',
        categoryId: 'fretes',
        categoryName: 'Fretes',
        reportId: report.id,
        paymentMethod: report.paymentMethod || 'boleto',
        notes: `Referente ao relatório de ${client.name} no período de ${format(new Date(report.startDate), 'dd/MM/yyyy', { locale: ptBR })} a ${format(new Date(report.endDate), 'dd/MM/yyyy', { locale: ptBR })}`,
      });
      
      toast({
        title: "Sucesso",
        description: "Relatório enviado para contas a receber com sucesso.",
      });
      
      return true;
    } catch (error: any) {
      console.error("Erro ao enviar relatório para contas a receber:", error);
      throw error;
    }
  };

  // Return a Promise that can be caught
  const handleSendToReceivables = async (report: FinancialReport): Promise<boolean> => {
    try {
      await createReceivableForReport(report);
      return true;
    } catch (error: any) {
      throw error;
    }
  };

  return {
    handleSendToReceivables,
    createReceivableForReport
  };
}
