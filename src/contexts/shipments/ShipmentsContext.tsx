import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Shipment, ShipmentStatus, TransportMode } from "@/types/shipment";
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
  
  addShipment: (shipment: ShipmentCreateData) => Promise<Shipment>;
  updateShipment: (id: string, shipment: Partial<Shipment>) => Promise<Shipment>;
  deleteShipment: (id: string) => Promise<void>;
  getShipmentById: (id: string) => Shipment | undefined;
  
  addDocument: ReturnType<typeof useShipmentDocuments>["addDocument"];
  updateDocument: ReturnType<typeof useShipmentDocuments>["updateDocument"];
  deleteDocument: ReturnType<typeof useShipmentDocuments>["deleteDocument"];
  
  updateFiscalAction: ReturnType<typeof useFiscalActions>["updateFiscalAction"];
  clearFiscalAction: ReturnType<typeof useFiscalActions>["clearFiscalAction"];
  updateFiscalActionDetails: ReturnType<typeof useFiscalActions>["updateFiscalActionDetails"];
  
  updateStatus: (shipmentId: string, status: ShipmentStatus) => Promise<Shipment | undefined>;
  
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
    const loadShipmentsData = async () => {
      try {
        if (user) {
          setLoading(true);
          
          const { data: shipmentsData, error: shipmentsError } = await supabase
            .from('shipments')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (shipmentsError) {
            throw shipmentsError;
          }
          
          const shipmentsWithDetails = await Promise.all(shipmentsData.map(async (shipment) => {
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
  
  function mapShipmentFromSupabase(data: any): Shipment {
    return {
      id: data.id,
      companyId: data.company_id,
      companyName: data.company_name,
      transportMode: data.transport_mode as TransportMode,
      carrierName: data.carrier_name,
      trackingNumber: data.tracking_number,
      packages: data.packages,
      weight: data.weight,
      arrivalFlight: data.arrival_flight,
      arrivalDate: data.arrival_date,
      observations: data.observations,
      status: data.status as ShipmentStatus,
      isRetained: data.is_retained,
      deliveryDate: data.delivery_date,
      deliveryTime: data.delivery_time,
      receiverName: data.receiver_name,
      receiverId: data.receiver_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      documents: []
    };
  }
  
  function mapDocumentFromSupabase(data: any) {
    return {
      id: data.id,
      name: data.name,
      type: data.type as "cte" | "invoice" | "delivery_location" | "other",
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
