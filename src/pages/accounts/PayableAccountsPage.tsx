
import React, { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { DateRangeFilter } from '@/components/dashboard/DateRangeFilter';
import { format, addDays, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PayableAccount } from '@/types';
import { PayableAccountsTable } from './components/PayableAccountsTable';
import { PayableAccountsForm } from './components/PayableAccountsForm';
import { PayableAccountsFilters } from './components/PayableAccountsFilters';
import { PayableAccountsStats } from './components/PayableAccountsStats';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

// Mock data for now - would be replaced with actual data from a context or API
const mockAccounts: PayableAccount[] = [
  {
    id: '1',
    supplierName: 'Fornecedor de Combustíveis',
    description: 'Abastecimento da frota',
    amount: 5000,
    dueDate: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
    paymentMethod: 'boleto',
    status: 'pending',
    categoryId: '1',
    categoryName: 'Combustível',
    isFixedExpense: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    supplierName: 'Aluguel do Galpão',
    description: 'Aluguel mensal',
    amount: 8500,
    dueDate: format(addDays(new Date(), -2), 'yyyy-MM-dd'),
    paymentMethod: 'transfer',
    status: 'overdue',
    categoryId: '2',
    categoryName: 'Aluguel',
    isFixedExpense: true,
    recurring: true,
    recurrenceFrequency: 'monthly',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    supplierName: 'Seguradora',
    description: 'Seguro da frota',
    amount: 3200,
    dueDate: format(addDays(new Date(), -10), 'yyyy-MM-dd'),
    paymentDate: format(addDays(new Date(), -10), 'yyyy-MM-dd'),
    paymentMethod: 'card',
    status: 'paid',
    categoryId: '3',
    categoryName: 'Seguros',
    isFixedExpense: true,
    recurring: true,
    recurrenceFrequency: 'monthly',
    installments: 12,
    currentInstallment: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export default function PayableAccountsPage() {
  const [startDate, setStartDate] = useState<string>(format(new Date(), 'yyyy-MM-01'));
  const [endDate, setEndDate] = useState<string>(format(addDays(new Date(startDate), 30), 'yyyy-MM-dd'));
  const [accounts, setAccounts] = useState<PayableAccount[]>(mockAccounts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<PayableAccount | null>(null);
  
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
  
  const handleFormSubmit = (account: PayableAccount) => {
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
  
  const handleEditAccount = (account: PayableAccount) => {
    setEditingAccount(account);
    setIsFormOpen(true);
  };
  
  const handleDeleteAccount = (id: string) => {
    setAccounts(accounts.filter(account => account.id !== id));
  };
  
  const handleMarkAsPaid = (id: string) => {
    setAccounts(accounts.map(account => {
      if (account.id === id) {
        return {
          ...account,
          status: 'paid',
          paymentDate: format(new Date(), 'yyyy-MM-dd')
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
              Gerencie despesas e pagamentos
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
              Nova Despesa
            </Button>
          </div>
        </div>
        
        {/* Statistics Cards */}
        <PayableAccountsStats accounts={accounts} />
        
        {/* Filters */}
        <PayableAccountsFilters />
        
        {/* Accounts Table */}
        <PayableAccountsTable
          accounts={accounts}
          onEditAccount={handleEditAccount}
          onDeleteAccount={handleDeleteAccount}
          onMarkAsPaid={handleMarkAsPaid}
        />
      </div>
      
      {/* Add/Edit Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingAccount ? 'Editar Despesa' : 'Nova Despesa'}</DialogTitle>
          </DialogHeader>
          <PayableAccountsForm
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
