
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { isPast } from 'date-fns';
import { PayableAccount } from '@/types';

interface PayableAccountsStatsProps {
  accounts: PayableAccount[];
}

export function PayableAccountsStats({ accounts }: PayableAccountsStatsProps) {
  const stats = useMemo(() => {
    const totalAmount = accounts.reduce((sum, account) => sum + account.amount, 0);
    
    const pendingAccounts = accounts.filter(account => account.status === 'pending');
    const pendingAmount = pendingAccounts.reduce((sum, account) => sum + account.amount, 0);
    
    const overdueAccounts = accounts.filter(account => account.status === 'overdue');
    const overdueAmount = overdueAccounts.reduce((sum, account) => sum + account.amount, 0);
    
    const paidAccounts = accounts.filter(account => account.status === 'paid');
    const paidAmount = paidAccounts.reduce((sum, account) => sum + account.amount, 0);
    
    const upcomingAccounts = accounts.filter(account => 
      account.status === 'pending' && 
      !isPast(new Date(account.dueDate))
    );
    
    const fixedExpensesAccounts = accounts.filter(account => account.isFixedExpense);
    const fixedExpensesAmount = fixedExpensesAccounts.reduce((sum, account) => sum + account.amount, 0);
    
    return {
      totalAmount,
      pendingAmount,
      overdueAmount,
      paidAmount,
      pendingCount: pendingAccounts.length,
      overdueCount: overdueAccounts.length,
      paidCount: paidAccounts.length,
      upcomingCount: upcomingAccounts.length,
      fixedExpensesCount: fixedExpensesAccounts.length,
      fixedExpensesAmount
    };
  }, [accounts]);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Despesas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</div>
          <p className="text-xs text-muted-foreground">
            Total {accounts.length} despesas
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Despesas Pendentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{formatCurrency(stats.pendingAmount)}</div>
          <p className="text-xs text-muted-foreground">
            {stats.pendingCount} despesas a vencer
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Despesas Atrasadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.overdueAmount)}</div>
          <p className="text-xs text-muted-foreground">
            {stats.overdueCount} despesas vencidas
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Despesas Pagas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.paidAmount)}</div>
          <p className="text-xs text-muted-foreground">
            {stats.paidCount} despesas quitadas
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
