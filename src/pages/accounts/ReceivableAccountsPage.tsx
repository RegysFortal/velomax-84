import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { ReceivableAccountsTable } from './components/ReceivableAccountsTable';
import { ReceivableAccountsForm } from './components/ReceivableAccountsForm';
import { ReceivableAccountsFilters } from './components/ReceivableAccountsFilters';
import { ReceivableAccountsStats } from './components/ReceivableAccountsStats';
import { ReceivableAccount } from '@/types/financial';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function ReceivableAccountsPage() {
  const [accounts, setAccounts] = useState<ReceivableAccount[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<ReceivableAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Fetch accounts when component mounts
  useEffect(() => {
    fetchReceivableAccounts();
  }, []);
  
  const fetchReceivableAccounts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('receivable_accounts')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Convert database fields to our model
      const mappedAccounts = data.map((account: any): ReceivableAccount => ({
        id: account.id,
        clientId: account.client_id,
        clientName: account.client_name,
        description: account.description,
        amount: account.amount,
        dueDate: account.due_date,
        receivedDate: account.received_date || undefined,
        receivedAmount: account.received_amount,
        remainingAmount: account.remaining_amount,
        receivedMethod: account.payment_method,
        status: account.status,
        categoryId: account.category_id,
        categoryName: account.category_name,
        notes: account.notes,
        createdAt: account.created_at,
        updatedAt: account.updated_at
      }));
      
      setAccounts(mappedAccounts);
    } catch (error) {
      console.error('Error fetching receivable accounts:', error);
      toast({
        title: 'Erro ao carregar contas',
        description: 'Não foi possível carregar as contas a receber.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddAccount = async (account: Omit<ReceivableAccount, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = new Date().toISOString();
      
      const newAccount: ReceivableAccount = {
        id: uuidv4(),
        ...account,
        createdAt: now,
        updatedAt: now
      };
      
      // Prepare data for insert
      const dbAccount = {
        id: newAccount.id,
        client_id: newAccount.clientId,
        client_name: newAccount.clientName,
        description: newAccount.description,
        amount: newAccount.amount,
        due_date: newAccount.dueDate,
        received_date: newAccount.receivedDate,
        received_amount: newAccount.receivedAmount,
        remaining_amount: newAccount.remainingAmount,
        payment_method: newAccount.receivedMethod,
        status: newAccount.status,
        category_id: newAccount.categoryId,
        category_name: newAccount.categoryName,
        notes: newAccount.notes,
        created_at: now,
        updated_at: now
      };
      
      const { error } = await supabase
        .from('receivable_accounts')
        .insert(dbAccount);
      
      if (error) throw error;
      
      setAccounts([newAccount, ...accounts]);
      setIsFormOpen(false);
      
      toast({
        title: 'Conta criada',
        description: 'Conta a receber criada com sucesso.'
      });
    } catch (error) {
      console.error('Error adding receivable account:', error);
      toast({
        title: 'Erro ao criar conta',
        description: 'Não foi possível criar a conta a receber.',
        variant: 'destructive'
      });
    }
  };
  
  const handleUpdateAccount = async (id: string, updatedData: Partial<ReceivableAccount>) => {
    try {
      // Find account to update
      const accountToUpdate = accounts.find(account => account.id === id);
      if (!accountToUpdate) return;
      
      // Determine the status based on updated data
      let newStatus = accountToUpdate.status;
      
      if (updatedData.receivedDate) {
        // If there's a partial payment
        if (updatedData.remainingAmount && updatedData.remainingAmount > 0) {
          newStatus = 'partially_received' as const;
        } else {
          newStatus = 'received' as const;
        }
      } else if (new Date(accountToUpdate.dueDate) < new Date()) {
        newStatus = 'overdue' as const;
      } else {
        newStatus = 'pending' as const;
      }
      
      // Prepare data for update
      const dbData: any = {
        updated_at: new Date().toISOString(),
        status: newStatus
      };
      
      if (updatedData.clientId !== undefined) dbData.client_id = updatedData.clientId;
      if (updatedData.clientName !== undefined) dbData.client_name = updatedData.clientName;
      if (updatedData.description !== undefined) dbData.description = updatedData.description;
      if (updatedData.amount !== undefined) dbData.amount = updatedData.amount;
      if (updatedData.dueDate !== undefined) dbData.due_date = updatedData.dueDate;
      if (updatedData.receivedDate !== undefined) dbData.received_date = updatedData.receivedDate;
      if (updatedData.receivedAmount !== undefined) dbData.received_amount = updatedData.receivedAmount;
      if (updatedData.remainingAmount !== undefined) dbData.remaining_amount = updatedData.remainingAmount;
      if (updatedData.receivedMethod !== undefined) dbData.payment_method = updatedData.receivedMethod;
      if (updatedData.categoryId !== undefined) dbData.category_id = updatedData.categoryId;
      if (updatedData.categoryName !== undefined) dbData.category_name = updatedData.categoryName;
      if (updatedData.notes !== undefined) dbData.notes = updatedData.notes;
      
      const { error } = await supabase
        .from('receivable_accounts')
        .update(dbData)
        .eq('id', id);
      
      if (error) throw error;
      
      // Update state
      setAccounts(accounts.map(account => {
        if (account.id === id) {
          return { 
            ...account, 
            ...updatedData,
            status: newStatus, 
            updatedAt: new Date().toISOString() 
          };
        }
        return account;
      }));
      
      setEditingAccount(null);
      setIsFormOpen(false);
      
      toast({
        title: 'Conta atualizada',
        description: 'Conta a receber atualizada com sucesso.'
      });
    } catch (error) {
      console.error('Error updating receivable account:', error);
      toast({
        title: 'Erro ao atualizar conta',
        description: 'Não foi possível atualizar a conta a receber.',
        variant: 'destructive'
      });
    }
  };
  
  const handleDeleteAccount = async (id: string) => {
    try {
      const { error } = await supabase
        .from('receivable_accounts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setAccounts(accounts.filter(account => account.id !== id));
      
      toast({
        title: 'Conta excluída',
        description: 'Conta a receber excluída com sucesso.'
      });
    } catch (error) {
      console.error('Error deleting receivable account:', error);
      toast({
        title: 'Erro ao excluir conta',
        description: 'Não foi possível excluir a conta a receber.',
        variant: 'destructive'
      });
    }
  };
  
  const handleEdit = (account: ReceivableAccount) => {
    setEditingAccount(account);
    setIsFormOpen(true);
  };
  
  const handleMarkAsReceived = async (id: string, fullAmount: boolean = true, partialAmount?: number) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const account = accounts.find(a => a.id === id);
      if (!account) return;
      
      let updateData;
      
      if (fullAmount) {
        updateData = {
          received_date: today,
          received_amount: account.amount,
          remaining_amount: 0,
          status: 'received',
          updated_at: new Date().toISOString()
        };
      } else if (partialAmount) {
        const remaining = account.amount - partialAmount;
        updateData = {
          received_date: today,
          received_amount: partialAmount,
          remaining_amount: remaining,
          status: 'partially_received',
          updated_at: new Date().toISOString()
        };
      } else {
        return;
      }
      
      const { error } = await supabase
        .from('receivable_accounts')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
      
      setAccounts(accounts.map(account => {
        if (account.id === id) {
          if (fullAmount) {
            return {
              ...account,
              receivedDate: today,
              receivedAmount: account.amount,
              remainingAmount: 0,
              status: 'received' as const,
              updatedAt: new Date().toISOString()
            };
          } else if (partialAmount) {
            const remaining = account.amount - partialAmount;
            return {
              ...account,
              receivedDate: today,
              receivedAmount: partialAmount,
              remainingAmount: remaining,
              status: 'partially_received' as const,
              updatedAt: new Date().toISOString()
            };
          }
        }
        return account;
      }));
      
      toast({
        title: 'Recebimento registrado',
        description: fullAmount 
          ? 'Conta marcada como recebida por completo.' 
          : 'Recebimento parcial registrado com sucesso.'
      });
    } catch (error) {
      console.error('Error marking account as received:', error);
      toast({
        title: 'Erro ao registrar recebimento',
        description: 'Não foi possível registrar o recebimento.',
        variant: 'destructive'
      });
    }
  };
  
  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Contas a Receber</h1>
            <p className="text-muted-foreground">
              Gerencie todas as suas contas a receber em um só lugar.
            </p>
          </div>
          <Button onClick={() => { setIsFormOpen(true); setEditingAccount(null); }}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Conta
          </Button>
        </div>

        {/* Summary cards */}
        <ReceivableAccountsStats accounts={accounts} />
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="pending">Pendentes</TabsTrigger>
            <TabsTrigger value="overdue">Atrasadas</TabsTrigger>
            <TabsTrigger value="received">Recebidas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="space-y-4">
              <ReceivableAccountsFilters />
              <ReceivableAccountsTable 
                accounts={accounts} 
                onEdit={handleEdit} 
                onDelete={handleDeleteAccount}
                onMarkAsReceived={handleMarkAsReceived}
                isLoading={isLoading}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="pending">
            <div className="space-y-4">
              <ReceivableAccountsFilters />
              <ReceivableAccountsTable 
                accounts={accounts.filter(account => account.status === 'pending')} 
                onEdit={handleEdit} 
                onDelete={handleDeleteAccount}
                onMarkAsReceived={handleMarkAsReceived}
                isLoading={isLoading}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="overdue">
            <div className="space-y-4">
              <ReceivableAccountsFilters />
              <ReceivableAccountsTable 
                accounts={accounts.filter(account => account.status === 'overdue')} 
                onEdit={handleEdit} 
                onDelete={handleDeleteAccount}
                onMarkAsReceived={handleMarkAsReceived}
                isLoading={isLoading}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="received">
            <div className="space-y-4">
              <ReceivableAccountsFilters />
              <ReceivableAccountsTable 
                accounts={accounts.filter(account => 
                  account.status === 'received' || account.status === 'partially_received'
                )} 
                onEdit={handleEdit} 
                onDelete={handleDeleteAccount}
                onMarkAsReceived={handleMarkAsReceived}
                isLoading={isLoading}
              />
            </div>
          </TabsContent>
        </Tabs>
        
        {isFormOpen && (
          <ReceivableAccountsForm 
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
    </AppLayout>
  );
}
