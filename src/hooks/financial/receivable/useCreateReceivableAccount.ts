
import { supabase } from '@/integrations/supabase/client';
import { ReceivableAccountData } from './types';
import { useToast } from '@/hooks/use-toast';

export function useCreateReceivableAccount() {
  const { toast } = useToast();
  
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
        .select('id')
        .eq('report_id', data.reportId)
        .maybeSingle();
      
      if (queryError) {
        console.error("Erro ao verificar conta existente:", queryError);
        throw queryError;
      }
      
      let result;
      
      if (existingAccount) {
        console.log("Conta já existe para este relatório, atualizando:", existingAccount);
        const { data: updatedData, error } = await supabase
          .from('receivable_accounts')
          .update({
            ...newAccountData,
            updated_at: now
          })
          .eq('id', existingAccount.id)
          .select();
        
        if (error) {
          console.error("Erro ao atualizar conta existente:", error);
          toast({
            title: "Erro ao atualizar conta",
            description: "Não foi possível atualizar a conta a receber.",
            variant: "destructive"
          });
          throw error;
        }
        
        console.log("Conta atualizada com sucesso:", updatedData);
        result = updatedData;
      } else {
        // Insert new account if none exists
        const { data: insertedData, error: insertError } = await supabase
          .from('receivable_accounts')
          .insert(newAccountData)
          .select();
        
        if (insertError) {
          console.error("Erro ao inserir nova conta:", insertError);
          toast({
            title: "Erro ao criar conta",
            description: "Não foi possível criar a conta a receber.",
            variant: "destructive"
          });
          throw insertError;
        }
        
        console.log("Nova conta a receber criada:", insertedData);
        result = insertedData;
      }
      
      return result;
    } catch (error) {
      console.error("Erro ao criar conta a receber:", error);
      throw error;
    }
  };
  
  return { createReceivableAccount };
}
