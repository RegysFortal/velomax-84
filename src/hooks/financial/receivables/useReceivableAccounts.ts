
import { useToast } from '@/hooks/use-toast';
import { 
  fetchReceivableAccounts, 
  checkReceivableAccountExists,
  createReceivableAccount as createAccount,
  deleteReceivableAccount as deleteAccount,
  updateReceivableAccount as updateAccount
} from './api';
import { ReceivableAccountData, ReceivableAccountUpdate } from './types';

/**
 * Hook for managing receivable accounts
 */
export function useReceivableAccounts() {
  const { toast } = useToast();

  /**
   * Fetches all receivable accounts with error handling
   */
  const fetchReceivableAccountsWithToast = async () => {
    try {
      return await fetchReceivableAccounts();
    } catch (error) {
      console.error("Error fetching receivable accounts:", error);
      toast({
        title: "Erro ao carregar contas a receber",
        description: "Não foi possível carregar as contas a receber do sistema.",
        variant: "destructive"
      });
      return [];
    }
  };

  /**
   * Creates a receivable account with toast notifications
   */
  const createReceivableAccount = async (data: ReceivableAccountData) => {
    try {
      const result = await createAccount(data);
      
      toast({
        title: "Conta a receber criada",
        description: `Uma conta a receber foi criada automaticamente para ${data.clientName}.`,
      });
      
      return result;
    } catch (error) {
      console.error("Erro ao criar conta a receber:", error);
      toast({
        title: "Erro ao criar conta a receber",
        description: "Ocorreu um erro ao criar a conta a receber.",
        variant: "destructive"
      });
    }
  };
  
  /**
   * Deletes a receivable account with toast notifications
   */
  const deleteReceivableAccount = async (reportId: string) => {
    try {
      const success = await deleteAccount(reportId);
      
      if (success) {
        toast({
          title: "Conta a receber excluída",
          description: "A conta a receber relacionada a este relatório foi excluída.",
        });
      }
      
      return success;
    } catch (error) {
      console.error("Erro ao excluir conta a receber:", error);
      return false;
    }
  };
  
  /**
   * Updates a receivable account with toast notifications
   */
  const updateReceivableAccount = async (reportId: string, data: ReceivableAccountUpdate) => {
    try {
      const success = await updateAccount(reportId, data);
      
      if (success) {
        toast({
          title: "Conta a receber atualizada",
          description: "Os detalhes de pagamento da conta a receber foram atualizados.",
        });
      }
      
      return success;
    } catch (error) {
      console.error("Erro ao atualizar conta a receber:", error);
      return false;
    }
  };

  return {
    fetchReceivableAccounts: fetchReceivableAccountsWithToast,
    checkReceivableAccountExists,
    createReceivableAccount,
    deleteReceivableAccount,
    updateReceivableAccount
  };
}
