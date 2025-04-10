
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Shipment, ShipmentStatus } from "@/types/shipment";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useShipmentOperations } from "./useShipmentOperations";
import { useShipmentFilters } from "./useShipmentFilters";
import { useShipmentDocuments } from "./useShipmentDocuments";
import { useFiscalActions } from "./useFiscalActions";
import { ShipmentCreateData } from "./types";

interface ShipmentsContextType {
  shipments: Shipment[];
  loading: boolean;
  
  // Shipment CRUD operations
  addShipment: (shipment: ShipmentCreateData) => Promise<Shipment>;
  updateShipment: (id: string, shipment: Partial<Shipment>) => Promise<Shipment>;
  deleteShipment: (id: string) => Promise<void>;
  getShipmentById: (id: string) => Shipment | undefined;
  
  // Document operations
  addDocument: ReturnType<typeof useShipmentDocuments>["addDocument"];
  updateDocument: ReturnType<typeof useShipmentDocuments>["updateDocument"];
  deleteDocument: ReturnType<typeof useShipmentDocuments>["deleteDocument"];
  
  // Fiscal action operations
  updateFiscalAction: ReturnType<typeof useFiscalActions>["updateFiscalAction"];
  clearFiscalAction: ReturnType<typeof useFiscalActions>["clearFiscalAction"];
  updateFiscalActionDetails: ReturnType<typeof useFiscalActions>["updateFiscalActionDetails"];
  
  // Status operations
  updateStatus: (shipmentId: string, status: ShipmentStatus) => Promise<void>;
  
  // Filtering operations
  getShipmentsByStatus: ReturnType<typeof useShipmentFilters>["getShipmentsByStatus"];
  getShipmentsByCarrier: ReturnType<typeof useShipmentFilters>["getShipmentsByCarrier"];
  getShipmentsByDateRange: ReturnType<typeof useShipmentFilters>["getShipmentsByDateRange"];
  getShipmentsByCompany: ReturnType<typeof useShipmentFilters>["getShipmentsByCompany"];
  getRetainedShipments: ReturnType<typeof useShipmentFilters>["getRetainedShipments"];
  getUndeliveredShipments: ReturnType<typeof useShipmentFilters>["getUndeliveredShipments"];
}

const ShipmentsContext = createContext<ShipmentsContextType | undefined>(undefined);

interface ShipmentsProviderProps {
  children: ReactNode;
}

export function ShipmentsProvider({ children }: ShipmentsProviderProps) {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  // Custom hooks for different operations
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
  } = useFiscalActions(shipments, setShipments);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        if (user) {
          setLoading(true);
          
          // For now, shipments are stored in localStorage until we create shipments tables
          const storedShipments = localStorage.getItem("velomax_shipments");
          
          if (storedShipments) {
            setShipments(JSON.parse(storedShipments));
          }
        }
      } catch (error) {
        console.error("Error loading shipments data:", error);
        toast.error("Não foi possível carregar os dados de embarques.");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user]);
  
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("velomax_shipments", JSON.stringify(shipments));
    }
  }, [shipments, loading]);
  
  const contextValue: ShipmentsContextType = {
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
  };
  
  return (
    <ShipmentsContext.Provider value={contextValue}>
      {children}
    </ShipmentsContext.Provider>
  );
}

export const useShipments = () => {
  const context = useContext(ShipmentsContext);
  
  if (context === undefined) {
    throw new Error("useShipments must be used within a ShipmentsProvider");
  }
  
  return context;
};
