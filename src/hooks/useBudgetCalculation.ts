
import { useClients, usePriceTables } from '@/contexts';
import { Budget, PackageMeasurement, calculateCubicWeight, getEffectiveWeight } from '@/types/budget';
import { Client, PriceTable } from '@/types';

export function useBudgetCalculation() {
  console.log("useBudgetCalculation hook initialized");
  const { clients } = useClients();
  const { priceTables } = usePriceTables();

  const getClientPriceTable = (clientId: string): PriceTable | undefined => {
    const client = clients.find(c => c.id === clientId);
    if (!client || !client.priceTableId) return undefined;
    
    return priceTables.find(pt => pt.id === client.priceTableId);
  };

  const calculateBudgetValue = (budget: Budget): number => {
    if (!budget.clientId) return 0;
    
    const priceTable = getClientPriceTable(budget.clientId);
    if (!priceTable) {
      console.warn('Tabela de preços não encontrada para este cliente');
      return 0;
    }

    // Start with the base rate according to delivery type
    let totalValue = 0;
    
    switch (budget.deliveryType) {
      case 'standard':
        totalValue = priceTable.minimumRate.standardDelivery;
        break;
      case 'emergency':
        totalValue = priceTable.minimumRate.emergencyCollection;
        break;
      case 'exclusive':
        totalValue = priceTable.minimumRate.exclusiveVehicle;
        break;
      case 'metropolitanRegion':
        totalValue = priceTable.minimumRate.metropolitanRegion;
        break;
      case 'doorToDoorInterior':
        totalValue = priceTable.minimumRate.doorToDoorInterior;
        break;
      case 'saturday':
        totalValue = priceTable.minimumRate.saturdayCollection;
        break;
      case 'sundayHoliday':
        totalValue = priceTable.minimumRate.sundayHoliday;
        break;
      case 'difficultAccess':
        totalValue = priceTable.minimumRate.scheduledDifficultAccess;
        break;
      case 'reshipment':
        totalValue = priceTable.minimumRate.reshipment;
        break;
      case 'normalBiological':
        totalValue = priceTable.minimumRate.normalBiological;
        break;
      case 'infectiousBiological':
        totalValue = priceTable.minimumRate.infectiousBiological;
        break;
      case 'tracked':
        totalValue = priceTable.minimumRate.trackedVehicle;
        break;
      default:
        totalValue = priceTable.minimumRate.standardDelivery;
    }

    // Calculate the total weight of packages
    let totalWeight = 0;
    
    budget.packages.forEach(pkg => {
      const quantity = pkg.quantity || 1;
      const cubicWeight = calculateCubicWeight(pkg.width, pkg.length, pkg.height);
      const effectiveWeight = getEffectiveWeight(pkg.weight, cubicWeight);
      
      // Add the effective weight (per package * quantity)
      totalWeight += effectiveWeight * quantity;
    });
    
    console.log(`Total weight: ${totalWeight}kg, Base rate before excess weight: ${totalValue}`);
    
    // Calculate excess weight surcharge only if the total weight exceeds 10kg
    if (totalWeight > 10) {
      // Determine which rate to use based on delivery type
      let ratePerKg = priceTable.excessWeight.minPerKg;
      
      if (budget.deliveryType === 'emergency' || 
          budget.deliveryType === 'exclusive' || 
          budget.deliveryType === 'saturday' || 
          budget.deliveryType === 'sundayHoliday') {
        ratePerKg = priceTable.excessWeight.maxPerKg;
      } else if (budget.deliveryType === 'normalBiological' || 
                budget.deliveryType === 'infectiousBiological') {
        ratePerKg = priceTable.excessWeight.biologicalPerKg;
      } else if (budget.deliveryType === 'reshipment') {
        ratePerKg = priceTable.excessWeight.reshipmentPerKg;
      }
      
      const excessWeightCharge = (totalWeight - 10) * ratePerKg;
      console.log(`Excess weight: ${totalWeight - 10}kg at rate ${ratePerKg}/kg = ${excessWeightCharge}`);
      
      // Only apply the excess weight rate to weight above 10kg
      totalValue += excessWeightCharge;
    }
    
    // Add insurance if applicable
    if (budget.merchandiseValue > 0) {
      const insuranceValue = budget.merchandiseValue * (priceTable.insurance.rate || 0.01);
      console.log(`Insurance value: ${insuranceValue} (${budget.merchandiseValue} × ${priceTable.insurance.rate || 0.01})`);
      totalValue += insuranceValue;
    }
    
    // Add additional services
    if (budget.additionalServices && budget.additionalServices.length > 0) {
      const additionalServicesValue = budget.additionalServices.reduce((sum, service) => sum + service.value, 0);
      console.log(`Additional services value: ${additionalServicesValue}`);
      totalValue += additionalServicesValue;
    }
    
    // If both collection and delivery are selected, multiply by 2
    if (budget.hasCollection && budget.hasDelivery) {
      console.log(`Collection + Delivery: ${totalValue} * 2 = ${totalValue * 2}`);
      totalValue *= 2;
    } else if (!budget.hasDelivery) {
      // If only collection is selected (no delivery), reduce value
      console.log(`Collection only: ${totalValue} * 0.7 = ${totalValue * 0.7}`);
      totalValue *= 0.7;
    }
    
    // Apply discount if configured in price table
    if (priceTable.defaultDiscount && priceTable.defaultDiscount > 0) {
      const discountValue = totalValue * (priceTable.defaultDiscount / 100);
      console.log(`Discount: ${discountValue} (${priceTable.defaultDiscount}%)`);
      totalValue = totalValue - discountValue;
    }
    
    // Apply multiplier if exists
    if (priceTable.multiplier && priceTable.multiplier > 0) {
      console.log(`Multiplier: ${totalValue} * ${priceTable.multiplier} = ${totalValue * priceTable.multiplier}`);
      totalValue *= priceTable.multiplier;
    }
    
    console.log(`Final calculation: ${totalValue}`);
    return totalValue;
  };

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
    calculateBudgetValue,
    getClientPriceTable,
    calculatePackageWeights
  };
}
