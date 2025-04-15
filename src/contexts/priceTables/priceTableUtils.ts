
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

type AdditionalService = {
  id?: string;
  description: string;
  value: number;
};

export const calculateBudgetValue = (
  priceTable: PriceTable,
  deliveryType: string,
  totalWeight: number,
  merchandiseValue: number | null | undefined,
  additionalServices: AdditionalService[],
  hasCollection: boolean,
  hasDelivery: boolean,
  cargoType: 'standard' | 'perishable' = 'standard'
): number => {
  if (!priceTable) {
    console.log('No price table found for budget calculation');
    return 0;
  }
  
  console.log('Starting budget calculation with price table:', priceTable.name);
  
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
      
      if (merchandiseValue && merchandiseValue > 0) {
        const insuranceValue = merchandiseValue * 0.01;
        console.log(`Reshipment insurance value: ${insuranceValue} (${merchandiseValue} × 0.01)`);
        totalValue += insuranceValue;
      }
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
  
  // Only add excess weight charge if there is actual excess weight
  if (totalWeight > 10) {
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
    
    totalValue += excessWeightCharge;
  }
  
  // Apply perishable multiplier if cargo type is perishable and it's not already applied in base rate
  if (cargoType === 'perishable' && 
      deliveryType !== 'normalBiological' && 
      deliveryType !== 'infectiousBiological') {
    const perishableMultiplier = 1.2;
    console.log(`Applying perishable multiplier: ${totalValue} × ${perishableMultiplier} = ${totalValue * perishableMultiplier}`);
    totalValue *= perishableMultiplier;
  }
  
  // Add insurance for non-reshipment deliveries
  if (merchandiseValue && merchandiseValue > 0 && deliveryType !== 'reshipment') {
    const insuranceRate = cargoType === 'perishable' 
      ? (priceTable.insurance.perishable || priceTable.insurance.rate) 
      : (priceTable.insurance.standard || priceTable.insurance.rate);
    
    const insuranceValue = merchandiseValue * insuranceRate;
    console.log(`Insurance value: ${insuranceValue} (${merchandiseValue} × ${insuranceRate})`);
    totalValue += insuranceValue;
  } else if (deliveryType !== 'reshipment') {
    console.log('No merchandise value set for insurance calculation');
  }
  
  if (additionalServices && additionalServices.length > 0) {
    const validServices = additionalServices.filter(
      service => service.description && typeof service.value === 'number'
    );
    
    const additionalServicesValue = validServices.reduce((sum, service) => sum + service.value, 0);
    console.log(`Additional services value: ${additionalServicesValue}`);
    totalValue += additionalServicesValue;
  }
  
  if (hasCollection && hasDelivery) {
    console.log(`Collection + Delivery: ${totalValue} * 2 = ${totalValue * 2}`);
    totalValue *= 2;
  } else if (!hasDelivery && hasCollection) {
    console.log(`Collection only: ${totalValue} * 0.7 = ${totalValue * 0.7}`);
    totalValue *= 0.7;
  }
  
  if (priceTable.defaultDiscount && priceTable.defaultDiscount > 0) {
    const discountValue = totalValue * (priceTable.defaultDiscount / 100);
    console.log(`Discount: ${discountValue} (${priceTable.defaultDiscount}%)`);
    totalValue = totalValue - discountValue;
  }
  
  if (priceTable.multiplier && priceTable.multiplier > 0) {
    console.log(`Multiplier: ${totalValue} * ${priceTable.multiplier} = ${totalValue * priceTable.multiplier}`);
    totalValue *= priceTable.multiplier;
  }
  
  console.log(`Final calculation: ${totalValue}`);
  return parseFloat(totalValue.toFixed(2));
};
