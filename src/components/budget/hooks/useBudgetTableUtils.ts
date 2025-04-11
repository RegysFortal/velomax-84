
import { formatCurrency } from '@/lib/utils';
import { Budget } from '@/types/budget';
import { Client } from '@/types';
import { useClientLookup } from './useClientLookup';
import { useBudgetCalculations } from './useBudgetCalculations';
import { useBudgetActions } from './useBudgetActions';
import { useBudgetFiltering } from './useBudgetFiltering';
import { useBudgetSorting } from './useBudgetSorting';

interface UseBudgetTableUtilsProps {
  budgets: Budget[];
  clients: Client[];
  searchTerm: string;
  dateFilter: Date | undefined;
  sortConfig: { key: string; direction: 'ascending' | 'descending' } | null;
}

export function useBudgetTableUtils({
  budgets,
  clients,
  searchTerm,
  dateFilter,
  sortConfig
}: UseBudgetTableUtilsProps) {
  
  // Use the smaller, focused hooks
  const { getClientName } = useClientLookup({ clients });
  const { calculateTotalWeight } = useBudgetCalculations();
  const { handlePrint, handleEdit } = useBudgetActions({ getClientName });
  
  // Apply filters first
  const filteredBudgets = useBudgetFiltering({
    budgets,
    searchTerm,
    dateFilter,
    getClientName
  });
  
  // Then sort the filtered results
  const sortedAndFilteredBudgets = useBudgetSorting({
    budgets: filteredBudgets,
    sortConfig,
    getClientName,
    calculateTotalWeight
  });

  return {
    getClientName,
    formatCurrency,
    calculateTotalWeight,
    handlePrint,
    handleEdit,
    filteredBudgets: sortedAndFilteredBudgets
  };
}
