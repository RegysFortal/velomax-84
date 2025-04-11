
import { useMemo } from 'react';
import { Budget } from '@/types/budget';

interface UseBudgetFilteringProps {
  budgets: Budget[];
  searchTerm: string;
  dateFilter: Date | undefined;
  getClientName: (clientId: string) => string;
}

export function useBudgetFiltering({
  budgets,
  searchTerm,
  dateFilter,
  getClientName
}: UseBudgetFilteringProps) {
  
  const filteredBudgets = useMemo(() => {
    return budgets.filter(budget => {
      const clientName = getClientName(budget.clientId).toLowerCase();
      const searchMatch = !searchTerm || 
        clientName.includes(searchTerm.toLowerCase());

      // Date filter
      const dateMatch = !dateFilter || 
        (budget.createdAt && new Date(budget.createdAt).toDateString() === dateFilter.toDateString());

      return searchMatch && dateMatch;
    });
  }, [budgets, searchTerm, dateFilter, getClientName]);

  return filteredBudgets;
}
