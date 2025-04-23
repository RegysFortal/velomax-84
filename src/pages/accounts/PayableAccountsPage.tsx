
import { useState } from 'react';
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

// Import mock data
import { mockPayableAccounts } from './data/mockFinancialData';

export default function PayableAccountsPage() {
  const [accounts, setAccounts] = useState<PayableAccount[]>(mockPayableAccounts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<PayableAccount | null>(null);
  
  const handleAddAccount = (account: Omit<PayableAccount, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    
    const newAccount: PayableAccount = {
      id: uuidv4(),
      ...account,
      createdAt: now,
      updatedAt: now
    };
    
    setAccounts([newAccount, ...accounts]);
    setIsFormOpen(false);
  };
  
  const handleUpdateAccount = (id: string, updatedData: Partial<PayableAccount>) => {
    setAccounts(accounts.map(account => {
      if (account.id === id) {
        return { 
          ...account, 
          ...updatedData, 
          updatedAt: new Date().toISOString(),
          // Status logic - if payment date is set, mark as paid
          status: updatedData.paymentDate ? 'paid' : 
                 (new Date(account.dueDate) < new Date() ? 'overdue' : 'pending')
        };
      }
      return account;
    }));
    
    setEditingAccount(null);
    setIsFormOpen(false);
  };
  
  const handleDeleteAccount = (id: string) => {
    setAccounts(accounts.filter(account => account.id !== id));
  };
  
  const handleEdit = (account: PayableAccount) => {
    setEditingAccount(account);
    setIsFormOpen(true);
  };
  
  const handleMarkAsPaid = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    
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
  };
  
  return (
    <AppLayout>
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
    </AppLayout>
  );
}
