
import { PayableAccount, ReceivableAccount } from '@/types/financial';

export function useFinancialReportsUtils() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getCategoryExpenseData = (accounts: PayableAccount[]) => {
    const categoryTotals = accounts.reduce((acc, account) => {
      const category = account.categoryName || 'Outros';
      acc[category] = (acc[category] || 0) + account.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value
    }));
  };

  const getCategoryIncomeData = (accounts: ReceivableAccount[]) => {
    const categoryTotals = accounts.reduce((acc, account) => {
      const category = account.categoryName || 'Outros';
      acc[category] = (acc[category] || 0) + account.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value
    }));
  };

  const getMonthlyComparisonData = (payables: PayableAccount[], receivables: ReceivableAccount[]) => {
    const months = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
      
      const monthPayables = payables.filter(account => {
        const accountDate = new Date(account.dueDate);
        return accountDate.getMonth() === date.getMonth() && accountDate.getFullYear() === date.getFullYear();
      }).reduce((sum, account) => sum + account.amount, 0);
      
      const monthReceivables = receivables.filter(account => {
        const accountDate = new Date(account.dueDate);
        return accountDate.getMonth() === date.getMonth() && accountDate.getFullYear() === date.getFullYear();
      }).reduce((sum, account) => sum + account.amount, 0);
      
      months.push({
        month: monthName,
        despesas: monthPayables,
        receitas: monthReceivables
      });
    }
    
    return months;
  };

  return {
    formatCurrency,
    getCategoryExpenseData,
    getCategoryIncomeData,
    getMonthlyComparisonData
  };
}
