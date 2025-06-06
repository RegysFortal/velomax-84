import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { PayableAccountsTable } from './components/PayableAccountsTable';
import { PayableAccountsForm } from './components/PayableAccountsForm';
import { PayableAccountsFilters } from './components/PayableAccountsFilters';
import { PayableAccountsStats } from './components/PayableAccountsStats';
import { PayableAccount } from '@/types/financial';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function PayableAccountsPage() {
  const [accounts, setAccounts] = useState<PayableAccount[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<PayableAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Fetch accounts when component mounts
  useEffect(() => {
    fetchPayableAccounts();
  }, []);
  
  const fetchPayableAccounts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('payable_accounts')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Convert database fields to our model
      const mappedAccounts = data.map((account: any): PayableAccount => ({
        id: account.id,
        supplierName: account.supplier_name,
        description: account.description,
        amount: account.amount,
        dueDate: account.due_date,
        paymentDate: account.payment_date || undefined,
        paymentMethod: account.payment_method,
        status: account.status,
        categoryId: account.category_id,
        categoryName: account.category_name,
        recurring: account.recurring,
        recurrenceFrequency: account.recurrence_frequency as any,
        installments: account.installments,
        currentInstallment: account.current_installment,
        isFixedExpense: account.is_fixed_expense,
        notes: account.notes,
        createdAt: account.created_at,
        updatedAt: account.updated_at
      }));
      
      setAccounts(mappedAccounts);
    } catch (error) {
      console.error('Error fetching payable accounts:', error);
      toast({
        title: 'Erro ao carregar contas',
        description: 'Não foi possível carregar as contas a pagar.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddAccount = async (account: Omit<PayableAccount, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = new Date().toISOString();
      
      const newAccount: PayableAccount = {
        id: uuidv4(),
        ...account,
        createdAt: now,
        updatedAt: now
      };
      
      // Prepare data for insert
      const dbAccount = {
        id: newAccount.id,
        supplier_name: newAccount.supplierName,
        description: newAccount.description,
        amount: newAccount.amount,
        due_date: newAccount.dueDate,
        payment_date: newAccount.paymentDate,
        payment_method: newAccount.paymentMethod,
        status: newAccount.status,
        category_id: newAccount.categoryId,
        category_name: newAccount.categoryName,
        recurring: newAccount.recurring,
        recurrence_frequency: newAccount.recurrenceFrequency,
        installments: newAccount.installments,
        current_installment: newAccount.currentInstallment,
        is_fixed_expense: newAccount.isFixedExpense,
        notes: newAccount.notes,
        created_at: now,
        updated_at: now
      };
      
      const { error } = await supabase
        .from('payable_accounts')
        .insert(dbAccount);
      
      if (error) throw error;
      
      setAccounts([newAccount, ...accounts]);
      setIsFormOpen(false);
      
      toast({
        title: 'Conta criada',
        description: 'Conta a pagar criada com sucesso.'
      });
    } catch (error) {
      console.error('Error adding payable account:', error);
      toast({
        title: 'Erro ao criar conta',
        description: 'Não foi possível criar a conta a pagar.',
        variant: 'destructive'
      });
    }
  };
  
  const handleUpdateAccount = async (id: string, updatedData: Partial<PayableAccount>) => {
    try {
      // Create updated account
      const updatedAccount = accounts.find(account => account.id === id);
      if (!updatedAccount) return;
      
      const newStatus = updatedData.paymentDate ? 'paid' : 
        (new Date(updatedAccount.dueDate) < new Date() ? 'overdue' : 'pending');
      
      // Prepare data for update
      const dbData: any = {
        updated_at: new Date().toISOString(),
        status: newStatus
      };
      
      if (updatedData.supplierName !== undefined) dbData.supplier_name = updatedData.supplierName;
      if (updatedData.description !== undefined) dbData.description = updatedData.description;
      if (updatedData.amount !== undefined) dbData.amount = updatedData.amount;
      if (updatedData.dueDate !== undefined) dbData.due_date = updatedData.dueDate;
      if (updatedData.paymentDate !== undefined) dbData.payment_date = updatedData.paymentDate;
      if (updatedData.paymentMethod !== undefined) dbData.payment_method = updatedData.paymentMethod;
      if (updatedData.categoryId !== undefined) dbData.category_id = updatedData.categoryId;
      if (updatedData.categoryName !== undefined) dbData.category_name = updatedData.categoryName;
      if (updatedData.recurring !== undefined) dbData.recurring = updatedData.recurring;
      if (updatedData.recurrenceFrequency !== undefined) dbData.recurrence_frequency = updatedData.recurrenceFrequency;
      if (updatedData.installments !== undefined) dbData.installments = updatedData.installments;
      if (updatedData.currentInstallment !== undefined) dbData.current_installment = updatedData.currentInstallment;
      if (updatedData.isFixedExpense !== undefined) dbData.is_fixed_expense = updatedData.isFixedExpense;
      if (updatedData.notes !== undefined) dbData.notes = updatedData.notes;
      
      const { error } = await supabase
        .from('payable_accounts')
        .update(dbData)
        .eq('id', id);
      
      if (error) throw error;
      
      // Update state
      setAccounts(accounts.map(account => {
        if (account.id === id) {
          return { 
            ...account, 
            ...updatedData, 
            updatedAt: new Date().toISOString(),
            status: newStatus as any
          };
        }
        return account;
      }));
      
      setEditingAccount(null);
      setIsFormOpen(false);
      
      toast({
        title: 'Conta atualizada',
        description: 'Conta a pagar atualizada com sucesso.'
      });
    } catch (error) {
      console.error('Error updating payable account:', error);
      toast({
        title: 'Erro ao atualizar conta',
        description: 'Não foi possível atualizar a conta a pagar.',
        variant: 'destructive'
      });
    }
  };
  
  const handleDeleteAccount = async (id: string) => {
    try {
      const { error } = await supabase
        .from('payable_accounts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setAccounts(accounts.filter(account => account.id !== id));
      
      toast({
        title: 'Conta excluída',
        description: 'Conta a pagar excluída com sucesso.'
      });
    } catch (error) {
      console.error('Error deleting payable account:', error);
      toast({
        title: 'Erro ao excluir conta',
        description: 'Não foi possível excluir a conta a pagar.',
        variant: 'destructive'
      });
    }
  };
  
  const handleEdit = (account: PayableAccount) => {
    setEditingAccount(account);
    setIsFormOpen(true);
  };
  
  const handleMarkAsPaid = async (id: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('payable_accounts')
        .update({
          payment_date: today,
          status: 'paid',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      setAccounts(accounts.map(account => {
        if (account.id === id) {
          return {
            ...account,
            paymentDate: today,
            status: 'paid' as const,
            updatedAt: new Date().toISOString()
          };
        }
        return account;
      }));
      
      toast({
        title: 'Pagamento registrado',
        description: 'Conta marcada como paga com sucesso.'
      });
    } catch (error) {
      console.error('Error marking account as paid:', error);
      toast({
        title: 'Erro ao registrar pagamento',
        description: 'Não foi possível marcar a conta como paga.',
        variant: 'destructive'
      });
    }
  };
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contas a Pagar</h1>
          <p className="text-muted-foreground">
            Gerencie todas as suas contas a pagar em um só lugar.
          </p>
        </div>
        <Button onClick={() => { setIsFormOpen(true); setEditingAccount(null); }}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Conta
        </Button>
      </div>

      {/* Summary cards */}
      <PayableAccountsStats accounts={accounts} />
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="overdue">Atrasadas</TabsTrigger>
          <TabsTrigger value="paid">Pagas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="space-y-4">
            <PayableAccountsFilters />
            <PayableAccountsTable 
              accounts={accounts} 
              onEdit={handleEdit} 
              onDelete={handleDeleteAccount}
              onMarkAsPaid={handleMarkAsPaid}
              isLoading={isLoading}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="pending">
          <div className="space-y-4">
            <PayableAccountsFilters />
            <PayableAccountsTable 
              accounts={accounts.filter(account => account.status === 'pending')} 
              onEdit={handleEdit} 
              onDelete={handleDeleteAccount}
              onMarkAsPaid={handleMarkAsPaid}
              isLoading={isLoading}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="overdue">
          <div className="space-y-4">
            <PayableAccountsFilters />
            <PayableAccountsTable 
              accounts={accounts.filter(account => account.status === 'overdue')} 
              onEdit={handleEdit} 
              onDelete={handleDeleteAccount}
              onMarkAsPaid={handleMarkAsPaid}
              isLoading={isLoading}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="paid">
          <div className="space-y-4">
            <PayableAccountsFilters />
            <PayableAccountsTable 
              accounts={accounts.filter(account => account.status === 'paid')} 
              onEdit={handleEdit} 
              onDelete={handleDeleteAccount}
              onMarkAsPaid={handleMarkAsPaid}
              isLoading={isLoading}
            />
          </div>
        </TabsContent>
      </Tabs>
      
      {isFormOpen && (
        <PayableAccountsForm 
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={editingAccount ? 
            (data) => handleUpdateAccount(editingAccount.id, data) : 
            handleAddAccount
          }
          account={editingAccount}
        />
      )}
    </div>
  );
}
