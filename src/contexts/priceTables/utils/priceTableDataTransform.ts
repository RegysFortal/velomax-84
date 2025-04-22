
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
  const minimumRate = parseJsonField(data.minimum_rate);
  const excessWeight = parseJsonField(data.excess_weight);
  const doorToDoor = parseJsonField(data.door_to_door);
  const waitingHour = parseJsonField(data.waiting_hour);
  const insurance = parseJsonField(data.insurance);
  
  let parsedMetropolitanCities: string[] = [];
  try {
    if (data.metropolitan_cities) {
      let metroData = parseJsonField(data.metropolitan_cities);
      if (Array.isArray(metroData)) {
        parsedMetropolitanCities = metroData;
      } else if (metroData.cityIds && metroData.customNames) {
        const tempCityIds = metroData.customNames.map((name: string) => 
          `temp-${name}`
        );
        parsedMetropolitanCities = [...metroData.cityIds, ...tempCityIds];
      }
    }
  } catch (e) {
    console.error("Error parsing metropolitan cities:", e);
    parsedMetropolitanCities = [];
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
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
  };
};

export const preparePriceTableForDatabase = (priceTable: any) => {
  const metropolitanCities = Array.isArray(priceTable.metropolitanCities) 
    ? priceTable.metropolitanCities.filter(cityId => cityId && typeof cityId === 'string')
    : [];
  
  const validCityIds = metropolitanCities.filter(id => !id.startsWith('temp-'));
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
