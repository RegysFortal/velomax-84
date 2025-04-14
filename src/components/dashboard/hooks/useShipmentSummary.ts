
import { useState, useEffect } from 'react';
import { useShipments } from '@/contexts/shipments';

interface ShipmentSummary {
  inTransitShipments: number;
  retainedShipments: number;
  deliveredShipments: number;
  partiallyDeliveredShipments: number;
  finalDeliveredShipments: number;
  totalShipments: number;
}

export function useShipmentSummary(startDate: string, endDate: string) {
  const { shipments, loading } = useShipments();
  const [summary, setSummary] = useState<ShipmentSummary>({
    inTransitShipments: 0,
    retainedShipments: 0,
    deliveredShipments: 0,
    partiallyDeliveredShipments: 0,
    finalDeliveredShipments: 0,
    totalShipments: 0
  });
  
  const calculateSummary = () => {
    // Filter shipments by date range
    const filteredShipments = shipments.filter(shipment => {
      if (!shipment.arrivalDate) return false;
      
      const shipmentDate = new Date(shipment.arrivalDate);
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      
      return shipmentDate >= start && shipmentDate <= end;
    });
    
    // Count shipments by status
    const inTransitShipments = filteredShipments.filter(s => s.status === 'in_transit').length;
    const retainedShipments = filteredShipments.filter(s => s.status === 'retained').length;
    const deliveredShipments = filteredShipments.filter(s => s.status === 'delivered').length;
    const partiallyDeliveredShipments = filteredShipments.filter(s => s.status === 'partially_delivered').length;
    const finalDeliveredShipments = filteredShipments.filter(s => s.status === 'delivered_final').length;
    
    setSummary({
      inTransitShipments,
      retainedShipments,
      deliveredShipments,
      partiallyDeliveredShipments,
      finalDeliveredShipments,
      totalShipments: filteredShipments.length
    });
  };
  
  // Update summary when dependencies change
  useEffect(() => {
    if (!loading) {
      calculateSummary();
    }
  }, [shipments, startDate, endDate, loading]);
  
  // Set up event listener for shipment updates
  useEffect(() => {
    const handleShipmentsUpdated = () => {
      console.log("Shipment summary: Shipments updated event received");
      calculateSummary();
    };
    
    window.addEventListener('shipments-updated', handleShipmentsUpdated);
    
    return () => {
      window.removeEventListener('shipments-updated', handleShipmentsUpdated);
    };
  }, []);
  
  return {
    ...summary,
    loading
  };
}
