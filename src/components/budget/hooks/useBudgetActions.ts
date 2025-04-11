
import { Budget } from '@/types/budget';
import { printBudget } from '@/utils/printUtils';

interface UseBudgetActionsProps {
  getClientName: (clientId: string) => string;
}

export function useBudgetActions({ getClientName }: UseBudgetActionsProps) {
  // Handle print
  const handlePrint = (budget: Budget) => {
    const clientName = getClientName(budget.clientId);
    printBudget(budget, clientName);
  };

  // Handle edit
  const handleEdit = (budget: Budget) => {
    console.log("Edit budget:", budget);
    // You can implement the edit functionality here
  };

  return {
    handlePrint,
    handleEdit
  };
}
