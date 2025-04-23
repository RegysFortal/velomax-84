
import React, { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { DateRangeFilter } from '@/components/dashboard/DateRangeFilter';
import { format, addDays, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ReceivableAccount } from '@/types';
import { ReceivableAccountsTable } from './components/ReceivableAccountsTable';
import { ReceivableAccountsForm } from './components/ReceivableAccountsForm';
import { ReceivableAccountsFilters } from './components/ReceivableAccountsFilters';
import { ReceivableAccountsStats } from './components/ReceivableAccountsStats';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

// Mock data for now - would be replaced with actual data from a context or API
const mockAccounts: ReceivableAccount[] = [
  {
    id: '1',
    clientId: 'client1',
    clientName: 'Empresa ABC',
    description: 'Serviço de frete',
    amount: 3500,
    dueDate: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
    status: 'pending',
    categoryId: '1',
    categoryName: 'Fretes',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    clientId: 'client2',
    clientName: 'Distribuidora XYZ',
    description: 'Entrega de mercadorias',
    amount: 2800,
    dueDate: format(addDays(new Date(), -2), 'yyyy-MM-dd'),
    status: 'overdue',
    categoryId: '1',
    categoryName: 'Fretes',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    clientId: 'client3',
    clientName: 'Comércio Ltda',
    description: 'Transporte mensal',
    amount: 5200,
    dueDate: format(addDays(new Date(), -10), 'yyyy-MM-dd'),
    receivedDate: format(addDays(new Date(), -10), 'yyyy-MM-dd'),
    receivedAmount: 5200,
    receivedMethod: 'pix',
    status: 'received',
    categoryId: '1',
    categoryName: 'Fretes',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    clientId: 'client4',
    clientName: 'Indústria Nacional',
    description: 'Transporte de cargas',
    amount: 4200,
    dueDate: format(addDays(new Date(), -5), 'yyyy-MM-dd'),
    receivedDate: format(addDays(new Date(), -5), 'yyyy-MM-dd'),
    receivedAmount: 2000,
    remainingAmount: 2200,
    receivedMethod: 'transfer',
    status: 'partially_received',
    categoryId: '1',
    categoryName: 'Fretes',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export default function ReceivableAccountsPage() {
  const [startDate, setStartDate] = useState<string>(format(new Date(), 'yyyy-MM-01'));
  const [endDate, setEndDate] = useState<string>(format(addDays(new Date(startDate), 30), 'yyyy-MM-dd'));
  const [accounts, setAccounts] = useState<ReceivableAccount[]>(mockAccounts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<ReceivableAccount | null>(null);
  
  // Update accounts to check for any newly overdue items
  const updateAccountsStatus = () => {
    const updatedAccounts = accounts.map(account => {
      if (account.status === 'pending' && isPast(new Date(account.dueDate))) {
        return { ...account, status: 'overdue' };
      }
      return account;
    });
    setAccounts(updatedAccounts);
  };
  
  React.useEffect(() => {
    updateAccountsStatus();
  }, []);
  
  const handleDateRangeChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };
  
  const handleFormSubmit = (account: ReceivableAccount) => {
    if (editingAccount) {
      // Update existing account
      setAccounts(accounts.map(a => a.id === account.id ? account : a));
    } else {
      // Add new account
      setAccounts([...accounts, { 
        ...account, 
        id: Math.random().toString(36).substring(2, 11),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }]);
    }
    setIsFormOpen(false);
    setEditingAccount(null);
  };
  
  const handleEditAccount = (account: ReceivableAccount) => {
    setEditingAccount(account);
    setIsFormOpen(true);
  };
  
  const handleDeleteAccount = (id: string) => {
    setAccounts(accounts.filter(account => account.id !== id));
  };
  
  const handleMarkAsReceived = (id: string, fullAmount: boolean = true, partialAmount?: number) => {
    setAccounts(accounts.map(account => {
      if (account.id === id) {
        if (fullAmount) {
          return {
            ...account,
            status: 'received',
            receivedDate: format(new Date(), 'yyyy-MM-dd'),
            receivedAmount: account.amount,
            remainingAmount: 0
          };
        } else if (partialAmount) {
          const remaining = account.amount - partialAmount;
          return {
            ...account,
            status: 'partially_received',
            receivedDate: format(new Date(), 'yyyy-MM-dd'),
            receivedAmount: partialAmount,
            remainingAmount: remaining
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
              Gerencie receitas e pagamentos de clientes
            </p>
          </div>
          <div className="flex gap-4">
            <DateRangeFilter
              startDate={startDate}
              endDate={endDate}
              onDateRangeChange={handleDateRangeChange}
            />
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Receita
            </Button>
          </div>
        </div>
        
        {/* Statistics Cards */}
        <ReceivableAccountsStats accounts={accounts} />
        
        {/* Filters */}
        <ReceivableAccountsFilters />
        
        {/* Accounts Table */}
        <ReceivableAccountsTable
          accounts={accounts}
          onEditAccount={handleEditAccount}
          onDeleteAccount={handleDeleteAccount}
          onMarkAsReceived={handleMarkAsReceived}
        />
      </div>
      
      {/* Add/Edit Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingAccount ? 'Editar Receita' : 'Nova Receita'}</DialogTitle>
          </DialogHeader>
          <ReceivableAccountsForm
            account={editingAccount}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingAccount(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
