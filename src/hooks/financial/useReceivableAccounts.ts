
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

  const createReceivableAccount = async (data: ReceivableAccountData) => {
    try {
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
      const { data: existingAccount } = await supabase
        .from('receivable_accounts')
        .select('*')
        .eq('report_id', data.reportId)
        .maybeSingle();
      
      if (existingAccount) {
        console.log("Account already exists for this report, updating instead of creating");
        const { data: updatedData, error } = await supabase
          .from('receivable_accounts')
          .update(newAccountData)
          .eq('report_id', data.reportId)
          .select();
        
        if (error) throw error;
        
        toast({
          title: "Conta a receber atualizada",
          description: `A conta a receber para ${data.clientName} foi atualizada.`,
        });
        
        return updatedData;
      }
      
      // Insert new account if none exists
      const { data: insertedData, error } = await supabase
        .from('receivable_accounts')
        .insert(newAccountData)
        .select();
      
      if (error) {
        throw error;
      }
      
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
      const { error } = await supabase
        .from('receivable_accounts')
        .delete()
        .eq('report_id', reportId);
      
      if (error) {
        console.error("Erro ao excluir conta a receber:", error);
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
      const updateData: any = {};
      if (data.paymentMethod !== undefined) updateData.payment_method = data.paymentMethod;
      if (data.dueDate !== undefined) updateData.due_date = data.dueDate;
      
      const { error } = await supabase
        .from('receivable_accounts')
        .update(updateData)
        .eq('report_id', reportId);
      
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
    createReceivableAccount,
    deleteReceivableAccount,
    updateReceivableAccount
  };
}
