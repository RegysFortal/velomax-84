
export interface PriceTable {
  id: string;
  name: string;
  description?: string;
  allowCustomPricing?: boolean;
  defaultDiscount?: number;
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
  };
  waitingHour: {
    standard: number;
    exclusive: number;
  };
  insurance: {
    rate: number;
  };
  createdAt: string;
  updatedAt: string;
  userId?: string;
}
