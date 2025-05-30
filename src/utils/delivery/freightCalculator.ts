
import { PriceTable, City, DeliveryType } from '@/types';
import { Delivery } from '@/types/delivery';

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
        console.log(`Taxa base para entrega padrão: ${baseRate}`);
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
        
        if (city && city.distance) {
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
        break;
      default:
        // Check for custom services
        if (priceTable.minimumRate.customServices && priceTable.minimumRate.customServices.length > 0) {
          const customService = priceTable.minimumRate.customServices.find(
            service => 
              service.name && 
              service.name.toLowerCase() === String(deliveryType).toLowerCase()
          );
          if (customService) {
            baseRate = customService.baseRate;
            excessWeightRate = customService.excessRate;
            weightLimit = customService.minWeight;
            console.log(`Serviço personalizado encontrado: ${customService.name}`);
          } else {
            // Default to standard delivery if custom service not found
            baseRate = priceTable.minimumRate.standardDelivery;
            excessWeightRate = priceTable.excessWeight.minPerKg;
            console.log(`Serviço personalizado não encontrado, usando padrão: ${baseRate}`);
          }
        } else {
          // Default to standard delivery if no custom services
          baseRate = priceTable.minimumRate.standardDelivery;
          excessWeightRate = priceTable.excessWeight.minPerKg;
          console.log(`Sem serviços personalizados, usando padrão: ${baseRate}`);
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
    } else {
      console.log(`Sem excesso de peso: ${weight}kg <= ${weightLimit}kg`);
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
