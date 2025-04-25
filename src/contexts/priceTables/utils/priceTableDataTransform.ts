
import { PriceTable } from '@/types';

export const parseJsonField = (field: any) => {
  if (typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch (e) {
      console.error('Error parsing JSON field:', e);
      return field;
    }
  }
  return field;
};

export const transformDatabaseResponse = (data: any): PriceTable => {
  const minimumRate = parseJsonField(data.minimum_rate) || {
    standardDelivery: 0,
    emergencyCollection: 0,
    saturdayCollection: 0,
    exclusiveVehicle: 0,
    scheduledDifficultAccess: 0,
    metropolitanRegion: 0,
    sundayHoliday: 0,
    normalBiological: 0,
    infectiousBiological: 0,
    trackedVehicle: 0,
    doorToDoorInterior: 0,
    reshipment: 0,
    customServices: [],
  };
  
  const excessWeight = parseJsonField(data.excess_weight) || {
    minPerKg: 0,
    maxPerKg: 0,
    biologicalPerKg: 0,
    reshipmentPerKg: 0,
  };
  
  const doorToDoor = parseJsonField(data.door_to_door) || {
    ratePerKm: 0,
    maxWeight: 0,
  };
  
  const waitingHour = parseJsonField(data.waiting_hour) || {
    standard: 0,
    exclusive: 0,
    fiorino: 0,
    medium: 0,
    large: 0,
  };
  
  const insurance = parseJsonField(data.insurance) || {
    rate: 0.01,
    standard: 0.01,
  };
  
  let parsedMetropolitanCities: string[] = [];
  try {
    if (data.metropolitan_cities) {
      const metroData = parseJsonField(data.metropolitan_cities);
      if (Array.isArray(metroData)) {
        parsedMetropolitanCities = metroData;
      } else if (metroData && typeof metroData === 'object') {
        // Handle cityIds array
        const cityIds = Array.isArray(metroData.cityIds) ? metroData.cityIds : [];
        
        // Handle customNames array and transform to temp IDs
        const customCityIds = Array.isArray(metroData.customNames) 
          ? metroData.customNames.map((name: string) => `temp-${name}`)
          : [];
          
        parsedMetropolitanCities = [...cityIds, ...customCityIds];
      }
    }
  } catch (e) {
    console.error("Error parsing metropolitan cities:", e);
    parsedMetropolitanCities = [];
  }

  // Add flat rate structure properties
  const multiplier = data.multiplier || 1;
  
  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    multiplier: multiplier,
    minimumRate,
    excessWeight,
    doorToDoor,
    waitingHour,
    insurance,
    metropolitanCities: parsedMetropolitanCities,
    allowCustomPricing: data.allow_custom_pricing,
    defaultDiscount: data.default_discount || 0,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    
    // Add flat rate structure with defaults from the nested structure
    fortalezaNormalMinRate: data.fortalezaNormalMinRate || minimumRate.standardDelivery || 0,
    fortalezaNormalExcessRate: data.fortalezaNormalExcessRate || excessWeight.minPerKg || 0,
    fortalezaEmergencyMinRate: data.fortalezaEmergencyMinRate || minimumRate.emergencyCollection || 0,
    fortalezaEmergencyExcessRate: data.fortalezaEmergencyExcessRate || excessWeight.maxPerKg || 0,
    fortalezaSaturdayMinRate: data.fortalezaSaturdayMinRate || minimumRate.saturdayCollection || 0,
    fortalezaSaturdayExcessRate: data.fortalezaSaturdayExcessRate || excessWeight.maxPerKg || 0,
    fortalezaExclusiveMinRate: data.fortalezaExclusiveMinRate || minimumRate.exclusiveVehicle || 0,
    fortalezaExclusiveExcessRate: data.fortalezaExclusiveExcessRate || excessWeight.maxPerKg || 0,
    fortalezaScheduledMinRate: data.fortalezaScheduledMinRate || minimumRate.scheduledDifficultAccess || 0,
    fortalezaScheduledExcessRate: data.fortalezaScheduledExcessRate || excessWeight.maxPerKg || 0,
    metropolitanMinRate: data.metropolitanMinRate || minimumRate.metropolitanRegion || 0,
    metropolitanExcessRate: data.metropolitanExcessRate || excessWeight.maxPerKg || 0,
    fortalezaHolidayMinRate: data.fortalezaHolidayMinRate || minimumRate.sundayHoliday || 0,
    fortalezaHolidayExcessRate: data.fortalezaHolidayExcessRate || excessWeight.maxPerKg || 0,
    biologicalNormalMinRate: data.biologicalNormalMinRate || minimumRate.normalBiological || 0,
    biologicalNormalExcessRate: data.biologicalNormalExcessRate || excessWeight.biologicalPerKg || 0,
    biologicalInfectiousMinRate: data.biologicalInfectiousMinRate || minimumRate.infectiousBiological || 0,
    biologicalInfectiousExcessRate: data.biologicalInfectiousExcessRate || excessWeight.biologicalPerKg || 0,
    trackedVehicleMinRate: data.trackedVehicleMinRate || minimumRate.trackedVehicle || 0,
    trackedVehicleExcessRate: data.trackedVehicleExcessRate || excessWeight.maxPerKg || 0,
    reshipmentMinRate: data.reshipmentMinRate || minimumRate.reshipment || 0,
    reshipmentExcessRate: data.reshipmentExcessRate || excessWeight.reshipmentPerKg || 0,
    reshipmentInvoicePercentage: data.reshipmentInvoicePercentage || 0.01,
    interiorExclusiveMinRate: data.interiorExclusiveMinRate || minimumRate.doorToDoorInterior || 0,
    interiorExclusiveExcessRate: data.interiorExclusiveExcessRate || excessWeight.maxPerKg || 0,
    interiorExclusiveKmRate: data.interiorExclusiveKmRate || doorToDoor.ratePerKm || 0,
  };
};

export const preparePriceTableForDatabase = (priceTable: any) => {
  // Validate and ensure metropolitanCities is an array
  const metropolitanCities = Array.isArray(priceTable.metropolitanCities) 
    ? priceTable.metropolitanCities.filter(cityId => cityId && typeof cityId === 'string')
    : [];
  
  // Separate regular city IDs from temp (custom) city IDs
  const validCityIds = metropolitanCities.filter(id => !id.startsWith('temp-'));
  
  // Extract custom city names from temp IDs
  const customCityNames = metropolitanCities
    .filter(id => id.startsWith('temp-'))
    .map(id => id.replace('temp-', ''));

  return {
    name: priceTable.name,
    description: priceTable.description,
    minimum_rate: JSON.stringify(priceTable.minimumRate),
    excess_weight: JSON.stringify(priceTable.excessWeight),
    door_to_door: JSON.stringify(priceTable.doorToDoor),
    waiting_hour: JSON.stringify(priceTable.waitingHour),
    insurance: JSON.stringify(priceTable.insurance),
    metropolitan_cities: JSON.stringify({
      cityIds: validCityIds,
      customNames: customCityNames
    }),
    allow_custom_pricing: priceTable.allowCustomPricing,
    default_discount: priceTable.defaultDiscount || 0,
    user_id: priceTable.userId
  };
};
