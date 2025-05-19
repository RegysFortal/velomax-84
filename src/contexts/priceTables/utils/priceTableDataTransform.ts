
import { PriceTable, PriceTableFormData } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const preparePriceTableForDatabase = (priceTable: any) => {
  const timestamp = new Date().toISOString();
  
  // Convert to Supabase format (snake_case)
  return {
    name: priceTable.name,
    description: priceTable.description,
    multiplier: priceTable.multiplier || 1,
    minimum_rate: priceTable.minimumRate,
    excess_weight: priceTable.excessWeight,
    door_to_door: priceTable.doorToDoor,
    waiting_hour: priceTable.waitingHour,
    insurance: priceTable.insurance,
    allow_custom_pricing: priceTable.allowCustomPricing !== undefined ? priceTable.allowCustomPricing : true,
    default_discount: priceTable.defaultDiscount || 0,
    metropolitan_cities: priceTable.metropolitanCities || [],
    created_at: priceTable.createdAt || timestamp,
    updated_at: priceTable.updatedAt || timestamp,
    user_id: priceTable.userId,
  };
};

export const transformDatabaseResponse = (data: any): PriceTable => {
  // Convert from Supabase format (snake_case) to camelCase
  const minimumRate = typeof data.minimum_rate === 'string'
    ? JSON.parse(data.minimum_rate)
    : data.minimum_rate || {};
    
  if (!minimumRate.customServices) {
    minimumRate.customServices = [];
  }
  
  const excessWeight = typeof data.excess_weight === 'string'
    ? JSON.parse(data.excess_weight)
    : data.excess_weight || {};
    
  const doorToDoor = typeof data.door_to_door === 'string'
    ? JSON.parse(data.door_to_door)
    : data.door_to_door || {};
    
  const waitingHour = typeof data.waiting_hour === 'string'
    ? JSON.parse(data.waiting_hour)
    : data.waiting_hour || {};
    
  const insurance = typeof data.insurance === 'string'
    ? JSON.parse(data.insurance)
    : data.insurance || {};
  
  // Ensure all nested objects have their required fields
  if (!waitingHour.standard) waitingHour.standard = 44.00;
  if (!waitingHour.exclusive) waitingHour.exclusive = 55.00;
  
  if (!insurance.standard) insurance.standard = 0.01;
  
  const metropolitanCities = data.metropolitan_cities 
    ? (typeof data.metropolitan_cities === 'string'
        ? JSON.parse(data.metropolitan_cities)
        : data.metropolitan_cities)
    : [];
  
  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    multiplier: data.multiplier || 1,
    minimumRate,
    excessWeight,
    doorToDoor,
    waitingHour,
    insurance,
    allowCustomPricing: data.allow_custom_pricing !== undefined ? data.allow_custom_pricing : true,
    defaultDiscount: data.default_discount || 0,
    metropolitanCities,
    createdAt: data.created_at || new Date().toISOString(),
    updatedAt: data.updated_at || new Date().toISOString(),
  };
};

export const createEmptyPriceTable = (): PriceTableFormData => {
  return {
    name: '',
    description: '',
    multiplier: 1,
    minimumRate: {
      standardDelivery: 36.00,
      emergencyCollection: 72.00,
      saturdayCollection: 72.00,
      exclusiveVehicle: 176.00,
      scheduledDifficultAccess: 154.00,
      metropolitanRegion: 165.00,
      sundayHoliday: 308.00,
      normalBiological: 72.00,
      infectiousBiological: 99.00,
      trackedVehicle: 440.00,
      doorToDoorInterior: 200.00,
      reshipment: 170.00,
      customServices: [],
    },
    excessWeight: {
      minPerKg: 0.55,
      maxPerKg: 0.65,
      biologicalPerKg: 0.72,
      reshipmentPerKg: 0.70,
    },
    doorToDoor: {
      ratePerKm: 2.40,
      maxWeight: 100,
    },
    waitingHour: {
      standard: 44.00,
      exclusive: 55.00,
      fiorino: 44.00,
      medium: 55.00,
      large: 66.00,
    },
    insurance: {
      rate: 0.01,
      standard: 0.01,
    },
    allowCustomPricing: true,
    defaultDiscount: 0,
    metropolitanCities: [],
    metropolitanCityIds: [],
    customServices: [],
  };
};
