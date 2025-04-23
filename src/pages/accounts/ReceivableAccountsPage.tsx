
import { useState } from 'react';
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

// Import mock data
import { mockReceivableAccounts } from './data/mockFinancialData';

export default function ReceivableAccountsPage() {
  const [accounts, setAccounts] = useState<ReceivableAccount[]>(mockReceivableAccounts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<ReceivableAccount | null>(null);
  
  const handleAddAccount = (account: Omit<ReceivableAccount, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    
    const newAccount: ReceivableAccount = {
      id: uuidv4(),
      ...account,
      createdAt: now,
      updatedAt: now
    };
    
    setAccounts([newAccount, ...accounts]);
    setIsFormOpen(false);
  };
  
  const handleUpdateAccount = (id: string, updatedData: Partial<ReceivableAccount>) => {
    setAccounts(accounts.map(account => {
      if (account.id === id) {
        // Determine the status based on updated data
        let newStatus = account.status;
        
        if (updatedData.receivedDate) {
          // If there's a partial payment
          if (updatedData.remainingAmount && updatedData.remainingAmount > 0) {
            newStatus = 'partially_received' as const;
          } else {
            newStatus = 'received' as const;
          }
        } else if (new Date(account.dueDate) < new Date()) {
          newStatus = 'overdue' as const;
        } else {
          newStatus = 'pending' as const;
        }
        
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
  };
  
  const handleDeleteAccount = (id: string) => {
    setAccounts(accounts.filter(account => account.id !== id));
  };
  
  const handleEdit = (account: ReceivableAccount) => {
    setEditingAccount(account);
    setIsFormOpen(true);
  };
  
  const handleMarkAsReceived = (id: string, fullAmount: boolean = true, partialAmount?: number) => {
    const today = new Date().toISOString().split('T')[0];
    
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
