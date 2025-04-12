
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
  updateStatus: (shipmentId: string, status: ShipmentStatus) => Promise<Shipment | undefined>;
  
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
  
  // Load shipments data from Supabase
  useEffect(() => {
    const loadShipmentsData = async () => {
      try {
        if (user) {
          setLoading(true);
          
          // Fetch shipments from Supabase
          const { data: shipmentsData, error: shipmentsError } = await supabase
            .from('shipments')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (shipmentsError) {
            throw shipmentsError;
          }
          
          // For each shipment, fetch its documents and fiscal action
          const shipmentsWithDetails = await Promise.all(shipmentsData.map(async (shipment) => {
            // Fetch documents for this shipment
            const { data: documentsData, error: documentsError } = await supabase
              .from('shipment_documents')
              .select('*')
              .eq('shipment_id', shipment.id);
            
            if (documentsError) {
              console.error('Error fetching documents:', documentsError);
              return {
                ...mapShipmentFromSupabase(shipment),
                documents: []
              };
            }
            
            // Fetch fiscal action for this shipment if it's retained
            let fiscalAction = undefined;
            if (shipment.is_retained) {
              const { data: fiscalData, error: fiscalError } = await supabase
                .from('fiscal_actions')
                .select('*')
                .eq('shipment_id', shipment.id)
                .single();
              
              if (!fiscalError && fiscalData) {
                fiscalAction = {
                  id: fiscalData.id,
                  actionNumber: fiscalData.action_number,
                  reason: fiscalData.reason,
                  amountToPay: fiscalData.amount_to_pay,
                  paymentDate: fiscalData.payment_date,
                  releaseDate: fiscalData.release_date,
                  notes: fiscalData.notes,
                  createdAt: fiscalData.created_at,
                  updatedAt: fiscalData.updated_at
                };
              }
            }
            
            return {
              ...mapShipmentFromSupabase(shipment),
              documents: documentsData.map(mapDocumentFromSupabase),
              fiscalAction
            };
          }));
          
          setShipments(shipmentsWithDetails);
        }
      } catch (error) {
        console.error("Error loading shipments data:", error);
        toast.error("Não foi possível carregar os dados de embarques.");
        
        // As a fallback, try to load from localStorage
        const storedShipments = localStorage.getItem("velomax_shipments");
        if (storedShipments) {
          setShipments(JSON.parse(storedShipments));
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadShipmentsData();
  }, [user]);
  
  // Helper functions to map database columns to our types
  function mapShipmentFromSupabase(data: any): Shipment {
    return {
      id: data.id,
      companyId: data.company_id,
      companyName: data.company_name,
      transportMode: data.transport_mode,
      carrierName: data.carrier_name,
      trackingNumber: data.tracking_number,
      packages: data.packages,
      weight: data.weight,
      arrivalFlight: data.arrival_flight,
      arrivalDate: data.arrival_date,
      observations: data.observations,
      status: data.status,
      isRetained: data.is_retained,
      deliveryDate: data.delivery_date,
      deliveryTime: data.delivery_time,
      receiverName: data.receiver_name,
      receiverId: data.receiver_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      documents: [] // Will be populated after
    };
  }
  
  function mapDocumentFromSupabase(data: any) {
    return {
      id: data.id,
      name: data.name,
      type: data.type,
      url: data.url,
      notes: data.notes,
      minuteNumber: data.minute_number,
      invoiceNumbers: data.invoice_numbers || [],
      weight: data.weight,
      packages: data.packages,
      isDelivered: data.is_delivered,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }
  
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
