
export interface PriceTable {
  id: string;
  name: string;
  description?: string;
  allowCustomPricing?: boolean;
  defaultDiscount?: number;
  multiplier?: number; // Add the missing multiplier property
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
  };
  excessWeight: {
    minPerKg: number;
    maxPerKg: number;
    biologicalPerKg: number;
    reshipmentPerKg: number;
  };
  doorToDoor: {
    ratePerKm: number;
    maxWeight?: number; // Add the missing property
  };
  waitingHour: {
    standard: number;
    exclusive: number;
    fiorino?: number; // Add the missing properties
    medium?: number;
    large?: number;
  };
  insurance: {
    rate: number;
    standard?: number; // Add the missing properties
    perishable?: number;
  };
  createdAt: string;
  updatedAt: string;
  userId?: string;
}
