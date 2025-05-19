
import { useState, useEffect, useCallback } from 'react';
import { Shipment, ShipmentStatus } from '@/types/shipment';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { mapShipmentFromSupabase, mapDocumentFromSupabase } from '../utils/shipmentMappers';

export function useShipmentsData(user: any) {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  // Refreshing function with debounce to prevent multiple rapid refreshes
  const refreshShipmentsData = useCallback(() => {
    if (!isRefreshing && Date.now() - lastRefresh > 500) {
      console.log("Manually refreshing shipments data");
      setIsRefreshing(true);
      setRefreshTrigger(prev => prev + 1);
      setLastRefresh(Date.now());
    } else {
      console.log("Refresh request ignored due to debounce");
    }
  }, [isRefreshing, lastRefresh]);

  useEffect(() => {
    const loadShipmentsData = async () => {
      try {
        if (!user) return;
        
        if (!loading && !isRefreshing) setLoading(true);
        console.log("Loading shipments data from database...");
        
        // Get all shipments with fresh data from the database
        const { data: shipmentsData, error: shipmentsError } = await supabase
          .from('shipments')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (shipmentsError) {
          throw shipmentsError;
        }
        
        console.log(`Retrieved ${shipmentsData.length} shipments from database`);
        
        // For each shipment, load its documents and fiscal action if retained
        const shipmentsWithDetailsPromises = shipmentsData.map(async (shipment) => {
          try {
            // Get the documents for this shipment
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
            
            // Always check if there's a fiscal action for this shipment, regardless of retention status
            try {
              // This ensures we have the latest data even if the status flag was incorrect
              const { data: fiscalData, error: fiscalError } = await supabase
                .from('fiscal_actions')
                .select('*')
                .eq('shipment_id', shipment.id)
                .maybeSingle();
              
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
                
                console.log(`Found fiscal action for shipment ${shipment.id}:`, fiscalAction);
                
                // If we have fiscal action but shipment is not marked as retained,
                // we should update the shipment's retention status for consistency
                if (!shipment.is_retained) {
                  console.log(`Shipment ${shipment.id} has fiscal action but isn't marked as retained. Updating status.`);
                  try {
                    await supabase
                      .from('shipments')
                      .update({ 
                        is_retained: true, 
                        status: 'retained',
                        updated_at: new Date().toISOString() 
                      })
                      .eq('id', shipment.id);
                  } catch (updateError) {
                    console.error('Error updating shipment retention status:', updateError);
                  }
                  
                  // Update the local shipment object to reflect this change
                  shipment.is_retained = true;
                  shipment.status = 'retained';
                }
              } else if (fiscalError && fiscalError.code !== 'PGRST116') {
                // Only log as error if it's not just "no rows returned"
                console.error(`Error fetching fiscal action for shipment ${shipment.id}:`, fiscalError);
              } else if (shipment.is_retained && (!fiscalData || fiscalData.length === 0)) {
                console.warn(`Shipment ${shipment.id} is marked as retained but no fiscal action found`);
              }
            } catch (fiscalError) {
              console.error(`Error processing fiscal action for shipment ${shipment.id}:`, fiscalError);
            }
            
            // Return complete shipment with documents and fiscal action
            const mappedShipment = mapShipmentFromSupabase(shipment);
            return {
              ...mappedShipment,
              documents: documentsData ? documentsData.map(mapDocumentFromSupabase) : [],
              fiscalAction,
              // Ensure status is properly set as ShipmentStatus type
              status: mappedShipment.status as ShipmentStatus
            } as Shipment;  // Explicit cast to Shipment
          } catch (error) {
            console.error(`Error processing shipment ${shipment.id}:`, error);
            return mapShipmentFromSupabase(shipment) as Shipment;
          }
        });
        
        // Wait for all shipments to be processed
        const shipmentsWithDetails = await Promise.all(shipmentsWithDetailsPromises);
        
        // Store in localStorage for backup
        localStorage.setItem('velomax_shipments', JSON.stringify(shipmentsWithDetails));
        
        // Update state with explicit type casting
        setShipments(shipmentsWithDetails);
      } catch (error) {
        console.error("Error loading shipments data:", error);
        toast.error("Não foi possível carregar os dados de embarques.");
        
        // Try to load from localStorage if available as fallback
        const storedShipments = localStorage.getItem("velomax_shipments");
        if (storedShipments) {
          try {
            const parsed = JSON.parse(storedShipments);
            setShipments(parsed as Shipment[]);
            console.log("Loaded shipments from local storage as fallback");
          } catch (parseError) {
            console.error("Error parsing stored shipments:", parseError);
            setShipments([]);
          }
        }
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    };
    
    loadShipmentsData();
  }, [user, refreshTrigger]);

  return {
    shipments,
    setShipments,
    loading,
    refreshShipmentsData
  };
}
