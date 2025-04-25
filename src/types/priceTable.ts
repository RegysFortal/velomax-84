
export interface CustomService {
  id: string;
  name: string;
  minWeight: number;
  baseRate: number;
  excessRate: number;
  additionalInfo?: string;
}

export interface PriceTable {
  id?: string;
  name: string;
  description?: string;
  multiplier: number;
  
  // Original flat rates structure - making these optional
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
  
  // New nested structure
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
    customServices: CustomService[];
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
  
  allowCustomPricing?: boolean;
  defaultDiscount?: number;
  metropolitanCities?: string[];
  
  createdAt?: string;
  updatedAt?: string;
}

export interface PriceTableFormData extends Omit<PriceTable, 'id' | 'createdAt' | 'updatedAt'> {
  metropolitanCityIds?: string[];
  customServices?: CustomService[];
}
