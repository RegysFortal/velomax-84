
import React from 'react';
import { AppLayout } from '@/components/AppLayout';
import { BudgetTable } from '@/components/budget/BudgetTable';
import { BudgetFormDialog } from '@/components/budget/BudgetFormDialog';
import { FileText } from 'lucide-react';

const BudgetsPage = () => {
  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Orçamentos</h1>
            <p className="text-muted-foreground">
              Gerencie seus orçamentos de fretes e serviços.
            </p>
          </div>
          <BudgetFormDialog />
        </div>

        <BudgetTable />
      </div>
    </AppLayout>
  );
};

export default BudgetsPage;
