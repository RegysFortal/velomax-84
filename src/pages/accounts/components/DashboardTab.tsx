
import { TabsContent } from "@/components/ui/tabs";
import { SummaryCards } from "./SummaryCards";
import { ChartSection } from "./ChartSection";

interface DashboardTabProps {
  totalPayable: number;
  pendingPayable: number;
  totalReceivable: number;
  pendingReceivable: number;
  balance: number;
  cashFlow: number;
  formatCurrency: (value: number) => string;
  monthlyComparisonData: Array<{
    month: string;
    despesas: number;
    receitas: number;
  }>;
  categoryExpenseData: Array<{
    name: string;
    value: number;
  }>;
  categoryIncomeData: Array<{
    name: string;
    value: number;
  }>;
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
      <SummaryCards 
        totalPayable={totalPayable}
        pendingPayable={pendingPayable}
        totalReceivable={totalReceivable}
        pendingReceivable={pendingReceivable}
        balance={balance}
        cashFlow={cashFlow}
        formatCurrency={formatCurrency}
      />
      
      <ChartSection 
        monthlyComparisonData={monthlyComparisonData}
        categoryExpenseData={categoryExpenseData}
        categoryIncomeData={categoryIncomeData}
      />
    </TabsContent>
  );
}
