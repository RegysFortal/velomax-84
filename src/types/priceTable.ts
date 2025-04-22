


export interface PriceTable {
  id: string;
  name: string;
  description?: string;
  allowCustomPricing: boolean;
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
    customServices: CustomService[]; // Required, not optional
  };
  excessWeight: {
    minPerKg: number;
    maxPerKg: number;
    biologicalPerKg: number;
    reshipmentPerKg: number;
  };
  doorToDoor: {
    ratePerKm: number;
    maxWeight?: number; // Keep as optional since it's used that way
  };
  waitingHour: {
    standard: number;
    exclusive: number;
    fiorino?: number; // Make optional to match actual usage
    medium?: number;  // Make optional to match actual usage
    large?: number;   // Make optional to match actual usage
  };
  insurance: {
    rate: number;
    standard?: number; // Make optional to match actual usage
    perishable?: number;
  };
  metropolitanCities: string[]; // Required as per previous edits
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

