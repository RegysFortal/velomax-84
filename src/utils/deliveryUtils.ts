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
    if (!priceTable) {
      console.warn('Tabela de preço não encontrada para cálculo de frete');
      return 0;
    }
    
    console.log(`Calculando frete - Tabela: ${priceTable.name}, Peso: ${weight}kg, Tipo: ${deliveryType}, Valor: ${cargoValue}`);
    
    let baseRate = 0;
    let excessWeightRate = 0;
    let totalFreight = 0;
    let weightLimit = 10; // Padrão para a maioria dos tipos de entrega
    
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
        weightLimit = 100; // Veículo rastreado tem limite de 100kg
        break;
      case 'doorToDoorInterior':
        baseRate = priceTable.minimumRate.doorToDoorInterior;
        excessWeightRate = priceTable.excessWeight.maxPerKg;
        weightLimit = 100; // Exclusivo interior tem limite de 100kg
        
        if (city) {
          const distance = city.distance;
          const ratePerKm = priceTable.doorToDoor.ratePerKm || 0;
          const distanceCharge = distance * ratePerKm;
          console.log(`Cobrança de distância: ${distanceCharge} (${distance}km × ${ratePerKm}/km)`);
          totalFreight += distanceCharge;
        }
        break;
      case 'reshipment':
        baseRate = priceTable.minimumRate.reshipment;
        excessWeightRate = priceTable.excessWeight.reshipmentPerKg;
        
        // For reshipment, calculate insurance as 1% of cargo value
        if (cargoValue > 0) {
          // Apply 1% insurance rate specifically for reshipment
          const insurance = cargoValue * 0.01;
          console.log(`Seguro de redespacho (1%): ${cargoValue} × 0.01 = ${insurance}`);
          totalFreight += insurance;
        }
        break;
      // Default cases for other delivery types
      case 'door_to_door':
      case 'scheduled':
        baseRate = priceTable.minimumRate.standardDelivery;
        excessWeightRate = priceTable.excessWeight.minPerKg;
        break;
      default:
        // Check for custom services
        if (priceTable.minimumRate.customServices && priceTable.minimumRate.customServices.length > 0) {
          const customService = priceTable.minimumRate.customServices.find(
            service => service.name && service.name.toLowerCase() === deliveryType.toLowerCase()
          );
          if (customService) {
            baseRate = customService.baseRate;
            excessWeightRate = customService.excessRate;
            weightLimit = customService.minWeight;
            console.log(`Serviço personalizado encontrado: ${customService.name}`);
          }
        }
        break;
    }
    
    console.log(`Taxa base para ${deliveryType}: ${baseRate}`);
    
    // Add base rate to total freight
    totalFreight += baseRate;
    
    // Calculate excess weight if weight exceeds the limit and only if there is actual excess weight
    if (weight > weightLimit) {
      const excessWeight = weight - weightLimit;
      const excessWeightCharge = excessWeight * excessWeightRate;
      console.log(`Excesso de peso: ${excessWeight}kg à taxa ${excessWeightRate}/kg = ${excessWeightCharge}`);
      totalFreight += excessWeightCharge;
    }
    
    // Apply multiplier for perishable cargo if not already applied by base rate
    if (cargoType === 'perishable' && deliveryType !== 'normalBiological' && deliveryType !== 'infectiousBiological') {
      const perishableMultiplier = 1.2;
      console.log(`Multiplicador de perecível: ${totalFreight} × ${perishableMultiplier} = ${totalFreight * perishableMultiplier}`);
      totalFreight *= perishableMultiplier;
    }
    
    // Add insurance value if there's cargo value - but only for non-reshipment deliveries
    // since we already calculated insurance for reshipment above
    if (cargoValue > 0 && deliveryType !== 'reshipment') {
      // Use standard rate for all cargo types now
      const insuranceRate = priceTable.insurance.standard || priceTable.insurance.rate;
      
      const insuranceCharge = cargoValue * insuranceRate;
      console.log(`Seguro: ${cargoValue} × ${insuranceRate} = ${insuranceCharge}`);
      totalFreight += insuranceCharge;
    }
    
    // Apply multiplier if it exists in the price table
    if (priceTable.multiplier && priceTable.multiplier > 0) {
      console.log(`Multiplicador da tabela: ${totalFreight} × ${priceTable.multiplier} = ${totalFreight * priceTable.multiplier}`);
      totalFreight *= priceTable.multiplier;
    }
    
    // Apply discount if it exists in the price table
    if (priceTable.defaultDiscount && priceTable.defaultDiscount > 0) {
      const discountRate = priceTable.defaultDiscount / 100;
      const discountValue = totalFreight * discountRate;
      console.log(`Desconto (${priceTable.defaultDiscount}%): ${discountValue}`);
      totalFreight -= discountValue;
    }
    
    // Round to two decimal places
    totalFreight = Math.round(totalFreight * 100) / 100;
    
    console.log(`Valor final do frete: ${totalFreight}`);
    
    // Ensure minimum value of 0
    return Math.max(totalFreight, 0);
  } catch (error) {
    console.error('Erro calculando frete:', error);
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
