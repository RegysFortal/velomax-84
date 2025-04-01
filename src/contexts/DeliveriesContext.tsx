
// Add this to the top of the file to replace the calculateFreight function

const calculateFreight = (
  clientId: string,
  weight: number,
  deliveryType: Delivery['deliveryType'],
  cargoType: Delivery['cargoType'],
  cargoValue: number = 0,
  _distance?: number, // Now unused but kept for compatibility
  cityId?: string
): number => {
  try {
    const client = clients.find(c => c.id === clientId);
    if (!client) return 0;
    
    const priceTable = priceTables.find(pt => pt.id === client.priceTableId);
    if (!priceTable) return 0;
    
    let baseRate = 0;
    let excessWeightRate = 0;
    let totalFreight = 0;
    let weightLimit = 10; // Default weight limit
    
    // Set base rate and excess weight rate based on delivery type
    switch (deliveryType) {
      case 'standard':
        baseRate = priceTable.minimumRate.standardDelivery;
        excessWeightRate = priceTable.excessWeight.minPerKg;
        break;
      case 'emergency':
        baseRate = priceTable.minimumRate.emergencyCollection;
        excessWeightRate = priceTable.excessWeight.maxPerKg;
        break;
      case 'saturday':
        baseRate = priceTable.minimumRate.saturdayCollection;
        excessWeightRate = priceTable.excessWeight.maxPerKg;
        break;
      case 'exclusive':
        baseRate = priceTable.minimumRate.exclusiveVehicle;
        excessWeightRate = priceTable.excessWeight.maxPerKg;
        break;
      case 'difficultAccess':
        baseRate = priceTable.minimumRate.scheduledDifficultAccess;
        excessWeightRate = priceTable.excessWeight.maxPerKg;
        break;
      case 'metropolitanRegion':
        baseRate = priceTable.minimumRate.metropolitanRegion;
        excessWeightRate = priceTable.excessWeight.maxPerKg;
        break;
      case 'sundayHoliday':
        baseRate = priceTable.minimumRate.sundayHoliday;
        excessWeightRate = priceTable.excessWeight.maxPerKg;
        break;
      case 'normalBiological':
        baseRate = priceTable.minimumRate.normalBiological;
        excessWeightRate = priceTable.excessWeight.biologicalPerKg;
        break;
      case 'infectiousBiological':
        baseRate = priceTable.minimumRate.infectiousBiological;
        excessWeightRate = priceTable.excessWeight.biologicalPerKg;
        break;
      case 'tracked':
        baseRate = priceTable.minimumRate.trackedVehicle;
        excessWeightRate = priceTable.excessWeight.maxPerKg;
        weightLimit = 100; // Higher weight limit for tracked vehicles
        break;
      case 'doorToDoorInterior':
        baseRate = priceTable.minimumRate.doorToDoorInterior;
        excessWeightRate = priceTable.excessWeight.maxPerKg;
        weightLimit = 100; // Higher weight limit for door to door interior
        
        // Additional calculation for door-to-door if city is provided
        if (cityId) {
          const city = cities.find(c => c.id === cityId);
          if (city) {
            // For door-to-door, we use the city's distance but don't display it in the UI
            const distance = city.distance;
            // Add distance-based charge
            totalFreight += distance * priceTable.doorToDoor.ratePerKm;
          }
        }
        break;
      case 'reshipment':
        baseRate = priceTable.minimumRate.reshipment;
        excessWeightRate = priceTable.excessWeight.reshipmentPerKg;
        break;
    }
    
    // Calculate freight based on weight
    if (weight <= weightLimit) {
      totalFreight += baseRate;
    } else {
      const excessWeight = weight - weightLimit;
      totalFreight += baseRate + (excessWeight * excessWeightRate);
    }
    
    // Apply cargo type multiplier if cargo is perishable
    if (cargoType === 'perishable') {
      totalFreight *= 1.2; // 20% extra for perishable cargo
    }
    
    return Math.max(totalFreight, 0);
  } catch (error) {
    console.error('Error calculating freight:', error);
    return 0;
  }
};
