
import { Budget } from '@/types/budget';

export function useBudgetCalculations() {
  // Calculate total weight from package measurements
  const calculateTotalWeight = (budget: Budget) => {
    return budget.packages.reduce((total, pkg) => {
      const weight = pkg.weight * (pkg.quantity || 1);
      return total + weight;
    }, 0);
  };

  return {
    calculateTotalWeight
  };
}
