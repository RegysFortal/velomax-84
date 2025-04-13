
import { Budget, PackageMeasurement, calculateCubicWeight, getEffectiveWeight } from '@/types/budget';
import { PriceTable } from '@/types/priceTable';
import { calculateBudgetValue as calculatePriceTableBudgetValue } from '@/contexts/priceTables/priceTableUtils';

export function useBudgetCalculations() {
  // Calculate total weight from package measurements
  const calculateTotalWeight = (budget: Budget) => {
    return budget.packages.reduce((total, pkg) => {
      const cubicWeight = calculateCubicWeight(pkg.width, pkg.length, pkg.height);
      const effectiveWeight = getEffectiveWeight(pkg.weight, cubicWeight);
      const quantity = pkg.quantity || 1;
      return total + (effectiveWeight * quantity);
    }, 0);
  };
  
  // Calculate budget value based on price table
  const calculateBudgetValue = (budget: Budget, priceTable?: PriceTable): number => {
    if (!priceTable) {
      console.log('No price table found for budget calculation');
      return 0;
    }
    
    const totalWeight = calculateTotalWeight(budget);
    
    // Validate additionalServices fields before passing to the function
    const validAdditionalServices = budget.additionalServices.map(service => ({
      id: service.id,
      description: service.description || '',  // Ensure description is never undefined
      value: service.value || 0  // Ensure value is never undefined
    }));
    
    return calculatePriceTableBudgetValue(
      priceTable,
      budget.deliveryType,
      totalWeight,
      budget.merchandiseValue,
      validAdditionalServices,
      budget.hasCollection,
      budget.hasDelivery
    );
  };

  // Calculate package weights
  const calculatePackageWeights = (pkg: PackageMeasurement) => {
    const realWeight = pkg.weight || 0;
    const cubicWeight = calculateCubicWeight(pkg.width || 0, pkg.length || 0, pkg.height || 0);
    const effectiveWeight = getEffectiveWeight(realWeight, cubicWeight);
    
    return {
      realWeight,
      cubicWeight: parseFloat(cubicWeight.toFixed(2)),
      effectiveWeight: parseFloat(effectiveWeight.toFixed(2))
    };
  };

  return {
    calculateTotalWeight,
    calculateBudgetValue,
    calculatePackageWeights
  };
}
