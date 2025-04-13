
import { PriceTable } from '@/types';

export const getPriceTable = (priceTables: PriceTable[], id: string): PriceTable | undefined => {
  return priceTables.find((table) => table.id === id);
};

export const calculateInsurance = (
  priceTables: PriceTable[],
  priceTableId: string, 
  invoiceValue: number, 
  isReshipment: boolean,
  cargoType: 'standard' | 'perishable'
): number => {
  const table = getPriceTable(priceTables, priceTableId);
  if (!table || !table.insurance) return 0;
  
  if (isReshipment) {
    return invoiceValue * 0.01;
  }
  
  const rate = cargoType === 'perishable' 
    ? (table.insurance.perishable || table.insurance.rate) 
    : (table.insurance.standard || table.insurance.rate);
    
  return invoiceValue * rate;
};

// Add utility function to calculate budget value
export const calculateBudgetValue = (
  priceTable: PriceTable,
  deliveryType: string,
  totalWeight: number,
  merchandiseValue: number | null | undefined,
  additionalServices: { description: string; value: number }[],
  hasCollection: boolean,
  hasDelivery: boolean,
  cargoType: 'standard' | 'perishable' = 'standard'
): number => {
  if (!priceTable) {
    console.log('No price table found for budget calculation');
    return 0;
  }
  
  console.log('Starting budget calculation with price table:', priceTable.name);
  
  // Start with the base rate according to delivery type
  let totalValue = 0;
  
  switch (deliveryType) {
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
  
  console.log(`Base rate for ${deliveryType}: ${totalValue}`);
  
  // Calculate excess weight charge only if the total weight exceeds 10kg
  if (totalWeight > 10) {
    // Determine which rate to use based on delivery type
    let ratePerKg = priceTable.excessWeight.minPerKg;
    
    if (deliveryType === 'emergency' || 
        deliveryType === 'exclusive' || 
        deliveryType === 'saturday' || 
        deliveryType === 'sundayHoliday') {
      ratePerKg = priceTable.excessWeight.maxPerKg;
    } else if (deliveryType === 'normalBiological' || 
              deliveryType === 'infectiousBiological') {
      ratePerKg = priceTable.excessWeight.biologicalPerKg;
    } else if (deliveryType === 'reshipment') {
      ratePerKg = priceTable.excessWeight.reshipmentPerKg;
    }
    
    const excessWeightCharge = (totalWeight - 10) * ratePerKg;
    console.log(`Excess weight: ${totalWeight - 10}kg at rate ${ratePerKg}/kg = ${excessWeightCharge}`);
    
    // Only apply the excess weight rate to weight above 10kg
    totalValue += excessWeightCharge;
  }
  
  // Add insurance if applicable
  if (merchandiseValue && merchandiseValue > 0) {
    const insuranceRate = cargoType === 'perishable' 
      ? (priceTable.insurance.perishable || priceTable.insurance.rate) 
      : (priceTable.insurance.standard || priceTable.insurance.rate);
    
    const insuranceValue = merchandiseValue * insuranceRate;
    console.log(`Insurance value: ${insuranceValue} (${merchandiseValue} × ${insuranceRate})`);
    totalValue += insuranceValue;
  } else {
    console.log('No merchandise value set for insurance calculation');
  }
  
  // Add additional services
  if (additionalServices && additionalServices.length > 0) {
    const additionalServicesValue = additionalServices.reduce((sum, service) => sum + service.value, 0);
    console.log(`Additional services value: ${additionalServicesValue}`);
    totalValue += additionalServicesValue;
  }
  
  // If both collection and delivery are selected, multiply by 2
  if (hasCollection && hasDelivery) {
    console.log(`Collection + Delivery: ${totalValue} * 2 = ${totalValue * 2}`);
    totalValue *= 2;
  } else if (!hasDelivery && hasCollection) {
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
  return parseFloat(totalValue.toFixed(2));
};
