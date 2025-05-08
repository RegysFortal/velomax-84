
import { FinancialReport } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useReceivableAccounts, ReceivableAccountData } from '@/hooks/financial/useReceivableAccounts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const useReportClose = (
  financialReports: FinancialReport[],
  clients: any[],
  updateFinancialReport: (id: string, report: Partial<FinancialReport>) => Promise<void>
) => {
  const { toast } = useToast();
  const { createReceivableAccount } = useReceivableAccounts();

  const closeReport = async (id: string, paymentMethod?: string, dueDate?: string) => {
    try {
      console.log(`Fechando relatório com ID: ${id}, método: ${paymentMethod}, vencimento: ${dueDate}`);
      const reportToClose = financialReports.find(report => report.id === id);
      
      if (!reportToClose) {
        console.error(`Relatório com ID ${id} não encontrado.`);
        toast({
          title: "Erro ao fechar relatório",
          description: "Relatório não encontrado.",
          variant: "destructive"
        });
        return;
      }
      
      // Atualiza o status do relatório para fechado
      const updateData: Partial<FinancialReport> = {
        status: 'closed',
        paymentMethod,
        dueDate
      };
      
      await updateFinancialReport(id, updateData);
      
      // Criar conta a receber automaticamente para o relatório fechado
      const client = clients.find(c => c.id === reportToClose.clientId);
      
      if (client && paymentMethod && dueDate) {
        // Preparar dados para criar a conta a receber
        const accountData: ReceivableAccountData = {
          clientId: reportToClose.clientId,
          clientName: client.name,
          description: `Relatório ${format(new Date(reportToClose.startDate), 'dd/MM/yyyy', { locale: ptBR })} a ${format(new Date(reportToClose.endDate), 'dd/MM/yyyy', { locale: ptBR })}`,
          amount: reportToClose.totalFreight,
          dueDate: dueDate,
          status: "pending", // Explicitly defining status as a literal type
          categoryId: 'fretes', // Categoria padrão para fretes
          categoryName: 'Fretes',
          reportId: reportToClose.id,
          paymentMethod: paymentMethod,
          notes: `Referente ao relatório de ${client.name} no período de ${format(new Date(reportToClose.startDate), 'dd/MM/yyyy', { locale: ptBR })} a ${format(new Date(reportToClose.endDate), 'dd/MM/yyyy', { locale: ptBR })}`
        };
        
        try {
          // Tenta criar a conta a receber
          const result = await createReceivableAccount(accountData);
          
          console.log("Conta a receber criada/atualizada:", result);
          
          toast({
            title: "Conta a receber criada",
            description: `Uma conta a receber foi criada automaticamente para ${client.name}.`,
          });
        } catch (error) {
          console.error("Erro ao criar conta a receber:", error);
          toast({
            title: "Erro ao criar conta a receber",
            description: "Não foi possível criar a conta a receber para este relatório.",
            variant: "destructive"
          });
        }
      } else {
        console.error("Dados insuficientes para criar conta a receber:", { client, paymentMethod, dueDate });
        if (!client) {
          toast({
            title: "Erro ao criar conta a receber",
            description: "Cliente não encontrado.",
            variant: "destructive"
          });
        } else if (!paymentMethod || !dueDate) {
          toast({
            title: "Erro ao criar conta a receber",
            description: "Método de pagamento ou data de vencimento não informados.",
            variant: "destructive"
          });
        }
      }
      
      toast({
        title: "Relatório fechado",
        description: `O relatório financeiro foi fechado com sucesso.`,
      });
    } catch (error) {
      console.error("Erro ao fechar relatório:", error);
      toast({
        title: "Erro ao fechar relatório",
        description: "Ocorreu um erro ao fechar o relatório.",
        variant: "destructive"
      });
    }
  };

  return { closeReport };
};
