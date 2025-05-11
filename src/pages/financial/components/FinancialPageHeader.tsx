
import React from 'react';

interface FinancialPageHeaderProps {
  children?: React.ReactNode;
}

export function FinancialPageHeader({ children }: FinancialPageHeaderProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
      <p className="text-muted-foreground">
        Gerenciamento dos relatórios financeiros de clientes.
      </p>
      {children}
    </div>
  );
}
