
import React, { ReactNode, useState, useEffect, useCallback } from "react";
import { Shipment, ShipmentStatus, TransportMode } from "@/types/shipment";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';
import { ShipmentsContext } from "./ShipmentsContext";
import { useShipmentOperations } from "./useShipmentOperations";
import { useShipmentFilters } from "./useShipmentFilters";
import { useShipmentDocuments } from "./useShipmentDocuments";
import { useFiscalActions } from "./useFiscalActions";

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
  
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Function to manually refresh shipment data
  const refreshShipmentsData = useCallback(() => {
    // Prevent multiple simultaneous refresh calls
    if (!isRefreshing) {
      console.log("Manually refreshing shipments data");
      setIsRefreshing(true);
      setRefreshTrigger(prev => prev + 1);
    }
  }, [isRefreshing]);
  
  // Optimize the data loading to prevent unnecessary rerenders and flickering
  useEffect(() => {
    const loadShipmentsData = async () => {
      try {
        if (!user) return;
        
        if (!loading) setLoading(true);
        console.log("Loading shipments data from database...");
        
        // Add a small delay to prevent rapid successive API calls
        // This helps prevent flickering when multiple refresh triggers happen close together
        const { data: shipmentsData, error: shipmentsError } = await supabase
          .from('shipments')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (shipmentsError) {
          throw shipmentsError;
        }
        
        console.log(`Retrieved ${shipmentsData.length} shipments from database`);
        
        // Process all shipments data in one batch to minimize UI updates
        const shipmentsWithDetailsPromises = shipmentsData.map(async (shipment) => {
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
        });
        
        // Wait for all shipments to be processed before updating state
        const shipmentsWithDetails = await Promise.all(shipmentsWithDetailsPromises);
        
        console.log("Finished processing shipments data");
        setShipments(shipmentsWithDetails);
      } catch (error) {
        console.error("Error loading shipments data:", error);
        toast.error("Não foi possível carregar os dados de embarques.");
        
        const storedShipments = localStorage.getItem("velomax_shipments");
        if (storedShipments) {
          try {
            const parsed = JSON.parse(storedShipments);
            setShipments(parsed);
          } catch (parseError) {
            console.error("Error parsing stored shipments:", parseError);
            setShipments([]);
          }
        }
      } finally {
        setLoading(false);
        setIsRefreshing(false); // Reset the refreshing state
      }
    };
    
    loadShipmentsData();
  }, [user, refreshTrigger]);
  
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
    refreshShipmentsData
  };
  
  return (
    <ShipmentsContext.Provider value={contextValue}>
      {children}
    </ShipmentsContext.Provider>
  );
}

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
