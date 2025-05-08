
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ReceivableAccount } from './types';

export function useFetchReceivableAccounts() {
  const { toast } = useToast();
  
  const fetchReceivableAccounts = async (): Promise<ReceivableAccount[]> => {
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
        reportId: account.report_id,
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
  
  return { fetchReceivableAccounts };
}
