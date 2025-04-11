
import React, { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { BudgetTable } from '@/components/budget/BudgetTable';
import { BudgetFormDialog } from '@/components/budget/BudgetFormDialog';
import { FileText, Filter } from 'lucide-react';
import { BudgetTableHeader } from '@/components/budget/BudgetTableHeader';

const BudgetsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);

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

        <BudgetTableHeader 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
        />

        <BudgetTable 
          searchTerm={searchTerm}
          dateFilter={dateFilter}
        />
      </div>
    </AppLayout>
  );
};

export default BudgetsPage;
