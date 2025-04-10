
import { Delivery, PriceTable, City, doorToDoorDeliveryTypes, DeliveryType } from '@/types';

/**
 * Calculate the freight cost for a delivery
 */
export const calculateFreight = (
  priceTable: PriceTable | undefined,
  weight: number,
  deliveryType: DeliveryType,
  cargoType: Delivery['cargoType'],
  cargoValue: number = 0,
  _distance?: number,
  city?: City
): number => {
  try {
    if (!priceTable) return 0;
    
    let baseRate = 0;
    let excessWeightRate = 0;
    let totalFreight = 0;
    let weightLimit = 10;
    
    // Set base rate and excess weight rate based on delivery type
    switch (deliveryType) {
      case 'standard':
        baseRate = priceTable.minimumRate.standardDelivery;
        excessWeightRate = priceTable.excessWeight.minPerKg;
        break;
      case 'emergency':
        baseRate = priceTable.minimumRate.emergencyCollection;
        excessWeightRate = priceTable.excessWeight.maxPerKg;
        break;
      case 'saturday':
        baseRate = priceTable.minimumRate.saturdayCollection;
        excessWeightRate = priceTable.excessWeight.maxPerKg;
        break;
      case 'exclusive':
        baseRate = priceTable.minimumRate.exclusiveVehicle;
        excessWeightRate = priceTable.excessWeight.maxPerKg;
        break;
      case 'difficultAccess':
        baseRate = priceTable.minimumRate.scheduledDifficultAccess;
        excessWeightRate = priceTable.excessWeight.maxPerKg;
        break;
      case 'metropolitanRegion':
        baseRate = priceTable.minimumRate.metropolitanRegion;
        excessWeightRate = priceTable.excessWeight.maxPerKg;
        break;
      case 'sundayHoliday':
        baseRate = priceTable.minimumRate.sundayHoliday;
        excessWeightRate = priceTable.excessWeight.maxPerKg;
        break;
      case 'normalBiological':
        baseRate = priceTable.minimumRate.normalBiological;
        excessWeightRate = priceTable.excessWeight.biologicalPerKg;
        break;
      case 'infectiousBiological':
        baseRate = priceTable.minimumRate.infectiousBiological;
        excessWeightRate = priceTable.excessWeight.biologicalPerKg;
        break;
      case 'tracked':
        baseRate = priceTable.minimumRate.trackedVehicle;
        excessWeightRate = priceTable.excessWeight.maxPerKg;
        weightLimit = 100;
        break;
      case 'doorToDoorInterior':
        baseRate = priceTable.minimumRate.doorToDoorInterior;
        excessWeightRate = priceTable.excessWeight.maxPerKg;
        weightLimit = 100;
        
        if (city) {
          const distance = city.distance;
          totalFreight += distance * priceTable.doorToDoor.ratePerKm;
        }
        break;
      case 'reshipment':
        baseRate = priceTable.minimumRate.reshipment;
        excessWeightRate = priceTable.excessWeight.reshipmentPerKg;
        
        const insuranceRate = 0.01;
        const insurance = cargoValue * insuranceRate;
        totalFreight += insurance;
        break;
      // Add default cases for remaining delivery types
      case 'door_to_door':
      case 'scheduled':
        baseRate = priceTable.minimumRate.standardDelivery;
        excessWeightRate = priceTable.excessWeight.minPerKg;
        break;
    }
    
    if (weight <= weightLimit) {
      totalFreight += baseRate;
    } else {
      const excessWeight = weight - weightLimit;
      totalFreight += baseRate + (excessWeight * excessWeightRate);
    }
    
    if (cargoType === 'perishable') {
      totalFreight *= 1.2;
    }
    
    return Math.max(totalFreight, 0);
  } catch (error) {
    console.error('Error calculating freight:', error);
    return 0;
  }
};

/**
 * Check if a delivery type is a door-to-door delivery
 */
export const isDoorToDoorDelivery = (deliveryType: DeliveryType): boolean => {
  return doorToDoorDeliveryTypes.includes(deliveryType);
};

/**
 * Check if a delivery type is an exclusive delivery
 */
export const isExclusiveDelivery = (deliveryType: Delivery['deliveryType']): boolean => {
  return deliveryType === 'exclusive';
};

/**
 * Generate a sequential minute number based on the current date
 */
export const generateMinuteNumber = (deliveries: Delivery[]): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  
  // Find the highest minute number for the current month
  const currentMonthDeliveries = deliveries.filter(d => 
    d.minuteNumber.includes(`/${month}/${year}`)
  );
  
  let nextNumber = 1;
  if (currentMonthDeliveries.length > 0) {
    const numbers = currentMonthDeliveries.map(d => {
      const parts = d.minuteNumber.split('/');
      return parseInt(parts[0], 10);
    });
    nextNumber = Math.max(...numbers) + 1;
  }
  
  return `${String(nextNumber).padStart(3, '0')}/${month}/${year}`;
};

/**
 * Check if a minute number already exists for a client
 */
export const checkMinuteNumberExists = (
  deliveries: Delivery[],
  minuteNumber: string, 
  clientId: string
): boolean => {
  return deliveries.some(d => 
    d.minuteNumber === minuteNumber && d.clientId === clientId
  );
};
