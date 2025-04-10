
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
