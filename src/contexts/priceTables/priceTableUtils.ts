
import { PriceTable } from '@/types';

export const getPriceTable = (priceTables: PriceTable[], id: string): PriceTable | undefined => {
  return priceTables.find(table => table.id === id);
};

export const calculateInsurance = (
  priceTables: PriceTable[], 
  priceTableId: string, 
  invoiceValue: number,
  isReshipment: boolean = false,
  cargoType: 'standard' | 'perishable' = 'standard'
): number => {
  // Find the price table
  const priceTable = getPriceTable(priceTables, priceTableId);
  
  if (!priceTable || !invoiceValue) {
    return 0;
  }
  
  // Determine the insurance rate
  let rate = 0;
  
  if (priceTable.insurance) {
    if (cargoType === 'perishable' && priceTable.insurance.perishable) {
      rate = priceTable.insurance.perishable;
    } else {
      rate = priceTable.insurance.standard || priceTable.insurance.rate || 0.01;
    }
  } else if (priceTable.reshipmentInvoicePercentage && isReshipment) {
    rate = priceTable.reshipmentInvoicePercentage;
  } else {
    // Default rate
    rate = 0.01;
  }
  
  return invoiceValue * rate;
};
