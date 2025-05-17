
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { SummaryCards } from './SummaryCards';
import { ChartSection } from './ChartSection';
import { PayableAccount, ReceivableAccount } from '@/types';

interface DashboardTabProps {
  totalPayable: number;
  pendingPayable: number;
  totalReceivable: number;
  pendingReceivable: number;
  balance: number;
  cashFlow: string;
  formatCurrency: (value: number) => string;
  monthlyComparisonData: any[];
  categoryExpenseData: any[];
  categoryIncomeData: any[];
}

export function DashboardTab({
  totalPayable,
  pendingPayable,
  totalReceivable,
  pendingReceivable,
  balance,
  cashFlow,
  formatCurrency,
  monthlyComparisonData,
  categoryExpenseData,
  categoryIncomeData
}: DashboardTabProps) {
  return (
    <TabsContent value="dashboard" className="space-y-6">
      {/* Summary Cards */}
      <SummaryCards 
        totalPayable={totalPayable}
        pendingPayable={pendingPayable}
        totalReceivable={totalReceivable}
        pendingReceivable={pendingReceivable}
        balance={balance}
        cashFlow={cashFlow}
        formatCurrency={formatCurrency}
      />
      
      {/* Charts Section */}
      <ChartSection 
        monthlyComparisonData={monthlyComparisonData}
        categoryExpenseData={categoryExpenseData}
        categoryIncomeData={categoryIncomeData}
      />
    </TabsContent>
  );
}
