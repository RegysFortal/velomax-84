
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface SummaryCardsProps {
  totalPayable: number;
  pendingPayable: number;
  totalReceivable: number;
  pendingReceivable: number;
  balance: number;
  cashFlow: string;
  formatCurrency: (value: number) => string;
}

export function SummaryCards({
  totalPayable,
  pendingPayable,
  totalReceivable,
  pendingReceivable,
  balance,
  cashFlow,
  formatCurrency
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total a Pagar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{formatCurrency(totalPayable)}</div>
          <p className="text-xs text-muted-foreground">
            Pendente: {formatCurrency(pendingPayable)}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total a Receber</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(totalReceivable)}</div>
          <p className="text-xs text-muted-foreground">
            Pendente: {formatCurrency(pendingReceivable)}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saldo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {cashFlow}
          </div>
          <p className="text-xs text-muted-foreground">
            No período selecionado
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Realização</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalPayable > 0 ? 
              `${(((totalPayable - pendingPayable) / totalPayable) * 100).toFixed(1)}%` : 
              '0%'
            }
          </div>
          <p className="text-xs text-muted-foreground">
            Despesas pagas / Total despesas
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
