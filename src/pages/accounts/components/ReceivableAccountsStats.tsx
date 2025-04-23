
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { isPast } from 'date-fns';
import { ReceivableAccount } from '@/types';

interface ReceivableAccountsStatsProps {
  accounts: ReceivableAccount[];
}

export function ReceivableAccountsStats({ accounts }: ReceivableAccountsStatsProps) {
  const stats = useMemo(() => {
    const totalAmount = accounts.reduce((sum, account) => sum + account.amount, 0);
    
    const pendingAccounts = accounts.filter(account => account.status === 'pending');
    const pendingAmount = pendingAccounts.reduce((sum, account) => sum + account.amount, 0);
    
    const overdueAccounts = accounts.filter(account => account.status === 'overdue');
    const overdueAmount = overdueAccounts.reduce((sum, account) => sum + account.amount, 0);
    
    const receivedAccounts = accounts.filter(account => account.status === 'received');
    const receivedAmount = receivedAccounts.reduce((sum, account) => sum + account.amount, 0);
    
    const partialAccounts = accounts.filter(account => account.status === 'partially_received');
    const partialReceivedAmount = partialAccounts.reduce((sum, account) => sum + (account.receivedAmount || 0), 0);
    const partialPendingAmount = partialAccounts.reduce((sum, account) => sum + (account.remainingAmount || 0), 0);
    
    const totalReceived = receivedAmount + partialReceivedAmount;
    const totalPending = pendingAmount + overdueAmount + partialPendingAmount;
    
    return {
      totalAmount,
      pendingAmount,
      overdueAmount,
      receivedAmount: totalReceived,
      pendingCount: pendingAccounts.length,
      overdueCount: overdueAccounts.length,
      receivedCount: receivedAccounts.length,
      partialCount: partialAccounts.length,
      totalPending
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
          <CardTitle className="text-sm font-medium">Total a Receber</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</div>
          <p className="text-xs text-muted-foreground">
            Total {accounts.length} contas
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pendente de Recebimento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{formatCurrency(stats.totalPending)}</div>
          <p className="text-xs text-muted-foreground">
            {stats.pendingCount} pendentes, {stats.overdueCount} atrasadas, {stats.partialCount} parciais
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recebido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.receivedAmount)}</div>
          <p className="text-xs text-muted-foreground">
            {stats.receivedCount} contas recebidas totalmente
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Recebimento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.totalAmount > 0 ? 
              `${((stats.receivedAmount / stats.totalAmount) * 100).toFixed(1)}%` : 
              '0%'
            }
          </div>
          <p className="text-xs text-muted-foreground">
            Valores recebidos / Total a receber
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
