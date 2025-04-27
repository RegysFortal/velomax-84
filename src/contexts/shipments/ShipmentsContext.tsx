
import { createContext, useContext } from "react";
import { Shipment, ShipmentStatus } from "@/types/shipment";
import { ShipmentCreateData } from "./types";

interface ShipmentsContextType {
  shipments: Shipment[];
  loading: boolean;
  
  addShipment: (shipment: ShipmentCreateData) => Promise<Shipment>;
  updateShipment: (id: string, shipment: Partial<Shipment>) => Promise<Shipment>;
  deleteShipment: (id: string) => Promise<void>;
  getShipmentById: (id: string) => Shipment | undefined;
  
  addDocument: (shipmentId: string, document: any) => Promise<any>;
  updateDocument: (shipmentId: string, documentId: string, updatedDocuments: any[]) => Promise<any>;
  deleteDocument: (shipmentId: string, documentId: string) => Promise<void>;
  
  updateFiscalAction: (shipmentId: string, fiscalActionData: any) => Promise<any>;
  clearFiscalAction: (shipmentId: string) => Promise<void>;
  updateFiscalActionDetails: (shipmentId: string, actionNumber?: string, releaseDate?: string, notes?: string) => Promise<any>;
  
  updateStatus: (shipmentId: string, status: ShipmentStatus) => Promise<Shipment | undefined>;
  
  getShipmentsByStatus: (status: ShipmentStatus) => Shipment[];
  getShipmentsByCarrier: (carrierName: string) => Shipment[];
  getShipmentsByDateRange: (startDate: string, endDate: string) => Shipment[];
  getShipmentsByCompany: (companyId: string) => Shipment[];
  getRetainedShipments: () => Shipment[];
  getUndeliveredShipments: () => Shipment[];
  refreshShipmentsData: () => void;
  checkDuplicateTrackingNumber: (trackingNumber: string) => boolean;
}

export const ShipmentsContext = createContext<ShipmentsContextType | undefined>(undefined);

export const useShipments = () => {
  const context = useContext(ShipmentsContext);
  
  if (context === undefined) {
    throw new Error("useShipments must be used within a ShipmentsProvider");
  }
  
  return context;
};
