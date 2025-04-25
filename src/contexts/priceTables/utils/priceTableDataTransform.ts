
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

  // Parse weight limits if available
  const weightLimits = parseJsonField(data.weight_limits) || {
    standardDelivery: 10,
    emergencyCollection: 10,
    saturdayCollection: 10,
    exclusiveVehicle: 10,
    scheduledDifficultAccess: 10,
    metropolitanRegion: 10,
    sundayHoliday: 10,
    normalBiological: 10,
    infectiousBiological: 10,
    trackedVehicle: 100,
    doorToDoorInterior: 10,
    reshipment: 10,
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
    weightLimits,
    metropolitanCities: parsedMetropolitanCities,
    allowCustomPricing: data.allow_custom_pricing,
    defaultDiscount: data.default_discount || 0,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    
    // Add flat rate structure with defaults from the nested structure
    fortalezaNormalMinRate: data.fortaleza_normal_min_rate || minimumRate.standardDelivery || 0,
    fortalezaNormalExcessRate: data.fortaleza_normal_excess_rate || excessWeight.minPerKg || 0,
    fortalezaEmergencyMinRate: data.fortaleza_emergency_min_rate || minimumRate.emergencyCollection || 0,
    fortalezaEmergencyExcessRate: data.fortaleza_emergency_excess_rate || excessWeight.maxPerKg || 0,
    fortalezaSaturdayMinRate: data.fortaleza_saturday_min_rate || minimumRate.saturdayCollection || 0,
    fortalezaSaturdayExcessRate: data.fortaleza_saturday_excess_rate || excessWeight.maxPerKg || 0,
    fortalezaExclusiveMinRate: data.fortaleza_exclusive_min_rate || minimumRate.exclusiveVehicle || 0,
    fortalezaExclusiveExcessRate: data.fortaleza_exclusive_excess_rate || excessWeight.maxPerKg || 0,
    fortalezaScheduledMinRate: data.fortaleza_scheduled_min_rate || minimumRate.scheduledDifficultAccess || 0,
    fortalezaScheduledExcessRate: data.fortaleza_scheduled_excess_rate || excessWeight.maxPerKg || 0,
    metropolitanMinRate: data.metropolitan_min_rate || minimumRate.metropolitanRegion || 0,
    metropolitanExcessRate: data.metropolitan_excess_rate || excessWeight.maxPerKg || 0,
    fortalezaHolidayMinRate: data.fortaleza_holiday_min_rate || minimumRate.sundayHoliday || 0,
    fortalezaHolidayExcessRate: data.fortaleza_holiday_excess_rate || excessWeight.maxPerKg || 0,
    biologicalNormalMinRate: data.biological_normal_min_rate || minimumRate.normalBiological || 0,
    biologicalNormalExcessRate: data.biological_normal_excess_rate || excessWeight.biologicalPerKg || 0,
    biologicalInfectiousMinRate: data.biological_infectious_min_rate || minimumRate.infectiousBiological || 0,
    biologicalInfectiousExcessRate: data.biological_infectious_excess_rate || excessWeight.biologicalPerKg || 0,
    trackedVehicleMinRate: data.tracked_vehicle_min_rate || minimumRate.trackedVehicle || 0,
    trackedVehicleExcessRate: data.tracked_vehicle_excess_rate || excessWeight.maxPerKg || 0,
    reshipmentMinRate: data.reshipment_min_rate || minimumRate.reshipment || 0,
    reshipmentExcessRate: data.reshipment_excess_rate || excessWeight.reshipmentPerKg || 0,
    reshipmentInvoicePercentage: data.reshipment_invoice_percentage || 0.01,
    interiorExclusiveMinRate: data.interior_exclusive_min_rate || minimumRate.doorToDoorInterior || 0,
    interiorExclusiveExcessRate: data.interior_exclusive_excess_rate || excessWeight.maxPerKg || 0,
    interiorExclusiveKmRate: data.interior_exclusive_km_rate || doorToDoor.ratePerKm || 0,
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

  // Prepare weight limits data
  const weightLimits = priceTable.weightLimits || {
    standardDelivery: 10,
    emergencyCollection: 10,
    saturdayCollection: 10,
    exclusiveVehicle: 10,
    scheduledDifficultAccess: 10,
    metropolitanRegion: 10,
    sundayHoliday: 10,
    normalBiological: 10,
    infectiousBiological: 10,
    trackedVehicle: 100,
    doorToDoorInterior: 10,
    reshipment: 10,
  };

  return {
    name: priceTable.name,
    description: priceTable.description,
    minimum_rate: JSON.stringify(priceTable.minimumRate),
    excess_weight: JSON.stringify(priceTable.excessWeight),
    door_to_door: JSON.stringify(priceTable.doorToDoor),
    waiting_hour: JSON.stringify(priceTable.waitingHour),
    insurance: JSON.stringify(priceTable.insurance),
    weight_limits: JSON.stringify(weightLimits),
    metropolitan_cities: JSON.stringify({
      cityIds: validCityIds,
      customNames: customCityNames
    }),
    allow_custom_pricing: priceTable.allowCustomPricing,
    default_discount: priceTable.defaultDiscount || 0,
    user_id: priceTable.userId
  };
};
