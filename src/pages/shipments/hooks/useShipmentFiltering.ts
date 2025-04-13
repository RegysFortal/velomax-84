
import { useMemo } from 'react';
import { Shipment, ShipmentStatus } from '@/types/shipment';

export function useShipmentFiltering(
  shipments: Shipment[],
  searchTerm: string,
  refreshTrigger: number
) {
  // Filter shipments - only exclude shipments with status 'delivered_final'
  const filteredShipments = useMemo(() => {
    return shipments.filter(shipment => {
      // Exclude shipments that have been delivered to the final recipient (status 'delivered_final')
      if (shipment.status === 'delivered_final') {
        return false;
      }
      
      // Apply search term to relevant fields
      const matchesSearch = 
        shipment.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.carrierName.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }, [shipments, searchTerm, refreshTrigger]);

  // Check if a shipment is overdue (arrival date is in past but not delivered)
  const isShipmentOverdue = (shipment: Shipment) => {
    if (!shipment.arrivalDate) return false;
    
    // Check if the arrival date is in the past and shipment is not delivered
    const arrivalDate = new Date(shipment.arrivalDate);
    const today = new Date();
    
    // Set both dates to start of day for fair comparison
    arrivalDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    return arrivalDate < today && 
           shipment.status !== 'delivered' && 
           shipment.status !== 'delivered_final' &&
           shipment.status !== 'partially_delivered';
  };

  return { filteredShipments, isShipmentOverdue };
}
