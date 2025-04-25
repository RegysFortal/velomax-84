
import { PriceTable, PriceTableFormData } from '@/types';

export interface PriceTableInput extends Omit<PriceTableFormData, 'id' | 'createdAt' | 'updatedAt'> {}

export interface PriceTablesContextType {
  priceTables: PriceTable[];
  addPriceTable: (priceTable: PriceTableInput) => Promise<void>;
  updatePriceTable: (id: string, priceTable: Partial<PriceTable>) => Promise<void>;
  deletePriceTable: (id: string) => Promise<void>;
  getPriceTable: (id: string) => PriceTable | undefined;
  calculateInsurance: (priceTableId: string, invoiceValue: number, isReshipment: boolean, cargoType: 'standard' | 'perishable') => number;
  loading: boolean;
}
