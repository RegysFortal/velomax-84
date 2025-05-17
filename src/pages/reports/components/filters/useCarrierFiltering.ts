
import { useState, useEffect } from 'react';

export function useCarrierFiltering(filterMode: 'air' | 'road' | 'all', filterCarrier: string, uniqueCarriers: string[], onCarrierChange: (value: string) => void) {
  // List of carriers filtered by transport mode
  const [filteredCarriers, setFilteredCarriers] = useState<string[]>([]);
  
  // Available carriers by transport mode
  const airCarriers = ["Azul", "Gol", "Latam"];
  const roadCarriers = ["Concept", "Global", "Jeam", "Outro"];
  
  // Update carriers when transport mode changes
  useEffect(() => {
    if (filterMode === 'air') {
      setFilteredCarriers(airCarriers);
      // If the current carrier is not an air carrier, reset to 'all'
      if (!airCarriers.includes(filterCarrier) && filterCarrier !== 'all') {
        onCarrierChange('all');
      }
    } else if (filterMode === 'road') {
      setFilteredCarriers(roadCarriers);
      // If the current carrier is not a road carrier, reset to 'all'
      if (!roadCarriers.includes(filterCarrier) && filterCarrier !== 'all') {
        onCarrierChange('all');
      }
    } else {
      // Mode 'all': show all available carriers
      setFilteredCarriers([...new Set([...airCarriers, ...roadCarriers, ...uniqueCarriers])]);
    }
  }, [filterMode, filterCarrier, uniqueCarriers, onCarrierChange]);
  
  return { filteredCarriers };
}
