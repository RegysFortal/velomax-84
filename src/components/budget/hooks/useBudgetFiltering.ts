
import { Budget } from '@/types/budget';
import { isSameDay } from 'date-fns';

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
  // Apply search term filter
  const applySearchFilter = (budgets: Budget[], term: string): Budget[] => {
    if (!term.trim()) return budgets;
    
    const lowerTerm = term.toLowerCase().trim();
    
    return budgets.filter(budget => {
      const clientName = getClientName(budget.clientId).toLowerCase();
      return clientName.includes(lowerTerm);
    });
  };
  
  // Apply date filter
  const applyDateFilter = (budgets: Budget[], date: Date | undefined): Budget[] => {
    if (!date) return budgets;
    
    return budgets.filter(budget => {
      if (!budget.createdAt) return false;
      
      const budgetDate = new Date(budget.createdAt);
      return isSameDay(budgetDate, date);
    });
  };
  
  // Apply all filters
  const searchFiltered = applySearchFilter(budgets, searchTerm);
  const filteredBudgets = applyDateFilter(searchFiltered, dateFilter);
  
  return filteredBudgets;
}
