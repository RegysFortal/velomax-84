
// Basic freight calculation function
export const calculateFreight = (
  freightType: "standard" | "perishable", 
  weight: number
): number => {
  // Base rates per freight type
  const baseRates = {
    standard: 15.00,  // Base rate for standard freight
    perishable: 25.00, // Base rate for perishable items
  };
  
  // Weight tiers (in kg)
  const weightTiers = [1, 3, 5, 10, 20, 30, 50, 100];
  
  // Multipliers for each weight tier
  const tierMultipliers = {
    standard: [1.0, 1.2, 1.5, 2.0, 2.5, 3.0, 4.0, 5.0],
    perishable: [1.2, 1.5, 1.8, 2.3, 2.8, 3.5, 4.5, 5.5],
  };
  
  // Find the appropriate weight tier
  let tierIndex = 0;
  for (let i = 0; i < weightTiers.length; i++) {
    if (weight <= weightTiers[i]) {
      tierIndex = i;
      break;
    }
    
    // If weight exceeds the last tier
    if (i === weightTiers.length - 1) {
      tierIndex = i;
    }
  }
  
  // Calculate freight based on type, base rate, and weight tier
  const baseRate = baseRates[freightType];
  const multiplier = tierMultipliers[freightType][tierIndex];
  
  return baseRate * multiplier;
};
