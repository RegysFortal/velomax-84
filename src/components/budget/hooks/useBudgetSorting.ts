
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
  if (!sortConfig) {
    return budgets;
  }
  
  return [...budgets].sort((a, b) => {
    if (sortConfig.key === 'clientName') {
      const aName = getClientName(a.clientId);
      const bName = getClientName(b.clientId);
      
      if (sortConfig.direction === 'ascending') {
        return aName.localeCompare(bName);
      } else {
        return bName.localeCompare(aName);
      }
    }
    
    if (sortConfig.key === 'date') {
      const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      
      if (sortConfig.direction === 'ascending') {
        return aDate - bDate;
      } else {
        return bDate - aDate;
      }
    }
    
    if (sortConfig.key === 'volumes') {
      if (sortConfig.direction === 'ascending') {
        return a.totalVolumes - b.totalVolumes;
      } else {
        return b.totalVolumes - a.totalVolumes;
      }
    }
    
    if (sortConfig.key === 'weight') {
      const aWeight = calculateTotalWeight(a);
      const bWeight = calculateTotalWeight(b);
      
      if (sortConfig.direction === 'ascending') {
        return aWeight - bWeight;
      } else {
        return bWeight - aWeight;
      }
    }
    
    if (sortConfig.key === 'value') {
      if (sortConfig.direction === 'ascending') {
        return a.totalValue - b.totalValue;
      } else {
        return b.totalValue - a.totalValue;
      }
    }
    
    return 0;
  });
}
