
import React, { ReactNode } from "react";
import { toast } from "sonner";
import { useAuth } from '@/contexts/auth/AuthContext';
import { ShipmentsContext } from "./ShipmentsContext";
import { useShipmentOperations } from "./useShipmentOperations";
import { useShipmentFilters } from "./useShipmentFilters";
import { useShipmentDocuments } from "./useShipmentDocuments";
import { useFiscalActions } from "./useFiscalActions";
import { useShipmentsData } from "./hooks/useShipmentsData";

interface ShipmentsProviderProps {
  children: ReactNode;
}

export function ShipmentsProvider({ children }: ShipmentsProviderProps) {
  const { user } = useAuth();
  const { 
    shipments, 
    setShipments, 
    loading, 
    refreshShipmentsData 
  } = useShipmentsData(user);
  
  const { 
    addShipment, 
    updateShipment, 
    deleteShipment, 
    getShipmentById,
    updateStatus
  } = useShipmentOperations(shipments, setShipments);
  
  const {
    getShipmentsByStatus,
    getShipmentsByCarrier,
    getShipmentsByDateRange,
    getShipmentsByCompany,
    getRetainedShipments,
    getUndeliveredShipments
  } = useShipmentFilters(shipments);
  
  const {
    addDocument,
    updateDocument,
    deleteDocument
  } = useShipmentDocuments(shipments, setShipments);
  
  const {
    updateFiscalAction,
    clearFiscalAction,
    updateFiscalActionDetails
  } = useFiscalActions(shipments, setShipments, refreshShipmentsData);

  const checkDuplicateTrackingNumber = (trackingNumber: string): boolean => {
    if (!trackingNumber) return false;
    return shipments.some(shipment => 
      shipment.trackingNumber.toLowerCase() === trackingNumber.toLowerCase()
    );
  };

  const checkDuplicateTrackingNumberForCompany = (trackingNumber: string, companyId: string, excludeId?: string): boolean => {
    if (!trackingNumber || !companyId) return false;
    return shipments.some(shipment => 
      shipment.trackingNumber.toLowerCase() === trackingNumber.toLowerCase() &&
      shipment.companyId === companyId &&
      (!excludeId || shipment.id !== excludeId)
    );
  };
  
  const contextValue = {
    shipments,
    loading,
    addShipment,
    updateShipment,
    deleteShipment,
    getShipmentById,
    addDocument,
    updateDocument,
    deleteDocument,
    updateFiscalAction,
    clearFiscalAction,
    updateFiscalActionDetails,
    updateStatus,
    getShipmentsByStatus,
    getShipmentsByCarrier,
    getShipmentsByDateRange,
    getShipmentsByCompany,
    getRetainedShipments,
    getUndeliveredShipments,
    refreshShipmentsData,
    checkDuplicateTrackingNumber,
    checkDuplicateTrackingNumberForCompany
  };
  
  return (
    <ShipmentsContext.Provider value={contextValue}>
      {children}
    </ShipmentsContext.Provider>
  );
}
