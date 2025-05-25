
import { createContext, useContext } from "react";
import { Shipment, ShipmentStatus } from "@/types/shipment";
import { ShipmentCreateData } from "./types";

// Define the context type with focused areas of functionality
interface ShipmentsContextType {
  // Core data
  shipments: Shipment[];
  loading: boolean;
  
  // Basic CRUD operations
  addShipment: (shipment: ShipmentCreateData) => Promise<Shipment>;
  updateShipment: (id: string, shipment: Partial<Shipment>) => Promise<Shipment>;
  deleteShipment: (id: string) => Promise<void>;
  getShipmentById: (id: string) => Shipment | undefined;
  
  // Document operations
  addDocument: (shipmentId: string, document: any) => Promise<any>;
  updateDocument: (shipmentId: string, documentId: string, updatedDocuments: any[]) => Promise<any>;
  deleteDocument: (shipmentId: string, documentId: string) => Promise<void>;
  
  // Fiscal action operations
  updateFiscalAction: (shipmentId: string, fiscalActionData: any) => Promise<any>;
  clearFiscalAction: (shipmentId: string) => Promise<void>;
  updateFiscalActionDetails: (shipmentId: string, actionNumber?: string, releaseDate?: string, notes?: string) => Promise<any>;
  
  // Status operations
  updateStatus: (shipmentId: string, status: ShipmentStatus) => Promise<Shipment | undefined>;
  
  // Query operations
  getShipmentsByStatus: (status: ShipmentStatus) => Shipment[];
  getShipmentsByCarrier: (carrierName: string) => Shipment[];
  getShipmentsByDateRange: (startDate: string, endDate: string) => Shipment[];
  getShipmentsByCompany: (companyId: string) => Shipment[];
  getRetainedShipments: () => Shipment[];
  getUndeliveredShipments: () => Shipment[];
  
  // Data refresh
  refreshShipmentsData: () => void;
  
  // Validation
  checkDuplicateTrackingNumber: (trackingNumber: string) => boolean;
  checkDuplicateTrackingNumberForCompany: (trackingNumber: string, companyId: string, excludeId?: string) => boolean;
}

// Create the context with undefined as initial value
export const ShipmentsContext = createContext<ShipmentsContextType | undefined>(undefined);

/**
 * Hook to use the shipments context
 * @throws Error if used outside of ShipmentsProvider
 */
export const useShipments = () => {
  const context = useContext(ShipmentsContext);
  
  if (context === undefined) {
    throw new Error("useShipments must be used within a ShipmentsProvider");
  }
  
  return context;
};
