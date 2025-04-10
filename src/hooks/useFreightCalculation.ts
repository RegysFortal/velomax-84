import { usePriceTables } from '@/contexts/PriceTablesContext';
import { Client } from '@/types';

export const useFreightCalculation = () => {
  const { priceTables } = usePriceTables();
  
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
  
  return {
    calculateFreightForClient,
    calculateInsurance
  };
};
