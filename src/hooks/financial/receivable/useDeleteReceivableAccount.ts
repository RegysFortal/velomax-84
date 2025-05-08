
import { supabase } from '@/integrations/supabase/client';

export function useDeleteReceivableAccount() {
  const deleteReceivableAccount = async (reportId: string): Promise<boolean> => {
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
      
      console.log("Conta a receber excluída com sucesso");
      return true;
    } catch (error) {
      console.error("Erro ao excluir conta a receber:", error);
      return false;
    }
  };
  
  return { deleteReceivableAccount };
}
