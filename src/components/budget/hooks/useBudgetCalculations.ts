
import { Budget, PackageMeasurement, calculateCubicWeight, getEffectiveWeight } from '@/types/budget';
import { PriceTable } from '@/types/priceTable';

export function useBudgetCalculations() {
  // Calculate total weight from package measurements
  const calculateTotalWeight = (budget: Budget) => {
    return budget.packages.reduce((total, pkg) => {
      const weight = pkg.weight * (pkg.quantity || 1);
      return total + weight;
    }, 0);
  };
  
  // Calculate budget value based on price table
  const calculateBudgetValue = (budget: Budget, priceTable?: PriceTable): number => {
    if (!priceTable) return 0;
    
    // Start with the base rate according to delivery type
    let totalValue = 0;
    
    // Define base rate based on delivery type
    switch (budget.deliveryType) {
      case 'standard':
        totalValue += priceTable.minimumRate.standardDelivery;
        break;
      case 'emergency':
        totalValue += priceTable.minimumRate.emergencyCollection;
        break;
      case 'exclusive':
        totalValue += priceTable.minimumRate.exclusiveVehicle;
        break;
      case 'metropolitanRegion':
        totalValue += priceTable.minimumRate.metropolitanRegion;
        break;
      case 'doorToDoorInterior':
        totalValue += priceTable.minimumRate.doorToDoorInterior;
        break;
      case 'saturday':
        totalValue += priceTable.minimumRate.saturdayCollection;
        break;
      case 'sundayHoliday':
        totalValue += priceTable.minimumRate.sundayHoliday;
        break;
      case 'difficultAccess':
        totalValue += priceTable.minimumRate.scheduledDifficultAccess;
        break;
      case 'reshipment':
        totalValue += priceTable.minimumRate.reshipment;
        break;
      case 'normalBiological':
        totalValue += priceTable.minimumRate.normalBiological;
        break;
      case 'infectiousBiological':
        totalValue += priceTable.minimumRate.infectiousBiological;
        break;
      case 'tracked':
        totalValue += priceTable.minimumRate.trackedVehicle;
        break;
      default:
        totalValue += priceTable.minimumRate.standardDelivery;
    }
    
    // Calculate additional costs for packages
    let totalWeight = 0;
    
    budget.packages.forEach(pkg => {
      const quantity = pkg.quantity || 1;
      const cubicWeight = calculateCubicWeight(pkg.width, pkg.length, pkg.height);
      const effectiveWeight = getEffectiveWeight(pkg.weight, cubicWeight);
      
      // Add the effective weight (per package * quantity)
      totalWeight += effectiveWeight * quantity;
    });
    
    // Add cost for weight using the price table rates
    if (totalWeight > 0) {
      // Get the appropriate rate based on delivery type
      let ratePerKg = priceTable.excessWeight.minPerKg;
      
      // Adjust rate based on delivery type
      if (budget.deliveryType === 'emergency' || 
          budget.deliveryType === 'exclusive' || 
          budget.deliveryType === 'saturday' || 
          budget.deliveryType === 'sundayHoliday') {
        ratePerKg = priceTable.excessWeight.maxPerKg;
      } else if (budget.deliveryType === 'normalBiological' || 
                budget.deliveryType === 'infectiousBiological') {
        ratePerKg = priceTable.excessWeight.biologicalPerKg;
      }
      
      // Calculate the weight cost
      totalValue += totalWeight * ratePerKg;
    }
    
    // Add insurance if applicable
    if (budget.merchandiseValue > 0) {
      totalValue += budget.merchandiseValue * (priceTable.insurance.rate || 0.01); // Default to 1%
    }
    
    // Add additional services
    if (budget.additionalServices && budget.additionalServices.length > 0) {
      budget.additionalServices.forEach(service => {
        totalValue += service.value;
      });
    }
    
    // If both collection and delivery are selected, multiply by 2
    if (budget.hasCollection && budget.hasDelivery) {
      totalValue *= 2;
    } else if (!budget.hasDelivery) {
      // If only collection is selected (no delivery), reduce value
      totalValue *= 0.7;
    }
    
    // Apply discount if configured in price table
    if (priceTable.defaultDiscount && priceTable.defaultDiscount > 0) {
      totalValue = totalValue * (1 - priceTable.defaultDiscount / 100);
    }
    
    // Apply multiplier if exists
    if (priceTable.multiplier && priceTable.multiplier > 0) {
      totalValue *= priceTable.multiplier;
    }
    
    return totalValue;
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
