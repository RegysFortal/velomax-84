
import { useMemo } from 'react';
import { Budget } from '@/types/budget';

interface UseBudgetSortingProps {
  budgets: Budget[];
  sortConfig: { key: string; direction: 'ascending' | 'descending' } | null;
  getClientName: (clientId: string) => string;
  calculateTotalWeight: (budget: Budget) => number;
}

export function useBudgetSorting({
  budgets,
  sortConfig,
  getClientName,
  calculateTotalWeight
}: UseBudgetSortingProps) {
  
  const sortedBudgets = useMemo(() => {
    if (!sortConfig) return budgets;
    
    return [...budgets].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortConfig.key) {
        case 'client':
          aValue = getClientName(a.clientId).toLowerCase();
          bValue = getClientName(b.clientId).toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.createdAt || '').getTime();
          bValue = new Date(b.createdAt || '').getTime();
          break;
        case 'volumes':
          aValue = a.totalVolumes;
          bValue = b.totalVolumes;
          break;
        case 'weight':
          aValue = calculateTotalWeight(a);
          bValue = calculateTotalWeight(b);
          break;
        case 'value':
          aValue = a.totalValue;
          bValue = b.totalValue;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [budgets, sortConfig, getClientName, calculateTotalWeight]);

  return sortedBudgets;
}
