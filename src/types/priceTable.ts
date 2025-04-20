
export interface PriceTable {
  id: string;
  name: string;
  description?: string;
  allowCustomPricing?: boolean;
  defaultDiscount?: number;
  multiplier?: number;
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
    customServices?: CustomService[];
  };
  excessWeight: {
    minPerKg: number;
    maxPerKg: number;
    biologicalPerKg: number;
    reshipmentPerKg: number;
  };
  doorToDoor: {
    ratePerKm: number;
    maxWeight?: number;
  };
  waitingHour: {
    standard: number;
    exclusive: number;
    fiorino?: number;
    medium?: number;
    large?: number;
  };
  insurance: {
    rate: number;
    standard?: number;
    perishable?: number;
  };
  metropolitanCities?: string[]; // IDs das cidades que são metropolitanas
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

export interface CustomService {
  id: string;
  name: string;
  minWeight: number;
  baseRate: number;
  excessRate: number;
  additionalInfo?: string;
}
