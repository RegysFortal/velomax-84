
import { Shipment, ShipmentStatus } from "@/types/shipment";

export const useShipmentFilters = (shipments: Shipment[]) => {
  const getShipmentsByStatus = (status: ShipmentStatus) => {
    return shipments.filter(s => s.status === status);
  };
  
  const getShipmentsByCarrier = (carrierName: string) => {
    return shipments.filter(s => 
      s.carrierName.toLowerCase().includes(carrierName.toLowerCase())
    );
  };
  
  const getShipmentsByDateRange = (startDate: string, endDate: string) => {
    return shipments.filter(s => {
      if (!s.arrivalDate) return false;
      return s.arrivalDate >= startDate && s.arrivalDate <= endDate;
    });
  };
  
  const getShipmentsByCompany = (companyId: string) => {
    return shipments.filter(s => s.companyId === companyId);
  };
  
  const getRetainedShipments = () => {
    return shipments.filter(s => s.isRetained);
  };
  
  const getUndeliveredShipments = () => {
    return shipments.filter(s => s.status !== "delivered");
  };
  
  return {
    getShipmentsByStatus,
    getShipmentsByCarrier,
    getShipmentsByDateRange,
    getShipmentsByCompany,
    getRetainedShipments,
    getUndeliveredShipments
  };
};
