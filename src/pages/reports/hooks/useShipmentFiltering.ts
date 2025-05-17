
import { useState, useEffect } from 'react';
import { Shipment, ShipmentStatus } from '@/types';

export const useShipmentFiltering = (
  shipments: Shipment[],
  startDate: string,
  endDate: string,
  filterStatus: ShipmentStatus | 'all',
  filterCarrier: string,
  filterMode: 'air' | 'road' | 'all'
) => {
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  
  // Apply filters whenever any filter or shipments change
  useEffect(() => {
    // Debug logging to check filters
    console.log(`Filtering with: startDate=${startDate}, endDate=${endDate}, status=${filterStatus}, carrier=${filterCarrier}, mode=${filterMode}`);
    console.log(`Number of shipments before filtering: ${shipments.length}`);
    
    const filtered = shipments.filter(shipment => {
      // Validate that dates are valid before comparing
      let startDateObj = new Date(startDate);
      let endDateObj = new Date(endDate);
      
      // Configure endDateObj to end of day
      endDateObj.setHours(23, 59, 59, 999);
      
      const shipmentDate = shipment.arrivalDate ? new Date(shipment.arrivalDate) : null;
      
      // If there's no arrival date, include the shipment anyway
      const matchesDateRange = !shipmentDate || 
        (shipmentDate >= startDateObj && 
         shipmentDate <= endDateObj);
      
      const matchesStatus = filterStatus === 'all' || shipment.status === filterStatus;
      
      const matchesCarrier = filterCarrier === 'all' || 
        (shipment.carrierName && shipment.carrierName.toLowerCase() === filterCarrier.toLowerCase());
        
      const matchesMode = filterMode === 'all' || shipment.transportMode === filterMode;
      
      const isMatched = matchesDateRange && matchesStatus && matchesCarrier && matchesMode;
      
      // Debug which filters are failing
      if (!isMatched) {
        console.log(`Shipment ${shipment.trackingNumber} filtered out: ` +
          `dateRange: ${matchesDateRange}, ` + 
          `status: ${matchesStatus}, ` + 
          `carrier: ${matchesCarrier}, ` + 
          `mode: ${matchesMode}`);
      }
      
      return isMatched;
    });
    
    console.log(`Filtered shipments count: ${filtered.length}`);
    setFilteredShipments(filtered);
  }, [shipments, startDate, endDate, filterStatus, filterCarrier, filterMode]);

  return { filteredShipments };
};
