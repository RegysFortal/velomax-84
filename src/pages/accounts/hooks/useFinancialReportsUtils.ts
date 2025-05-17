
import { PayableAccount, ReceivableAccount } from '@/types';
import { format, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function useFinancialReportsUtils() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  function getCategoryExpenseData(accounts: PayableAccount[]) {
    const categoryMap = new Map<string, number>();
    accounts.forEach(account => {
      const category = account.categoryName || 'Sem categoria';
      const current = categoryMap.get(category) || 0;
      categoryMap.set(category, current + account.amount);
    });
    
    return Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));
  }
  
  function getCategoryIncomeData(accounts: ReceivableAccount[]) {
    const categoryMap = new Map<string, number>();
    accounts.forEach(account => {
      const category = account.categoryName || 'Sem categoria';
      const current = categoryMap.get(category) || 0;
      categoryMap.set(category, current + account.amount);
    });
    
    return Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));
  }
  
  function getMonthlyComparisonData(payables: PayableAccount[], receivables: ReceivableAccount[]) {
    const monthlyData: Record<string, { month: string, expenses: number, income: number }> = {};
    
    // Last 6 months
    for (let i = 0; i < 6; i++) {
      const date = subMonths(new Date(), i);
      const monthKey = format(date, 'yyyy-MM');
      const monthLabel = format(date, 'MMM/yy', { locale: ptBR });
      
      monthlyData[monthKey] = { month: monthLabel, expenses: 0, income: 0 };
    }
    
    // Calculate expenses per month
    payables.forEach(account => {
      const monthKey = account.dueDate.substring(0, 7); // YYYY-MM
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].expenses += account.amount;
      }
    });
    
    // Calculate income per month
    receivables.forEach(account => {
      const monthKey = account.dueDate.substring(0, 7); // YYYY-MM
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].income += account.amount;
      }
    });
    
    return Object.values(monthlyData).reverse();
  }

  return {
    formatCurrency,
    getCategoryExpenseData,
    getCategoryIncomeData,
    getMonthlyComparisonData
  };
}
