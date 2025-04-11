
import { Budget, PackageMeasurement, calculateCubicWeight, getEffectiveWeight } from '@/types/budget';
import { PriceTable } from '@/types/priceTable';

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
      console.log('Nenhuma tabela de preços encontrada para o cálculo do orçamento');
      return 0;
    }
    
    console.log('Iniciando cálculo do orçamento com tabela de preços:', priceTable.name);
    
    // Start with the base rate according to delivery type
    let totalValue = 0;
    
    // Define base rate based on delivery type
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
    
    console.log(`Taxa base para ${budget.deliveryType}: ${totalValue}`);
    
    // Calculate the total weight of packages
    let totalWeight = 0;
    
    budget.packages.forEach(pkg => {
      const quantity = pkg.quantity || 1;
      const cubicWeight = calculateCubicWeight(pkg.width, pkg.length, pkg.height);
      const effectiveWeight = getEffectiveWeight(pkg.weight, cubicWeight);
      
      // Add the effective weight (per package * quantity)
      totalWeight += effectiveWeight * quantity;
    });
    
    console.log(`Peso total: ${totalWeight}kg, Taxa base antes do excesso de peso: ${totalValue}`);
    
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
      console.log(`Excesso de peso: ${totalWeight - 10}kg na taxa ${ratePerKg}/kg = ${excessWeightCharge}`);
      
      // Only apply the excess weight rate to weight above 10kg
      totalValue += excessWeightCharge;
    }
    
    // Add insurance if applicable
    if (budget.merchandiseValue && budget.merchandiseValue > 0) {
      const insuranceValue = budget.merchandiseValue * (priceTable.insurance.rate || 0.01);
      console.log(`Valor do seguro: ${insuranceValue} (${budget.merchandiseValue} × ${priceTable.insurance.rate || 0.01})`);
      totalValue += insuranceValue;
    } else {
      console.log('Nenhum valor de mercadoria definido para cálculo de seguro');
    }
    
    // Add additional services
    if (budget.additionalServices && budget.additionalServices.length > 0) {
      const additionalServicesValue = budget.additionalServices.reduce((sum, service) => sum + service.value, 0);
      console.log(`Valor dos serviços adicionais: ${additionalServicesValue}`);
      totalValue += additionalServicesValue;
    }
    
    // If both collection and delivery are selected, multiply by 2
    if (budget.hasCollection && budget.hasDelivery) {
      console.log(`Coleta + Entrega: ${totalValue} * 2 = ${totalValue * 2}`);
      totalValue *= 2;
    } else if (!budget.hasDelivery && budget.hasCollection) {
      // If only collection is selected (no delivery), reduce value
      console.log(`Apenas coleta: ${totalValue} * 0.7 = ${totalValue * 0.7}`);
      totalValue *= 0.7;
    }
    
    // Apply discount if configured in price table
    if (priceTable.defaultDiscount && priceTable.defaultDiscount > 0) {
      const discountValue = totalValue * (priceTable.defaultDiscount / 100);
      console.log(`Desconto: ${discountValue} (${priceTable.defaultDiscount}%)`);
      totalValue = totalValue - discountValue;
    }
    
    // Apply multiplier if exists
    if (priceTable.multiplier && priceTable.multiplier > 0) {
      console.log(`Multiplicador: ${totalValue} * ${priceTable.multiplier} = ${totalValue * priceTable.multiplier}`);
      totalValue *= priceTable.multiplier;
    }
    
    console.log(`Cálculo final: ${totalValue}`);
    return parseFloat(totalValue.toFixed(2));
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
