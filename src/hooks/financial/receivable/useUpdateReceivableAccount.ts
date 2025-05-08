
import { supabase } from '@/integrations/supabase/client';

export function useUpdateReceivableAccount() {
  const updateReceivableAccount = async (reportId: string, data: {
    paymentMethod?: string;
    dueDate?: string;
  }): Promise<boolean> => {
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
      
      const updateData: any = {
        updated_at: new Date().toISOString()
      };
      
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
      
      console.log("Conta a receber atualizada com sucesso");
      return true;
    } catch (error) {
      console.error("Erro ao atualizar conta a receber:", error);
      return false;
    }
  };
  
  return { updateReceivableAccount };
}
