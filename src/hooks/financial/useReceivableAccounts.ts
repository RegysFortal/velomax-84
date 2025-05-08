
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReceivableAccountData {
  clientId: string;
  clientName: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'received' | 'overdue' | 'partially_received';
  categoryId: string;
  categoryName: string;
  reportId: string;
  paymentMethod: string;
  notes?: string;
}

export function useReceivableAccounts() {
  const { toast } = useToast();

  const fetchReceivableAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('receivable_accounts')
        .select('*')
        .order('due_date', { ascending: true });
      
      if (error) throw error;
      
      // Transform database fields to match our interface
      return data.map((account: any) => ({
        id: account.id,
        clientId: account.client_id,
        clientName: account.client_name,
        description: account.description,
        amount: Number(account.amount),
        dueDate: account.due_date,
        receivedDate: account.received_date,
        receivedAmount: account.received_amount ? Number(account.received_amount) : undefined,
        remainingAmount: account.remaining_amount ? Number(account.remaining_amount) : undefined,
        status: account.status,
        categoryId: account.category_id,
        categoryName: account.category_name,
        notes: account.notes,
        paymentMethod: account.payment_method,
        createdAt: account.created_at,
        updatedAt: account.updated_at
      }));
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

  const createReceivableAccount = async (data: ReceivableAccountData) => {
    try {
      console.log("Criando/atualizando conta a receber:", data);
      
      const now = new Date().toISOString();
      const newAccountData = {
        client_id: data.clientId,
        client_name: data.clientName,
        description: data.description,
        amount: data.amount,
        due_date: data.dueDate,
        status: data.status,
        category_id: data.categoryId,
        category_name: data.categoryName,
        report_id: data.reportId,
        payment_method: data.paymentMethod,
        notes: data.notes,
        created_at: now,
        updated_at: now
      };
      
      // Check if an account for this report already exists
      const { data: existingAccount, error: queryError } = await supabase
        .from('receivable_accounts')
        .select('*')
        .eq('report_id', data.reportId)
        .maybeSingle();
      
      if (queryError) {
        console.error("Error checking for existing account:", queryError);
        throw queryError;
      }
      
      if (existingAccount) {
        console.log("Account already exists for this report, updating instead of creating:", existingAccount);
        const { data: updatedData, error } = await supabase
          .from('receivable_accounts')
          .update(newAccountData)
          .eq('id', existingAccount.id)  // Use the account ID, not report_id
          .select();
        
        if (error) throw error;
        
        toast({
          title: "Conta a receber atualizada",
          description: `A conta a receber para ${data.clientName} foi atualizada.`,
        });
        
        return updatedData;
      }
      
      // Insert new account if none exists
      const { data: insertedData, error: insertError } = await supabase
        .from('receivable_accounts')
        .insert(newAccountData)
        .select();
      
      if (insertError) {
        console.error("Error inserting new account:", insertError);
        throw insertError;
      }
      
      console.log("Nova conta a receber criada:", insertedData);
      
      toast({
        title: "Conta a receber criada",
        description: `Uma conta a receber foi criada automaticamente para ${data.clientName}.`,
      });
      
      return insertedData;
    } catch (error) {
      console.error("Erro ao criar conta a receber:", error);
      toast({
        title: "Erro ao criar conta a receber",
        description: "Ocorreu um erro ao criar a conta a receber.",
        variant: "destructive"
      });
    }
  };
  
  const deleteReceivableAccount = async (reportId: string) => {
    try {
      console.log("Tentando excluir conta a receber para o relatório:", reportId);
      
      // First, find the account with this report_id
      const { data: accountToDelete, error: findError } = await supabase
        .from('receivable_accounts')
        .select('id')
        .eq('report_id', reportId)
        .maybeSingle();
      
      if (findError) {
        console.error("Erro ao buscar conta a receber para exclusão:", findError);
        return false;
      }
      
      if (!accountToDelete) {
        console.log("Nenhuma conta a receber encontrada para este relatório");
        return true;
      }
      
      console.log("Conta encontrada para exclusão:", accountToDelete);
      
      // Now delete the account using its ID
      const { error: deleteError } = await supabase
        .from('receivable_accounts')
        .delete()
        .eq('id', accountToDelete.id);
      
      if (deleteError) {
        console.error("Erro ao excluir conta a receber:", deleteError);
        return false;
      }
      
      toast({
        title: "Conta a receber excluída",
        description: "A conta a receber relacionada a este relatório foi excluída.",
      });
      
      return true;
    } catch (error) {
      console.error("Erro ao excluir conta a receber:", error);
      return false;
    }
  };
  
  const updateReceivableAccount = async (reportId: string, data: {
    paymentMethod?: string;
    dueDate?: string;
  }) => {
    try {
      console.log("Tentando atualizar conta a receber para o relatório:", reportId, data);
      
      // First, find the account with this report_id
      const { data: accountToUpdate, error: findError } = await supabase
        .from('receivable_accounts')
        .select('id')
        .eq('report_id', reportId)
        .maybeSingle();
      
      if (findError) {
        console.error("Erro ao buscar conta a receber para atualização:", findError);
        return false;
      }
      
      if (!accountToUpdate) {
        console.log("Nenhuma conta a receber encontrada para este relatório");
        return false;
      }
      
      const updateData: any = {};
      if (data.paymentMethod !== undefined) updateData.payment_method = data.paymentMethod;
      if (data.dueDate !== undefined) updateData.due_date = data.dueDate;
      
      console.log("Atualizando conta com ID:", accountToUpdate.id, "dados:", updateData);
      
      const { error } = await supabase
        .from('receivable_accounts')
        .update(updateData)
        .eq('id', accountToUpdate.id);
      
      if (error) {
        console.error("Erro ao atualizar conta a receber:", error);
        return false;
      }
      
      toast({
        title: "Conta a receber atualizada",
        description: "Os detalhes de pagamento da conta a receber foram atualizados.",
      });
      
      return true;
    } catch (error) {
      console.error("Erro ao atualizar conta a receber:", error);
      return false;
    }
  };

  return {
    fetchReceivableAccounts,
    createReceivableAccount,
    deleteReceivableAccount,
    updateReceivableAccount
  };
}
