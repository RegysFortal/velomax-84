
import { Client } from '@/types/client';
import { DeliveryType, CargoType } from '@/types/delivery';
import { PriceTable } from '@/types/priceTable';

export const useFreightCalculation = (priceTables: PriceTable[] = []) => {
  
  const calculateFreightForClient = (client: Client, weight: number, deliveryType: string) => {
    // Fix the field name from price_table_id to priceTableId
    const priceTable = priceTables.find(pt => pt.id === client.priceTableId);

    if (!priceTable) {
      console.warn(`No price table found for client ${client.id}`);
      return 0;
    }

    // Placeholder for actual freight calculation logic
    // Replace with your actual freight calculation
    const baseRate = 50; // Example base rate
    const weightFactor = weight * 0.5; // Example weight factor
    const deliveryTypeFactor = deliveryType === 'express' ? 1.5 : 1; // Example delivery type factor

    const calculatedFreight = baseRate + weightFactor * deliveryTypeFactor;

    return calculatedFreight;
  };
  
  const calculateInsurance = (client: Client, invoiceValue: number) => {
    const priceTable = priceTables.find(pt => pt.id === client.priceTableId);

    if (!priceTable) {
      console.warn(`No price table found for client ${client.id}`);
      return 0;
    }

    // Placeholder for actual insurance calculation logic
    // Replace with your actual insurance calculation
    const insuranceRate = 0.02; // Example insurance rate (2%)
    const calculatedInsurance = invoiceValue * insuranceRate;

    return calculatedInsurance;
  };

  // Add the calculateFreight function that was missing
  const calculateFreight = (
    clientId: string,
    weight: number,
    deliveryType: DeliveryType,
    cargoType: CargoType,
    cargoValue?: number,
    distance?: number,
    cityId?: string
  ) => {
    // Basic calculation for now - we'll implement the real logic later
    let baseFreight = 0;
    
    // Find the client
    const client = { id: clientId, priceTableId: 'default-price-table' } as Client;
    
    // Basic calculation
    baseFreight = calculateFreightForClient(client, weight, deliveryType);
    
    // Add insurance if cargo value is provided
    if (cargoValue && cargoValue > 0) {
      baseFreight += calculateInsurance(client, cargoValue);
    }
    
    return baseFreight;
  };
  
  return {
    calculateFreightForClient,
    calculateInsurance,
    calculateFreight
  };
};
