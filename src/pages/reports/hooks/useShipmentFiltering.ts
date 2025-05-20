
import { useState, useEffect } from 'react';
import { Shipment, ShipmentStatus } from '@/types/shipment';

export function useShipmentFiltering(
  shipments: Shipment[],
  startDate: string,
  endDate: string,
  filterStatus: ShipmentStatus | 'all',
  filterCarrier: string,
  filterMode: 'air' | 'road' | 'all'
) {
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  
  useEffect(() => {
    // Apply filters
    let filtered = [...shipments];
    
    // Filter by date range
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include the full end date
      
      filtered = filtered.filter(shipment => {
        const createdAt = new Date(shipment.createdAt);
        return createdAt >= start && createdAt <= end;
      });
    }
    
    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(shipment => shipment.status === filterStatus);
    }
    
    // Filter by carrier
    if (filterCarrier !== 'all') {
      filtered = filtered.filter(shipment => shipment.carrierName === filterCarrier);
    }
    
    // Filter by transport mode
    if (filterMode !== 'all') {
      filtered = filtered.filter(shipment => shipment.transportMode === filterMode);
    }
    
    setFilteredShipments(filtered);
  }, [shipments, startDate, endDate, filterStatus, filterCarrier, filterMode]);
  
  // Function to identify overdue shipments
  const isShipmentOverdue = (shipment: Shipment): boolean => {
    // For this example, we'll consider a shipment overdue if:
    // 1. It's "in_transit" or "at_carrier" AND
    // 2. Its arrival date is in the past
    if (['in_transit', 'at_carrier'].includes(shipment.status) && shipment.arrivalDate) {
      const arrivalDate = new Date(shipment.arrivalDate);
      const today = new Date();
      return arrivalDate < today;
    }
    return false;
  };
  
  return {
    filteredShipments,
    isShipmentOverdue
  };
}
