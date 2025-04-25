
import { PriceTable, PriceTableFormData } from '@/types';

export interface PriceTableInput {
  // Core fields
  name: string;
  description?: string;
  multiplier: number;
  
  // Nested structure
  minimumRate: {
    standardDelivery: number;
    emergencyCollection: number;
    saturdayCollection: number;
    exclusiveVehicle: number;
    scheduledDifficultAccess: number;
    metropolitanRegion: number;
    sundayHoliday: number;
    normalBiological: number;
    infectiousBiological: number;
    trackedVehicle: number;
    doorToDoorInterior: number;
    reshipment: number;
    customServices: any[];
  };
  excessWeight: {
    minPerKg: number;
    maxPerKg: number;
    biologicalPerKg: number;
    reshipmentPerKg: number;
  };
  doorToDoor?: {
    ratePerKm: number;
    maxWeight: number;
  };
  waitingHour?: {
    standard: number;
    exclusive: number;
    fiorino: number;
    medium: number;
    large: number;
  };
  insurance?: {
    rate: number;
    standard: number;
    perishable?: number;
  };

  // Additional configurations
  allowCustomPricing?: boolean;
  defaultDiscount?: number;
  metropolitanCities?: string[];
  
  // Flat structure (optional properties)
  fortalezaNormalMinRate?: number;
  fortalezaNormalExcessRate?: number;
  fortalezaEmergencyMinRate?: number;
  fortalezaEmergencyExcessRate?: number;
  fortalezaSaturdayMinRate?: number;
  fortalezaSaturdayExcessRate?: number;
  fortalezaExclusiveMinRate?: number;
  fortalezaExclusiveExcessRate?: number;
  fortalezaScheduledMinRate?: number;
  fortalezaScheduledExcessRate?: number;
  metropolitanMinRate?: number;
  metropolitanExcessRate?: number;
  fortalezaHolidayMinRate?: number;
  fortalezaHolidayExcessRate?: number;
  biologicalNormalMinRate?: number;
  biologicalNormalExcessRate?: number;
  biologicalInfectiousMinRate?: number;
  biologicalInfectiousExcessRate?: number;
  trackedVehicleMinRate?: number;
  trackedVehicleExcessRate?: number;
  reshipmentMinRate?: number;
  reshipmentExcessRate?: number;
  reshipmentInvoicePercentage?: number;
  interiorExclusiveMinRate?: number;
  interiorExclusiveExcessRate?: number;
  interiorExclusiveKmRate?: number;
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
