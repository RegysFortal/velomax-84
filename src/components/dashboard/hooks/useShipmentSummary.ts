
import { useState, useEffect } from 'react';
import { useShipments } from '@/contexts/shipments';
import { Shipment } from '@/types/shipment';

interface ShipmentSummary {
  totalShipments: number;
  inTransitShipments: number;
  atCarrierShipments: number;
  retainedShipments: number;
  deliveredShipments: number;
  partiallyDeliveredShipments: number;
  finalDeliveredShipments: number;
  loading: boolean;
}

export function useShipmentSummary(startDate: string, endDate: string) {
  const { shipments } = useShipments();
  const [summary, setSummary] = useState<ShipmentSummary>({
    totalShipments: 0,
    inTransitShipments: 0,
    atCarrierShipments: 0,
    retainedShipments: 0,
    deliveredShipments: 0,
    partiallyDeliveredShipments: 0,
    finalDeliveredShipments: 0,
    loading: true
  });

  // Function to filter shipments by date range
  const filterShipmentsByDateRange = (shipments: Shipment[], start: string, end: string) => {
    // If no dates provided, return all shipments
    if (!start || !end) return shipments;
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999); // Include the full end date
    
    return shipments.filter(shipment => {
      const createdAt = new Date(shipment.createdAt);
      return createdAt >= startDate && createdAt <= endDate;
    });
  };

  // Calculate summary data whenever shipments, startDate, or endDate change
  useEffect(() => {
    // Set loading true at the beginning of the calculation
    setSummary(prev => ({ ...prev, loading: true }));
    
    // Filter shipments by date range
    const filteredShipments = filterShipmentsByDateRange(shipments, startDate, endDate);
    
    // Calculate summary data
    const summaryData = {
      totalShipments: filteredShipments.length,
      inTransitShipments: filteredShipments.filter(s => s.status === 'in_transit').length,
      atCarrierShipments: filteredShipments.filter(s => s.status === 'at_carrier').length,
      retainedShipments: filteredShipments.filter(s => s.status === 'retained').length,
      deliveredShipments: filteredShipments.filter(s => s.status === 'delivered').length,
      partiallyDeliveredShipments: filteredShipments.filter(s => s.status === 'partially_delivered').length,
      finalDeliveredShipments: filteredShipments.filter(s => s.status === 'delivered_final').length,
      loading: false
    };
    
    // Update state with the new summary data
    setSummary(summaryData);
  }, [shipments, startDate, endDate]);

  // Listen for shipments-updated events
  useEffect(() => {
    const handleShipmentsUpdated = () => {
      setSummary(prev => ({ ...prev, loading: true }));
    };
    
    window.addEventListener('shipments-updated', handleShipmentsUpdated);
    
    return () => {
      window.removeEventListener('shipments-updated', handleShipmentsUpdated);
    };
  }, []);

  return summary;
}
