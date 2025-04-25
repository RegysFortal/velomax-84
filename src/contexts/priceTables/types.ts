
import { PriceTable, PriceTableFormData } from '@/types';

export interface PriceTableInput extends Omit<PriceTableFormData, 'id' | 'createdAt' | 'updatedAt'> {
  // The PriceTableInput must include all required fields from PriceTableFormData
  // except for id, createdAt, and updatedAt which are managed by the backend
}

export interface PriceTablesContextType {
  priceTables: PriceTable[];
  addPriceTable: (priceTable: PriceTableInput) => Promise<void>;
  updatePriceTable: (id: string, priceTable: Partial<PriceTable>) => Promise<void>;
  deletePriceTable: (id: string) => Promise<void>;
  getPriceTable: (id: string) => PriceTable | undefined;
  calculateInsurance: (priceTableId: string, invoiceValue: number, isReshipment: boolean, cargoType: 'standard' | 'perishable') => number;
  loading: boolean;
}
